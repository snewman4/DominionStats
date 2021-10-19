// Simple Express server setup to serve the build output
import compression from 'compression';
import helmet from 'helmet';
import express from 'express';
import path from 'path';

//to import queries from DB service
import { testQueryAll, testQueryAll2} from './db_setup';

const app = express();
app.use(compression());

const HOST = process.env.HOST || 'localhost';
if (HOST !== 'localhost') {
    app.use(helmet());
    app.use(helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                "upgrade-insecure-requests": null
        
            }
        },
        noSniff: undefined,
    }));
}
const PORT = process.env.PORT || 3001;
const DIST_DIR = './dist';

// Respond to API endpoints
app.get('/api/v1/endpoint', (req: any, res: any) => {
    res.json({ success: true });
});

app.get('/api/v1/testObjects', async (req: any, res: any) => {
    res.json(await testQueryAll());
});

app.get('/api/v1/gameLogs', async (req: any, res: any) => {
    res.json(await testQueryAll2());
});

// Serve LWC content
app.use(express.static(DIST_DIR));

app.use('/', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);