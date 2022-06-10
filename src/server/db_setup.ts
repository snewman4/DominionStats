import pg from 'pg';
const Pool = pg.Pool;
import { migrate } from 'postgres-migrations';
import { validateGameData } from './validation';
import { parseLog } from './log_parser';
import type {
    TestObject,
    GameResultsDB,
    ErrorObject,
    GameResultsForm,
    PlayerResultForm,
    GameResultsFormResult,
    UsernameFormResult,
    LogFormResult,
    UsernameMapping,
    GameLogServer
} from './common';
import type { PlayerTurn } from './log_values';

/**
 * Single global pool to be used for all queries
 * Grabs connection info out of environment variables:
 * PGUSER       default=??
 * PGHOST       default=localhost
 * PGPASSWORD   default=??
 * PGDATABASE   default=postgres
 * PGPORT       default=5432
 */
const pool = new Pool();

//for importing from csv file
import fs from 'fs';
import fastcsv from 'fast-csv';

export function getPool() {
    return pool;
}

export async function init(): Promise<void> {
    // startup delay to ensure cloudsql-proxy comes up
    await new Promise((res) => setTimeout(res, 5000));

    // Validate connection
    try {
        await pool.query('SELECT NOW()');
    } catch (e) {
        console.log('Failed to connect to DB: ', e);
        throw e;
    }

    // Migrate the database schema
    // Referenc: https://www.npmjs.com/package/postgres-migrations
    const client = await pool.connect();
    try {
        const results = await migrate({ client }, 'db-migrations');
        console.log('DB Migration: ', results);
    } finally {
        // release the client back to the pool when we're done
        await client.release();
    }

    //for importing game logs from csv file
    const gameCSV =
        process.env.HOST === 'localhost'
            ? 'db-migrations/GameLogs.csv'
            : '/app/db-migrations/GameLogs.csv';
    const stream = fs.createReadStream(gameCSV);
    const csvData: any[] = [];

    //to ensure that data is only inserted once
    const gameResults = await pool.query('SELECT game_label FROM game_results');
    const fillTable = gameResults.rows;

    //if the rows are empty, fill with raw data
    if (fillTable.length < 1) {
        const csvStream = fastcsv
            .parse()
            .on('data', function (data: any) {
                csvData.push(data);
            })
            .on('end', function () {
                const query =
                    'INSERT INTO game_results (game_label, player_num, player_name, victory_points) VALUES ($1, $2, $3, $4)';

                pool.connect((err, c, done) => {
                    if (err) throw err;
                    try {
                        csvData.forEach((row) => {
                            client.query(query, row, (error) => {
                                if (error) {
                                    console.log(error.stack);
                                }
                            });
                        });
                    } finally {
                        done();
                    }
                });
            });
        stream.pipe(csvStream);
    }
}

export async function testQueryAll(): Promise<TestObject[]> {
    const res = await pool.query('SELECT id, name, score FROM test_table');
    return res.rows as TestObject[];
}

export async function getGameResultsFromDb(): Promise<GameResultsDB[]> {
    const res = await pool.query(
        'SELECT id, game_label, player_num, player_name, victory_points FROM game_results'
    );
    return res.rows as GameResultsDB[];
}

function flatArray<T>(arrarr: T[][]): T[] {
    return arrarr.reduce((acc, val) => acc.concat(val), []);
}

//Submitting an individual game
// This is the original, tried and true function
export async function insertGameResult(
    req: GameResultsForm
): Promise<GameResultsFormResult> {
    const query =
        'INSERT INTO game_results (game_label, player_num, player_name, victory_points) VALUES ($1, $2, $3, $4)';
    const gameId = req.gameId.trim();

    // Clean up the input a bit
    let gameResults: PlayerResultForm[] = req.playerData;

    const validationErrors = validateGameData(gameId, gameResults);

    if (validationErrors.length > 0) {
        console.log('Validation errors: ', validationErrors);
        return Promise.resolve({ status: 400, results: validationErrors });
    }

    gameResults = gameResults
        // Clean up the input a bit (trim spaces)
        .map(({ playerName, victoryPoints, playerPlace }) => {
            return {
                playerName: playerName.trim(),
                victoryPoints,
                playerPlace
            };
        });

    const insertErrors: ErrorObject[] = flatArray(
        await Promise.all(
            gameResults.map(
                ({
                    playerName,
                    victoryPoints,
                    playerPlace
                }): Promise<ErrorObject[]> => {
                    //build list
                    const values = [
                        gameId,
                        playerPlace,
                        playerName,
                        victoryPoints
                    ];

                    return pool
                        .query(query, values)
                        .then(() => [])
                        .catch((error) => {
                            console.log('DB Error:', error);
                            return [
                                {
                                    status: 'error',
                                    error: 'Failed to insert data'
                                }
                            ];
                        });
                }
            )
        )
    );

    if (insertErrors.length > 0) {
        // Failures to insert are considered developer errors (or infra) aka 500
        console.log('Insert errors: ', insertErrors);
        return { status: 500, results: insertErrors };
    }

    // TODO: Could return latest DB results here
    return { status: 200, results: [] };
}

