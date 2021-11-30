import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

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
const fs = require("fs");
const fastcsv = require("fast-csv");

async function init(): Promise<void> {
    // startup delay to ensure cloudsql-proxy comes up
    await new Promise((res) => setTimeout(res, 5000));

    // Validate connection
    try {
        await pool.query('SELECT NOW()');
    } catch (e) {
        console.log("Failed to connect to DB: ", e);
        throw e;
    }

    // Migrate the database schema
    // Referenc: https://www.npmjs.com/package/postgres-migrations
    const client = await pool.connect();
    try {
        await migrate({client}, "db-migrations");
    } finally {
        // release the client back to the pool when we're done
        await client.release();
    }

    //for importing game logs from csv file
    const stream = fs.createReadStream("/app/db-migrations/GameLogs.csv");
    const csvData: any[] = [];

    //to ensure that data is only inserted once
    const gameResults = await pool.query("SELECT game_label FROM game_results");
    const fillTable = gameResults.rows;

    //if the rows are empty, fill with raw data
    if (fillTable.length < 1) {
        const csvStream = fastcsv
        .parse()
        .on("data", function(data: any) {
            csvData.push(data);
        })
        .on("end", function() {

            const query = "INSERT INTO game_results (game_label, player_num, player_name, victory_points) VALUES ($1, $2, $3, $4)";

            pool.connect((err, c, done) => {
                if (err) throw err;
                try {
                csvData.forEach(row => {
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

// Verify connection and run migrations on startup
init().catch((e) => {
    console.error("Failed to init db_setup: ", e);
    process.exit(1);
});

interface TestObject {
    id: number;
    name: string;
    score: number;
}

interface GameResults {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

export async function testQueryAll(): Promise<TestObject[]> {
    const res = await pool.query("SELECT id, name, score FROM test_table") 
    return res.rows as TestObject[];
}

export async function getGameResultsFromDb(): Promise<GameResults[]> {
    const res = await pool.query("SELECT id, game_label, player_num, player_name, victory_points FROM game_results");
    return res.rows as GameResults[];
}

//to test data upload
//when page is refreshed, submitted data shows up in raw results table
export function testQueryDataUpload(req: any, res: any): Promise<GameResults[]> {
    const query = "INSERT INTO game_results (game_label, player_num, player_name, victory_points) VALUES ($1, $2, $3, $4)";
    const GameId = req.gameId;
    const Game_Results = req.playerData;

    let PlayerNum = 0; //used to insert player's rank into table in DESC order
    let invalidChars = /[!@#$%^&*()+=[\]{};':"\\|,.<>/?]+/; //used to make sure none of these chars are used in players' names

    //to verify that an array with less than 6 but greater than 2 players' game results is being passed in
    if (Game_Results.length < 2) {
        console.log("Too few players");
        res.status(400).json({
            status: 'error',
            error: 'Must enter a minimum of 2 players',
        });
    }
    else if (Game_Results.length > 6) {
        // console.log("More than 6 players entered / this shouldn't be possible given there are only 6 places to input names");
        res.status(400).json({
            status: 'error',
            error: "More than 6 players entered / this shouldn't be possible given there are only 6 places to input names",
        });
    }

    //used for ordering players' ranking in DESC order
    const playerPoints = new Map();
    Game_Results.forEach((player : any) => {
        const {playerName, victoryPoints} = player;
        playerPoints.set(playerName, victoryPoints);
    });

    const playerPointsSorted = new Map([...playerPoints.entries()].sort((a, b) => b[1] - a[1]));

    //verify that a game_id of less than 10 characters is passed in because usually 8 or 9 characters (e.g. 20200911 - YYYYMMDD or 20200911a - YYYYMMDDa)
    if (Game_Results.length >= 2 && Game_Results.length <= 6 && GameId.length < 10) {
        Game_Results.forEach((result: any) => {
            //gives access to variables from result
            const {playerName, victoryPoints} = result; //equivalent to const playerData = result.playerData; and const victoryPoints = result.victoryPoints

            //server validation
            if (playerName === null || playerName === "") {
                res.status(400).json({
                    status: 'error',
                    error: 'Invalid Player Name',
                });
            } 
            if (victoryPoints === null || !Number.isInteger(victoryPoints)) {
                res.status(400).json({
                    status: 'error',
                    error: 'Invalid Victory Points',
                });
            }

            //check to see if there are any invalid characters in the string (see above for invalid chars)
            if (invalidChars.test(playerName)){ 
                res.status(400).json({
                    status: 'error',
                    error: 'Invalid characters',
                });
            }

            let index = 0;

            //if the player's name and the points match, use that index for the player's ranking in the game (need both to handle ranking ties)
            playerPointsSorted.forEach(function(value, key) {
                index++;
                if (playerName === key && victoryPoints === value) {
                    PlayerNum = index;
                }
            });

            //build list
            const values = [GameId, PlayerNum, playerName, victoryPoints];

            pool.query(query, values, (error: any) => {
            if (error) {
                console.log(error.stack);
                res.status(500).json({
                    status: 'error',
                    error: 'Failed to insert data',
                });
            }
            });
        });
    }

    return getGameResultsFromDb();
}

