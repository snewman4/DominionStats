import type { GameData, PlayerData } from './types';

export function isEmptyName(s: string): boolean {
    return !s;
}
export function isEmptyNumber(n: number): boolean {
    return (
        n === null ||
        n === undefined ||
        Object.is(n, NaN) ||
        typeof n !== 'number'
    );
}

export function allEmpty(p: PlayerData): boolean {
    return (
        isEmptyName(p.playerName) &&
        isEmptyNumber(p.playerPlace) &&
        isEmptyNumber(p.victoryPoints)
    );
}
export function anyEmpty(p: PlayerData): boolean {
    return (
        isEmptyName(p.playerName) ||
        isEmptyNumber(p.playerPlace) ||
        isEmptyNumber(p.victoryPoints)
    );
}
export function validPlace(p: PlayerData): boolean {
    return p.playerPlace >= 1 && p.playerPlace <= 6;
}

export const ERRORS = {
    NO_EMPTY_VALUES:
        'Non-blank entries must have a player name, place, and victory points',
    PLACE_RANGE: 'Player place must be between (including) 1 and 6',
    NO_BLANKS: 'Please leave no blank rows before entries.',
    NO_GAMEID: 'Game ID cannot be blank.',
    MINIMUM_ENTRIES: 'Input must have at least two entries.',
    DECREASING_VP: 'Please order entries in decreasing victory point order.',
    INCREASING_PLACE: 'Please order entries in increasing place order',
    TIE_VP: 'Players that tie place must have equal victory points'
};

export function validateFilledData(pd: PlayerData[]): string[] {
    const errors: string[] = [];
    let remainingEmpty = false;
    pd.forEach((p, i) => {
        if (!remainingEmpty) {
            // transition to expecting all empty only if all the values are empty
            if (allEmpty(p) && i > 0) {
                remainingEmpty = true;
                return; // continue
            }

            // expected all values filled in
            if (anyEmpty(p)) {
                errors.push(ERRORS.NO_EMPTY_VALUES);
            }
            if (!validPlace(p)) {
                errors.push(ERRORS.PLACE_RANGE);
            }
        } else {
            // expected to be empty
            if (!allEmpty(p)) {
                errors.push(ERRORS.NO_BLANKS);
            }
        }
    });
    return errors;
}

/**
 * Validates the input from the form.
 * Parameters:
 *  input: The object containing the input data.
 * Returns:
 *  A list of error messages that were found during validation. If the data is valid, the list will be empty.
 */
export function validateInput(input: GameData[]): string[] {
    let errors: string[] = []; //list of error messages
    for(let data of input){
    //check game id
    if (!data['gameId']) {
        errors.push(ERRORS.NO_GAMEID);
    }

    const filledDataErrors = validateFilledData(data.playerData);
    if (filledDataErrors.length > 0) {
        errors.push(...filledDataErrors);
    }

    let numNonBlankEntries = 0; //total non blank entries
    //find all valid entries
    for (let row of data['playerData'])
        if (!allEmpty(row)) numNonBlankEntries++;

    if (numNonBlankEntries <= 1) errors.push(ERRORS.MINIMUM_ENTRIES);

    //check descending victory points and place

    let lastScore = Number.POSITIVE_INFINITY; //last visited score
    let lastPlace = 0;

    //validate points
    for (let x = 0; x < data['playerData'].length; x++) {
        let player: PlayerData = data['playerData'][x];
        //only check non blank entries
        if (!anyEmpty(player)) {
            //make sure score is less than previous score
            if (player.victoryPoints > lastScore) {
                errors.push(ERRORS.DECREASING_VP);
            }
            if (player.playerPlace < lastPlace) {
                errors.push(ERRORS.INCREASING_PLACE);
            }
            if (
                player.playerPlace === lastPlace &&
                player.victoryPoints !== lastScore
            ) {
                errors.push(ERRORS.TIE_VP);
            }

            lastScore = player.victoryPoints;
            lastPlace = player.playerPlace;
        }
    }
    }
    return errors;
}
