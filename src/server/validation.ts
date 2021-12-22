import type { ErrorObject, PlayerResultForm } from './common';

const invalidChars = /[!@#$%^&*()+=[\]{};':"\\|,.<>/?]+/; //used to make sure none of these chars are used in players' names
const invalidPrefix = /^[ \t/]+.*/;
const invalidSuffix = /.*[ \t]+$/;
const gameIdStructure = /^[0-9]{8}[a-z]$/;

export function validateGameData(
    gameId: string,
    gameResults: PlayerResultForm[]
): ErrorObject[] {
    const errors: ErrorObject[] = [];

    if (!gameResults) {
        errors.push({
            status: 'error',
            error: 'Missing gameResults'
        });
        // Return immediately because this is a critical error that affects further checks
        return errors;
    }

    //to verify that an array with less than 6 but greater than 2 players' game results is being passed in
    if (gameResults.length < 2) {
        errors.push({
            status: 'error',
            error: 'Must enter a minimum of 2 players'
        });
    }

    if (gameResults.length > 6) {
        errors.push({
            status: 'error',
            error: "More than 6 players entered / this shouldn't be possible given there are only 6 places to input names"
        });
    }

    //verify that a game_id matches the YYYYMMDDa structure
    if (gameId.length !== 9 || !gameIdStructure.test(gameId)) {
        errors.push({
            status: 'error',
            error: `Game ID must be 2-10 characters; got: "${gameId}"`
        });
    }

    gameResults.forEach(({ playerName, playerPlace, victoryPoints }) => {
        //server validation
        if (playerName === null || playerName === '') {
            errors.push({
                status: 'error',
                error: `Invalid Player Name; cannot be null or empty-string`
            });
        }
        if (victoryPoints === null || !Number.isInteger(victoryPoints)) {
            errors.push({
                status: 'error',
                error: `Invalid Victory Points for player ${playerName}: ${victoryPoints}`
            });
        }
        if (playerPlace === null || !Number.isInteger(playerPlace)) {
            errors.push({
                status: 'error',
                error: `Invalid Place for player ${playerName}: ${playerPlace}`
            });
        }

        //check to see if there are any invalid characters in the string (see above for invalid chars)
        if (
            invalidChars.test(playerName) ||
            invalidPrefix.test(playerName) ||
            invalidSuffix.test(playerName)
        ) {
            errors.push({
                status: 'error',
                error: `Invalid characters in playerName: "${playerName}"`
            });
        }
    });

    return errors;
}
