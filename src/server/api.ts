import { createServer } from 'lwr';
import bodyParser from 'body-parser';
import compression from 'compression';
import pgSession from 'connect-pg-simple';
import cookieParser from 'cookie-parser';
import type { NextFunction } from 'express';
import expressSession from 'express-session';
import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';

import type { DominionUser } from './common';
import {
    init,
    getPool,
    testQueryAll,
    getGameResultsFromDb,
    insertGameResult,
    insertGameResults,
    insertLog,
    usernameCheck,
    getLogResultsFromDb
} from './db_setup';

function setupRoutes() {
    const lwrServer = createServer({ serverType: 'express' });
    const app = lwrServer.getInternalServer<'express'>();

    app.use(compression());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({ limit: '5mb' }));

    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 3001;
    let PUBLIC_PORT = process.env.PUBLIC_PORT || PORT;
    let SCHEME = 'http://';
    if (HOST !== 'localhost') {
        SCHEME = 'https://';
        PUBLIC_PORT = '443';
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
        throw new Error(
            'Missing environment variables: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET'
        );
    }
    const SESSION_SECRET = process.env.SESSION_SECRET;
    if (!SESSION_SECRET) {
        throw new Error('Missing environment variable: SESSION_SECRET');
    }
    const ALLOWLIST_EMAILS: string[] = (process.env.ALLOWLIST || '').split(',');

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    function assertIsUser(user: unknown): user is DominionUser {
        if (!user) {
            throw new Error('User cannot be null');
        }
        if (typeof user !== 'object') {
            throw new Error('User is not an object');
        }
        const obj: any = user;
        if (typeof obj.name !== 'string' || obj.name === '') {
            throw new Error('User must have a name');
        }
        if (typeof obj.email !== 'string' || obj.email === '') {
            throw new Error('User must have an email');
        }
        return true;
    }

    passport.deserializeUser(function (user, done) {
        try {
            if (assertIsUser(user)) {
                return done(null, user);
            }
            return done('Object could not be cast to user: ' + user);
        } catch (e: any) {
            return done(e.message);
        }
    });

    function ensureLoggedIn(options: { throw?: boolean }) {
        // eslint-disable-next-line no-undef
        return (req: Express.Request, res: any, next: NextFunction) => {
            if (!req.isAuthenticated || !req.isAuthenticated()) {
                if (options.throw) {
                    return res.status(403).send();
                }
                return res.redirect('/login/google');
            }
            next();
            return undefined;
        };
    }
    passport.use(
        new passportGoogle.Strategy(
            {
                clientID: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET,
                callbackURL: `${SCHEME}${HOST}:${PUBLIC_PORT}/oauth2/redirect/accounts.google.com`,
                scope: ['profile', 'email']
            },
            function (
                accessToken: string,
                refreshToken: string,
                profile: passportGoogle.Profile,
                cb: passportGoogle.VerifyCallback
            ) {
                if (
                    !profile ||
                    !profile.emails ||
                    profile.emails.length === 0 ||
                    !profile.emails[0] ||
                    !profile.emails[0].value ||
                    !profile.emails[0].verified
                ) {
                    console.error(
                        'User has no email attached or is unverified: ',
                        profile
                    );
                    return cb(
                        'User has no email attached or is unverified: ' +
                            profile?.emails
                    );
                }
                const emails = profile?.emails?.filter((ev) => ev.verified);
                if (!emails) {
                    return cb('User has no verified emails');
                }

                const allowedEmail = emails.find((ev) =>
                    ALLOWLIST_EMAILS.includes(ev.value)
                );
                if (!allowedEmail) {
                    return cb('User is not authorized to use these features');
                }

                const user: DominionUser = {
                    email: allowedEmail.value,
                    name: profile.displayName
                };
                return cb(null, user);
            }
        )
    );

    app.use(cookieParser());
    if (!process.env.NODB && !process.env.INMEM_SESSION) {
        app.use(
            expressSession({
                store: new (pgSession(expressSession))({
                    // Insert connect-pg-simple options here
                    pool: getPool()
                }),
                secret: SESSION_SECRET,
                resave: false,
                cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 days
                // Insert express-session options here
            })
        );
    } else {
        app.use(
            expressSession({
                secret: SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: { maxAge: 24 * 3600 * 1000 }
            })
        );
    }
    app.use(passport.initialize());
    app.use(passport.session());

    const COOKIE_USERNAME = 'dominionstats-username';
    app.get('/login/google', passport.authenticate('google'));
    app.get('/logout', (req, res) => {
        req.logout();
        res.clearCookie(COOKIE_USERNAME);
        res.redirect('/');
    });

    app.get(
        '/oauth2/redirect/accounts.google.com',
        passport.authenticate('google', {
            failureRedirect: '/',
            failureMessage: true
        }),
        function (req, res, next) {
            if (req.user && assertIsUser(req.user)) {
                if (req.user?.name !== req.cookies[COOKIE_USERNAME]) {
                    // if user successfully signed in, store user.name in cookie
                    if (req.user) {
                        res.cookie(COOKIE_USERNAME, req.user.name, {
                            // expire in year 9999 (from: https://stackoverflow.com/a/28289961)
                            expires: new Date(253402300000000),
                            httpOnly: false // allows JS code to access it
                        });
                    } else {
                        res.clearCookie(COOKIE_USERNAME);
                    }
                }
            }
            next();
        },
        function (req, res) {
            res.redirect('/');
        }
    );
    app.get('/guarded', ensureLoggedIn({}), (req, res) => {
        res.send('Logged in as: ' + JSON.stringify(req.user));
    });

    app.get(
        '/api/v1/testObjects',
        ensureLoggedIn({ throw: true }),
        async (req, res) => {
            if (process.env.NODB) {
                return res.status(501).send();
            }
            return res.json(await testQueryAll());
        }
    );

    // Old API access to endpoint, use for single data insertion
    app.post(
        '/api/v1/gameResults',
        ensureLoggedIn({ throw: true }),
        async (req, res) => {
            if (process.env.NODB) {
                return res.status(501).send();
            }
            const insertResult = await insertGameResult(req.body);
            return res.status(insertResult.status).json(insertResult.results);
        }
    );

    // New API access to endpoint, use for bulk data insertion
    app.post(
        '/api/v1/bulkGameResults',
        ensureLoggedIn({ throw: true }),
        async (req, res) => {
            if (process.env.NODB) {
                return res.status(501).send();
            }
            const insertResult = await insertGameResults(req.body);
            return res.status(insertResult.status).json(insertResult.results);
        }
    );

    // API access to endpoint for username workflow
    app.post(
        '/api/v1/usernameCheck',
        ensureLoggedIn({ throw: true }),
        async (req, res) => {
            if (process.env.NODB) {
                return res.status(501).send();
            }

            const usernameCheckResult = await usernameCheck(req.body);
            return res
                .status(usernameCheckResult.status)
                .json(usernameCheckResult.results);
        }
    );

    // New API access to endpoint, use for log data insertion
    app.post(
        '/api/v1/logUpload',
        ensureLoggedIn({ throw: true }),
        async (req, res) => {
            if (process.env.NODB) {
                return res.status(501).send();
            }

            const logInsertResult = await insertLog(req.body);
            return res
                .status(logInsertResult.status)
                .json(logInsertResult.results);
        }
    );

    app.get('/api/v1/gameResults', async (req, res) => {
        if (process.env.NODB) {
            return res.status(501).send();
        }
        return res.json(await getGameResultsFromDb());
    });

    app.get('/api/v1/logData', async (req, res) => {
        if (process.env.NODB) {
            return res.status(501).send();
        }
        return res.json(await getLogResultsFromDb());
    })

    /*
    // Serve LWC content
    app.use(express.static(DIST_DIR));

    app.use('/', (req, res) => {
        res.sendFile(path.resolve(DIST_DIR, 'index.html'));
    });
    */

    lwrServer
        .listen(
            ({ port, serverMode }: { port: Number; serverMode: string }) => {
                console.log(
                    `✅  ${serverMode} Server started: http://${HOST}:${port}`
                );
            }
        )
        .catch((err: Error) => {
            console.error(err);
            process.exit(1);
        });
}

if (!process.env.NODB) {
    // Verify connection and run migrations on startup
    init()
        .catch((e) => {
            console.error('Failed to init db_setup: ', e);
            process.exit(1);
        })
        .then(setupRoutes);
} else {
    setupRoutes();
}
