import { LightningElement } from 'lwc';
import { validateInput } from './helpers/validateInput';
import type { GameData, GameIDsAndPlayers, GamePlayers, PlayerData, UsernameData } from './helpers/types';
import { ConnectedScatterplot } from '../d3Charts/connectedScatter';

const todaysDate = new Date();
const year = todaysDate.getFullYear();
const month = (todaysDate.getMonth() + 1).toString().padStart(2, '0');
const day = todaysDate.getDate().toString().padStart(2, '0');

export default class DataUploader extends LightningElement {
    defaultGameId = `${year}${month}${day}a`;
    errorMessages: string[] = [];
    showErrors = false;
    showGameArea = false;
    gameLog?:Object = undefined;
    gameIDs: string[] = [];
    tableData: GamePlayers[] = [];
    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend(): void {
        //gets value from textarea
        let textBlob: string = this.getValueFromInput('textArea');
        let dataList: GameData[] = this.processLine(textBlob);
        let gameIds: string[] = [];
        for(let game of dataList){
            gameIds.push(game.gameId);
        }
        let errorMessages = validateInput(dataList);
        //get file values
        let fileString = "";
        let fileText = this.template.querySelector(
            'input[name="file-upload-input-107"]'
        ) as HTMLInputElement;

        //if no errors were found
        if (errorMessages.length == 0) {
            let newPlayerData: PlayerData[] = []; //player data without blank entries

            console.log('Sending data: ', dataList);

            //send POST request to api
            fetch('api/v1/bulkGameResults', {
                //fetch('api/v1/gameResults', { // Old API communication, use for single data insertion
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataList)
            }).then((response) => {
                //check response from server
                if (response.status == 200) {
                    location.reload();
                }
                //refresh page
                 else if (response.status >= 400) {
                    //If there has been a duplicate error
                    if (response.status == 409) {
                        response
                            .json()
                            .then((json) => {
                                let errors: string[] = [];
                                for (let res of json) errors.push(res.error);
                                // Set the error messages to be the response
                                this.setErrorMessages(errors);
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    } else {
                        //If the error was something else
                        this.setErrorMessages([
                            'Something went wrong with the data upload. Please try again.'
                        ]);
                        console.error(
                            'Error inserting game results: ',
                            response
                        );
                    }
                }
            });
        } else {
            this.setErrorMessages(errorMessages);
        }
    }

    onLogFileAttached(): void {
        //get file values
        //let fileString = "";
        let fileText = this.template.querySelector(
            'input[name="file-upload-input-107"]'
        ) as HTMLInputElement;
        if (fileText !== null && fileText.files !== null) {
            fileText.files[0].text().then((result) => {

            this.gameLog = this.validatePlayers(JSON.parse(result));
            this.displayNewGameIDs(result);
            console.log('OBJECT: ', JSON.stringify(this.gameLog));

            let players:UsernameData[] = [];
            for(let key in this.gameLog){
                 players = this.gameLog[key]['players'];
                 for(let player of players){
                     if(player.playerName === "" || player.playerName === undefined){
                          do {
                            player.playerName = prompt("What is the player name for this username: " + player.username);
                        } while(player.playerName === null);
                     }               
            }
            this.gameLog[key]['players'] = players;
        }
                // TODO : Handle the response, potential error handling
            });
        }
        this.showGameArea = true;
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

    setValueFromInput(name: string, gameIDs: string[]): void {
        const e: HTMLInputElement | null = this.template.querySelector(
            'textarea[name="' + name + '"]'
        );
        let gameIDsDisplay: string = "";
        for(let i = 0; i < gameIDs.length; i++){
            gameIDsDisplay += gameIDs[i] + "\n";
        }
        if(e){
            e.value = gameIDsDisplay;
        }
    }

    //Replace each gameID in file with new format based on the date
    displayNewGameIDs(file:string):void{
        // Object.keys(file).forEach((UUID:string, index) => {
        //     console.log(file[UUID].gameID);
        // });
         let replace = "";
         let date = "";
         let dateString = "";
         let currentDate = file.substring(file.indexOf("\"date\"") + 9, file.indexOf("\"date\"") + 19);
         let newGameID = "";
         let letter = "a";
         let gameIDs: string[] = [];
         let oldFile = file;
         while(file.indexOf("\"#") !== -1){
             replace = file.substring(file.indexOf("\"#")+1, file.indexOf("\"#") + 10);
             //Checks if log.json has a space after "date":
             let tester = "";
             tester += file.substring(file.indexOf("\"date\"") + 7, file.indexOf("\"date\"") + 8);
             if(tester === " "){
                 newGameID = file.substring(file.indexOf("\"date\"") + 15,file.indexOf("\"date\"") + 19 ) + file.substring(file.indexOf("\"date\"") + 12,file.indexOf("\"date\"") + 14) + file.substring(file.indexOf("\"date\"") + 9,file.indexOf("\"date\"") + 11 ) + letter;
             } else {
                 newGameID = file.substring(file.indexOf("\"date\"") + 14,file.indexOf("\"date\"") + 18 ) + file.substring(file.indexOf("\"date\"") + 11,file.indexOf("\"date\"") + 13) + file.substring(file.indexOf("\"date\"") + 8,file.indexOf("\"date\"") + 10 ) + letter;
             }
            
             gameIDs.push(newGameID);
             letter = String.fromCharCode(letter.charCodeAt(0) + 1);
             dateString = file.substring(file.indexOf("\"date\""), file.indexOf("\"date\"") + 6);
             date = file.substring(file.indexOf("\"date\"") + 9, file.indexOf("\"date\"") + 19);
             //if date changes, reset letter to 'a'
             if(date !== currentDate){
                 letter = "a";
                 currentDate = date;
             }
             //These lines will actually replace the gameIDs in the file
            
             file = file.replace(dateString, "\"Date\"");
             file = file.replace(replace, newGameID);
         }
        //Prompt user to check gameIDS(TEMPORARY, CHANGE TO TEXT AREA THAT APPEARS AFTER FILE UPLOAD)
        this.showGameArea = true;
        this.setValueFromInput("gameInputArea", gameIDs);
        //this.gameIDs = gameIDs;
        
        let dataRow: GameIDsAndPlayers = {
            customGameId: "",
            dominionGameId: "",
            playerNames: []
        }
        for(let i = 0; i < gameIDs.length; i++){
            dataRow = {
                customGameId: gameIDs[i],
                //will change to index from array of dominion ids
                dominionGameId: "test",
                //can be either an array or a string seprated by commas, will implement after parsing through names
                playerNames: ["test1", "test2"]
            }
            this.tableData.push(dataRow);
        }

        
        /*
         //Prompt test stuff
        let gameIDsDisplay = "";
        for(let ids of gameIDs){
            gameIDsDisplay += ids + " ";
        }
        */
        
        //let response = prompt("Do these Game ID's look correct? (Y/N) \n" , gameIDsDisplay);
        //console.log(response);
        

        // (<HTMLInputElement>document.getElementById('gameArea')).value = JSON.stringify(gameIDs);
       // let response = prompt("Do these Game ID's look correct? (Y/N) \n" + gameIDs);
        // if(response === "Y" || response === "Yes" || response === "YES" || response === "y" || response === "yes"){
        //     return file;
        // }
        // else{
        //     return oldFile;
        // }
      //  return file;
    }

    onSaveGameLogToServer(): void{
        //gets value from textarea
        let newGameIDs: string[] = [];
        let textBlob: string = this.getValueFromInput('gameInputArea');
        textBlob.split(/[\r\n]+/).forEach((line: string) => {
            newGameIDs.push(line);
        });
        if(this.gameLog === undefined){
            console.log('missing game log');
            return;
        }
        this.gameLog = this.replaceGameIDs(this.gameLog, newGameIDs);

        this.showGameArea = false;

        fetch('api/v1/logUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.gameLog)
        });
    }
    //TODO: Change newGameIDs to Object, map from old game ids to new 
    replaceGameIDs(file:Object, newGameIDs:string[]): Object{
        Object.keys(file).forEach((UUID:string, index) => {
            file[UUID].gameID = newGameIDs[index];
        });
        return file;
    }
       
    validatePlayers(file:Object): Object {
        let players: string[] = [];
        for(let key in file){
            players = file[key]['players'];
            fetch('api/v1/usernameCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(players)}).then((response) => {
                    //check response from server
                    if (response.status == 200) {
                        response.json().then((json) => {
                            file[key]['players'] = json;
                        });
                    }
            });
        }
        return file;
    }

