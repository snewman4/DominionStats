import { LightningElement } from 'lwc';
import { validateInput } from './helpers/validateInput';
import type { GameData, PlayerData } from './helpers/types';

const todaysDate = new Date();
const year = todaysDate.getFullYear();
const month = (todaysDate.getMonth() + 1).toString().padStart(2, '0');
const day = todaysDate.getDate().toString().padStart(2, '0');

export default class DataUploader extends LightningElement {
    defaultGameId = `${year}${month}${day}a`;
    errorMessages: string[] = [];
    showErrors = false;

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
                playerPlace: parseInt(
                    this.getValueFromInput(
                        'playerPlace' + (x + 1).toString().trim()
                    ),
                    10
                ),
                victoryPoints: parseInt(
                    this.getValueFromInput(
                        'victoryPoints' + (x + 1).toString().trim()
                    ),
                    10
                )
            });
        }

        //data for post
        let data: GameData = {
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
                    newPlayerData.push(playerEntry);
                }
            }

            data.playerData = newPlayerData; //reassign data

            console.log('Sending data: ', data);

            //console.log('Sending data: ', JSON.stringify(data));

            //send POST request to api
            fetch('api/v1/bulkGameResults', {
                //fetch('api/v1/gameResults', { // Old API communication, use for single data insertion
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify([data]) // Remove brackets for single data insertion
            }).then((response) => {
                //check response from server
                if (response.status == 200) location.reload();
                //refresh page
                else if (response.status >= 400) {
                    if(response.status == 409){
                        this.setErrorMessages([
                            "Error: there is a duplicate game id present"
                        ])
                        console.error('Duplicate game id error: ', response);
                    }else{
                        this.setErrorMessages([
                            'Something went wrong with the data upload. Please try again.'
                        ]);
                        console.error('Error inserting game results: ', response);
                    }
                }
            });
        } else {
            this.setErrorMessages(errorMessages);
        }
    }

    setErrorMessages(errorMessages: string[]): void {
        this.errorMessages = errorMessages;
        this.showErrors = errorMessages.length > 0;
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
            return e.value.trim();
        }
        return '';
    }
}
