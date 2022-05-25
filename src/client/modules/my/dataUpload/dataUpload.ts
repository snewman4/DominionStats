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

        /*
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
        */

       //data for post
        let dataList: GameData[] = [];
        let textBlob: string = this.getValueFromInput("textArea")
        console.log('textblob:', textBlob);

        //Set up variables
        let currentData: GameData= {
            gameId: "",
            playerData: []
        };
        let currentGameId;
        let gameId;
        let count: number = 0;

        //Split the lines, iterate over each one
        textBlob.split(/[\r\n]+/).forEach((line: string) => {
            console.log('processing line:', line)

            //Split the lines based on whitespace gaps
            let columns: string[] = line.split(/\s+/);

            //Set gameId equal to the first value in the line
            gameId = columns.shift();

            if(gameId === null || gameId === undefined || gameId === "" || columns.length !== 3){
                //If something is wrong with the data
                //TODO: notify user
                return;
            }

            if(count == 0){
                //If this is the first game
                currentGameId = gameId;
                count += 1;
            } else if(gameId !== currentGameId){
                //Otherwise if this is a new game ID from the previous row

                //Add the last game to the data
                currentData = {
                    gameId: currentGameId,
                    playerData: playerData
                }
                console.log('Pushing current data:', currentData)
                dataList.push(currentData);
                
                //Set up variables to keep track of new game
                currentData = {
                    gameId: "",
                    playerData: []
                };
                currentGameId = gameId;
                playerData = [];
            }

            //Read in the next player and add them to the data
            let newPlayer: PlayerData = {
                playerPlace: parseInt(columns[0]),
                playerName: columns[1],
                victoryPoints: parseInt(columns[2])
            }
            playerData.push(newPlayer);
            
        });

        //Append the last game Id which isn't appended in the loop
        currentData = {
            gameId: currentGameId,
            playerData: playerData
        }
        console.log('Pushing current data:', currentData)
        dataList.push(currentData);

        let errorMessagesList:string[] = [];
        for(let data of dataList){
          // errorMessagesList.push(validateInput(data)); //validate input data
            //if no errors were found
            if (errorMessagesList.length == 0) {
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
            }   else {
                    this.setErrorMessages(errorMessagesList);
            }
        }
      
        console.log('Sending data: ', dataList);

        //send POST request to api
        fetch('api/v1/bulkGameResults', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataList)
        }).then((response) => {
            //check response from server
            if (response.status == 200){ 
                //refresh page, so updated data appears
                location.reload();
            } else if (response.status >= 400) {
                this.setErrorMessages([
                    'Something went wrong with the data upload. Please try again.'
                ]);
                console.error('Error inserting game results: ', response);
            }
        });
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
            'textarea[name="' + name + '"]'
        );
        if (e) {
            return e.value.trim();
        }
        return '';
    }
}