    processLine(textBlob: string): GameData[] {
        let playerData: PlayerData[] = []; //data for each player input
        let dataList: GameData[] = []; //list of game data
        let currentData: GameData = { gameId: '', playerData: [] };
        let currentGameId;
        let gameId;
        let count = 0;

        //loops through each line
        textBlob.split(/[\r\n]+/).forEach((line: string) => {
            //splits input by empty space
            let columns: string[] = line.split(/\s+/);

            //Set gameId equal to the first value in the line
            gameId = columns.shift();
            //validates gameid
            if (
                gameId === null ||
                gameId === undefined ||
                gameId === '' ||
                columns.length !== 3
            ) {
                return;
            }
            //on first run, only set current to first gameid
            if (count == 0) {
                currentGameId = gameId;
                count += 1;
            }
            //whenever gameid changes, push current data and reset
            else if (gameId !== currentGameId) {
                currentData = {
                    gameId: currentGameId,
                    playerData: playerData
                };
                dataList.push(currentData);
                currentData = { gameId: '', playerData: [] };
                currentGameId = gameId;
                playerData = [];
            }
            //set playerdata, then push
            let newPlayer: PlayerData = {
                playerPlace: parseInt(columns[0]),
                playerName: columns[1],
                victoryPoints: parseInt(columns[2])
            };
            playerData.push(newPlayer);
        });

        currentData = {
            gameId: currentGameId,
            playerData: playerData
        };
        dataList.push(currentData);
        return dataList;
    }

    handleUploadFinished(event) {
        // Get the list of uploaded files
        //const uploadedFiles = event.detail.files;
        //alert('No. of files uploaded : ' + uploadedFiles.length);
        console.log("test");
        prompt("test");
    }

    /*
    test(): void {
        let playernames: string[] = ["mike", "bob"];
        let playernames2: string[] = ["mike", "bob"];
        let e1: GamePlayers = {
            dominionGameId: "test1",
            customGameId: "2021",
            playerNames: playernames
        };

        let e2: GamePlayers = {
            dominionGameId: "test2",
            customGameId: "20223",
            playerNames: playernames2
        };

        this.tableData.push(e1);
        this.tableData.push(e2);
    }
    */
}