// Checks the existence of an ID in the database
// Returns list of errors, one for each duplicate ID
export async function checkGameIdExists(
    gameId: string[]
): Promise<ErrorObject[]> {
    //Create an array of $#'s
    let params: string[] = [];
    for (let i = 1; i <= gameId.length; i++) {
        params.push('$' + i);
    }

    // TODO : Convert to simpler method : ... WHERE game_label = ANY($1::string[])
    // https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
    let queryText: string =
        'SELECT DISTINCT game_label FROM game_results WHERE game_label IN (' +
        params.join(',') +
        ')';
    const res = await pool.query(queryText, gameId);

    //Create the reutrn value
    let allErrors: ErrorObject[] = [];

    for (let row of res.rows) {
        const dupError: ErrorObject = {
            status: 'error',
            error: 'Duplicate ID entered, no data uploaded: '.concat(
                row.game_label
            )
        };
        allErrors.push(dupError);
    }

    return allErrors;
}

//to test data upload
//when page is refreshed, submitted data shows up in raw results table
// This is the new function that can handle multiple insertions
export async function insertGameResults(
    allReq: GameResultsForm[]
): Promise<GameResultsFormResult> {
    let result;
    let allErrors: ErrorObject[] = [];

    // Check all game IDs being inserted
    const allIds: string[] = [];
    for (let req of allReq) {
        allIds.push(req.gameId);
    }

    let gameIdExists = await checkGameIdExists(allIds);

    if (gameIdExists.length > 0) {
        return { status: 409, results: gameIdExists };
    }

    //Loops for additional game data
    for (let req of allReq) {
        // If not a duplicate, insert it
        result = await insertGameResult(req);
        //If the result is a user input error
        if (result.status == 500 || result.status == 400) {
            allErrors = allErrors.concat(result.results);
        }
    }

    if (allErrors.length != 0) {
        //If there was an eror return a status of 500 and all errors
        return { status: 500, results: allErrors };
    } else {
        //Other wise return success
        return { status: 200, results: [] };
    }
}

// Function to verify the existence of usernames in the DB
export async function usernameCheck(
    usernames: string[]
): Promise<UsernameFormResult> {
    let userList: UsernameMapping[] = [];
    let allErrors: ErrorObject[] = [];

    //Create an array of $#'s
    let params: string[] = [];
    for (let i = 1; i <= usernames.length; i++) {
        params.push('$' + i);
    }

    // TODO : Convert to simpler method : ... WHERE game_label = ANY($1::string[])
    // https://stackoverflow.com/questions/10720420/node-postgres-how-to-execute-where-col-in-dynamic-value-list-query
    let queryText: string =
        'SELECT DISTINCT * FROM known_usernames WHERE username IN (' +
        params.join(',') +
        ')';
    const res = await pool.query(queryText, usernames);

    // Add elements that were defined in the database
    for (let row of res.rows) {
        userList.push({
            username: row.username,
            playerName: row.player_name,
            playerSymbol: ''
        });
    }

    // Add elements that were not defined in the database
    for (let username of usernames) {
        if (
            userList.filter((element) => element.username === username)
                .length === 0
        ) {
            userList.push({
                username: username,
                playerName: '',
                playerSymbol: ''
            });
        }
    }

    // Attempt to generate unique symbols
    try {
        userList = userSymbolGenerator(userList);
    } catch (e: any) {
        console.log('Username symbol error: ' + e.message);
        allErrors.push({ status: 'error', error: e.message });
    }

    if (allErrors.length != 0) {
        return { status: 400, results: allErrors };
    }
    return { status: 200, results: userList };
}

