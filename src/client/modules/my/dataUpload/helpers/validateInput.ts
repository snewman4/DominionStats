/**
 * Validates the input from the form.
 * Parameters:
 *  input: The object containing the input data.
 * Returns:
 *  A list of error messages that were found during validation. If the data is valid, the list will be empty.
 */
export function validateInput(input: any): string[] {
    let isDataValid = true; //whether the data is valid
    let errors: string[] = []; //list of error messages

    //check game id
    if (!input['gameId']) {
        errors.push('Game ID cannot be blank.');
        isDataValid = false;
    }

    //check each player/victory point pair
    for (let x = 0; x < input['playerData'].length; x++) {
        //check entries are full
        if (
            (input['playerData'][x]['playerName'] &&
                Object.is(input['playerData'][x]['victoryPoints'], NaN)) ||
            (!input['playerData'][x]['playerName'] &&
                !Object.is(input['playerData'][x]['victoryPoints'], NaN))
        ) {
            errors.push(
                'Non-blank entries must have a player name and a victory point count.'
            );
            isDataValid = false;
        }

        //check first entry is not empty
        if (
            x == 0 &&
            !input['playerData'][x]['playerName'] &&
            Object.is(input['playerData'][x]['victoryPoints'], NaN)
        ) {
            errors.push('First entry cannot be blank.');
            isDataValid = false;
        }

        //check no entries out of order
        if (
            x > 0 &&
            input['playerData'][x]['playerName'] &&
            !Object.is(input['playerData'][x]['victoryPoints'], NaN) &&
            !input['playerData'][x - 1]['playerName'] &&
            Object.is(input['playerData'][x - 1]['victoryPoints'], NaN)
        ) {
            errors.push('Please leave no blank rows before entries.');
            isDataValid = false;
        }
    }

    //check >1 entry

    let numNonBlankEntries = 0; //total non blank entries

    //find all valid entries
    for (let row of input['playerData'])
        if (row['playerName'] !== '' && !Object.is(row['victoryPoints'], NaN))
            numNonBlankEntries++;

    if (numNonBlankEntries <= 1)
        errors.push('Input must have at least two entries.');

    //check descending victory points

    let lastScore = Number.POSITIVE_INFINITY; //last visited score

    //validate points
    for (let x = 0; x < input['playerData'].length; x++) {
        //only check non blank entries
        if (!Object.is(input['playerData'][x]['victoryPoints'], NaN)) {
            //make sure score is less than previous score
            if (input['playerData'][x]['victoryPoints'] > lastScore) {
                errors.push(
                    'Please order entries in decreasing victory point order.'
                );
                break;
            }

            lastScore = input['playerData'][x]['victoryPoints'];
        }
    }

    return errors;
}
