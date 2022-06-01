import pg from 'pg';
const Pool = pg.Pool;
import { migrate } from 'postgres-migrations';
import { validateGameData } from './validation';
import type {
    TestObject,
    GameResultsDB,
    ErrorObject,
    GameResultsForm,
    PlayerResultForm,
    GameResultsFormResult
} from './common';
import type {
    PlayerTurn,
    PlayedCard
} from './log_values';

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

//Function for adding a log to the log database
export async function insertLog(log: string): Promise<GameResultsFormResult> {
    // TODO: implement

    // TODO : Extract from the log just the log element of the JSON
    // TODO : Fill in function with gameID, list of players, and log portion of JSON
    let dataValues: PlayerTurn[] = parseLog("", [], "");
    
    //Placeholder return statement
    return { status: 200, results: [] };
}

// TODO (?) : Make a new file to contain all of these helper functions

// Helper function to parse the actual log of the game
function parseLog(gameID: string, players: string[], log: string): PlayerTurn[] {
    let game: string[] = trimLog(log);

    let fullGame: PlayerTurn[] = [];

    for(let turn of game) {
        let turnResult: PlayerTurn | null = handleTurn(gameID, turn);
        if(turnResult != null) {
            fullGame.push(turnResult);
        }
    }

    return fullGame;
}

// Helper function for trimming a log
function trimLog(log: string): string[] {
    //TODO: implement, may need more processing

    //Removes < > and any characters between them
    log = log.replace(/\<[\s\S]*?\>/g, "");
    return log.split('Turn'); // Splits game up into turns
}

// TODO : Lots of work for handleTurn :(
// Helper function to handle the individual turn of a game
function handleTurn(gameID: string, turn: string) {
    // Split up the turn into sentences
    let splitTurn: string[] = turn.split('  ');

    // Remove unnecessary spaces
    splitTurn = splitTurn.filter(element => { return element !== ''; }).map(element => element.trim());

    console.log(splitTurn); //TODO: remove when done testing

    // Check if this is a turn or the beginning of the game
    // TODO : Better handling of not-a-turn
    if(isNaN(Number(splitTurn[0][0]))) {
        return null;
    }

    let activeTurn: number = 0;
    let activePlayer: string = "";
    let playedCards: PlayedCard[] = [];
    let purchasedCards: PlayedCard[] = [];

    for(let sentence of splitTurn) {
        let splitSentence = sentence.split(' ');
        // Handles the first sentence of the turn, w/ turn number and name
        if(!isNaN(Number(splitSentence[0]))) {
            activeTurn = Number(splitSentence[0]);
            activePlayer = sentence.substring(sentence.indexOf("-") + 2);
            continue;
        }else if(splitSentence.length > 1 && splitSentence[1] === "plays"){
            //Handles a played card

            //Default values for tracking information
            let cardName: string = "";
            let phase = 'action';
            let durationResolve = false;
            let usedVillagers = false;

            let cardStartIndex = 0;
            let amount = 1;


            for(let i = 2; i < splitSentence.length; i++){
                if(splitSentence[i] === "a" || splitSentence[i] === "an"){
                    //Start tracking for start of a card name
                    cardStartIndex = i+1;
                    amount = 1;
                }else if(!isNaN(Number(splitSentence[i]))){
                    //If the current string is a number, denoting multiple of a card
                    cardStartIndex = i+1;
                    amount = Number(splitSentence[i]);
                }else if(splitSentence[i].slice(-1) === "." || splitSentence[i] === "and"){
                    //If the current string ends in a . it is the end of the name of the card
                    if(splitSentence[i].slice(-1) === "."){
                        cardName = splitSentence.slice(cardStartIndex, i+1).join(" ");
                        cardName = cardName.slice(0,-1) //Get rid of period
                    }else{
                        cardName = splitSentence.slice(cardStartIndex, i).join(" ");
                    }

                    if(amount > 1){
                        cardName.slice(0,-1); //Chop off 's' from card name
                                              //May not work in every case, TODO: needs testing
                    }

                    //Append card to card array
                    //TODO: implement other parameters for the card such as phase
                    for(let i = 0; i < amount; i++){
                        playedCards.push({card: cardName,  effect: [], phase: 'action', durationResolve: durationResolve, usedVillagers: usedVillagers});
                    }
                }
            }
        }
    }

    let thisTurn: PlayerTurn = {
        gameId: gameID,
        playerTurn: activeTurn,
        playerName: activePlayer,
        playedCards: playedCards,
        purchasedCards: purchasedCards
    }

    return thisTurn;
}