// Helper function to generate username symbols
export function userSymbolGenerator(
    names: UsernameMapping[]
): UsernameMapping[] {
    let dupSym: string | undefined;
    for (let name of names) {
        // If duplicate username, error
        if (
            names.filter((element) => element.username === name.username)
                .length > 1
        )
            throw new Error(
                'Duplicate usernames in player names: ' + name.username
            );
        // If symbols are undefined
        if (name.playerSymbol === '') name.playerSymbol = name.username[0];
        // Check for duplicate symbols
        if (
            names.filter(
                (element) => element.playerSymbol === name.playerSymbol
            ).length > 1
        ) {
            dupSym = name.playerSymbol;
            break;
        }
    }

    // No duplicates
    if (dupSym === undefined) return names;

    let duplicateNames = names.filter(
        (element) => element.playerSymbol === dupSym
    );
    let updated = false; // Makes sure that at least one element was updated
    for (let name of duplicateNames) {
        if (name.username.length > dupSym.length) {
            // For each name, add an extra character to the symbol
            name.playerSymbol = name.username.slice(0, dupSym.length + 1);
            updated = true;
        }
        // If the symbol is as long as the username, then it cannot be extended further
    }
    if (!updated)
        throw new Error(
            'Unable to generate unique symbol. Closest form: ' + dupSym
        );
    return userSymbolGenerator(names);
}

//Function for adding a log to the log database
export async function insertLog(log: GameLogServer[]): Promise<LogFormResult> {
    let allErrors: ErrorObject[] = [];
    let allTurns: PlayerTurn[] = [];

    let gameID: string;
    let players: UsernameMapping[];
    let gameLog: string;
    for (let item of log) {
        gameID = item.gameID;
        // TODO : Add player names to database
        // TODO : May need to use JSON.parse() and some other things to get this to work
        players = item.players;

        //Adding player names to the database if needed

        //Add uknown users to the database

        let usernames = players.map((player) => player.username);
        let userQuery = 'SELECT * FROM known_usernames WHERE username IN (' +
        usernames.join(',') +
        ')';

        //Get usernames and filter
        let dominionNames = await pool.query(userQuery);
        let dominionUsernames = dominionNames.rows.map((player) => player[0] as string); //may need to test this line
        usernames = usernames.filter(name => !dominionUsernames.includes(name));

        //Add users that aren't in the database
        let userAddQuery = 'INSERT INTO game_results (username, player_name) VALUES ($1, $2)';
        for(let user in usernames){
            let currentPlayer = players.find((player) => {
                return player.username === user;
            });
            if(currentPlayer == undefined){
                throw new Error("There was an error while adding a user");
            }
            await pool.query(userAddQuery, [currentPlayer.username,currentPlayer.playerName]);
        }
        
        

        // TODO : Remove, currently for testing usernames
        console.log(players);

        gameLog = item.log;
        // Check that all of the above elements actually exist in log
        if (
            gameID === undefined ||
            players === undefined ||
            gameLog === undefined
        ) {
            allErrors.push({
                status: 'error',
                error: 'Log does not match expected format'
            });
            break;
        } else {
            // TODO : Verify that this error handling actually catches correctly,
            // and returns the correct message
            try {
                allTurns = parseLog(gameID, players, gameLog);
                const query =
                    'INSERT INTO log_game_round (game_label, player_turn, turn_index, player_name, cards_played, cards_purchased) VALUES ($1, $2, $3, $4, $5, $6)';

                //Loop through each turn
                for (let turn of allTurns) {
                    //Set values for the data
                    const values = [
                        turn.gameId,
                        turn.playerTurn,
                        turn.turnIndex,
                        turn.playerName,
                        JSON.stringify(turn.playedCards),
                        JSON.stringify(turn.purchasedCards)
                    ];

                    //Make query to the server
                    pool.query(query, values)
                        .then(() => [])
                        .catch((error) => {
                            console.log('DB Error while adding log: ', error);
                            return { status: 500, results: [] };
                        });
                }
            } catch (e: any) {
                console.log('Log error: ' + e.message);
                allErrors.push({
                    status: 'error',
                    error: e.message
                });
            }

            // TODO : Add data to database
        }
    }

    if (allErrors.length != 0) {
        return { status: 400, results: allErrors };
    } else {
        return { status: 200, results: allTurns };
    }
}
