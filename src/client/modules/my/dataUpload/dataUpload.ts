import { LightningElement } from 'lwc';
import { validateInput } from './helpers/validateInput';

interface GameData {
    gameId: string;
    playerData: PlayerData[];
}
interface PlayerData {
    playerName: string;
    victoryPoints: number;
}

export default class DataUploader extends LightningElement {
    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend(): void {
        let playerData: PlayerData[] = []; //data for each player input

        //get entered player data
        for (let x = 0; x < 6; x++) {
            playerData.push({
                playerName: this.getValueFromInput(
                    'playerName' + (x + 1).toString()
                ).trim(),
                victoryPoints: parseInt(
                    this.getValueFromInput(
                        'victoryPoints' + (x + 1).toString().trim()
                    ),
                    10
                )
            });
        }

        //data for post
        let data = {
            gameId: this.getValueFromInput('gameId'),
            playerData: playerData
        };

        let errorMessages = validateInput(data); //validate input data

        //if no errors were found
        if (errorMessages.length == 0) {
            let newPlayerData: PlayerData[] = []; //player data without blank entries

            //remove blank input entries
            for (let playerEntry of data.playerData) {
                if (
                    playerEntry.playerName !== '' &&
                    !Object.is(playerEntry.victoryPoints, NaN)
                ) {
                    newPlayerData.push({
                        playerName: playerEntry.playerName,
                        victoryPoints: playerEntry.victoryPoints
                    });
                }
            }

            data.playerData = newPlayerData; //reassign data

            console.log('Sending data: ', data);

            //send POST request to api
            fetch('api/v1/gameResults', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((response) => {
                //check response from server
                if (response.status == 200) location.reload();
                //refresh page
                else if (response.status >= 400) {
                    this.setErrorMessage(
                        'Something went wrong with the data upload. Please try again.'
                    );
                    console.error('Error inserting game results: ', response);
                }
            });
        } else {
            this.setErrorMessage(errorMessages.join('\n'));
        }
    }

    setErrorMessage(errorString: string): void {
        const errorElement: HTMLParagraphElement | null =
            this.template.querySelector('p[name="errorMessage"]');
        if (errorElement) {
            errorElement.textContent = errorString; //set error text
            errorElement.hidden = false; //show error message
        }
    }

    /**
     * Gets the value from the input field with the given name.
     * Parameters:
     *  name: The name of the input field in HTML.
     * Returns:
     *  The value currently in the input field. Can be null.
     */
    getValueFromInput(name: string): string {
        const e: HTMLInputElement | null = this.template.querySelector(
            'input[name="' + name + '"]'
        );
        if (e) {
            return e.value;
        }
        return '';
    }
}
