import { LightningElement } from 'lwc';
import { validateInput } from './helpers/validateInput';
import type {
    GameData,
    GameLog,
    PlayerData,
    UsernameData,
    GameIDsAndPlayers
} from './helpers/types';
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
    showFileName = false;
    oldGameLog?: Object;
    gameLog?: GameLog[] = undefined;
    gameIDs: string[] = [];
    tableData: GameIDsAndPlayers[] = [];
    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend(): void {
        //gets value from textarea
        let textBlob: string = this.getValueFromInput('textArea');
        let dataList: GameData[] = this.processLine(textBlob);
        let gameIds: string[] = [];
        for (let game of dataList) {
            gameIds.push(game.gameId);
        }
        let errorMessages = validateInput(dataList);
        //get file values
        let fileString = '';
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

    //Proccess entire text area for bulk insert, returns list of GameData
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

    //Read in file, and prompt user to input playerNames if missing
    onLogFileAttached(): void {
        //Read in file from file select
        let fileText = this.template.querySelector(
            'input[name="file-upload-input-107"]'
        ) as HTMLInputElement;
        if (fileText !== null && fileText.files !== null && fileText.files[0] !== null) {
            // let fileName = fileText.files[0].name;
               fileText.files[0].text().then(async (result) => {
            //     const e: HTMLElement | null = this.template.querySelector(
            //         'name="' + "fileNameText" + '"'
            //     );
            //     if (e) {
            //         this.showFileName = true;
            //         e.innerHTML = "File Selected: " + fileName;
            //     }
            //     else{
            //     }
                this.oldGameLog = JSON.parse(result);
                this.gameLog = await this.validatePlayers(JSON.parse(result));
                this.displayNewGameIDs(this.gameLog);

                let players: UsernameData[] = [];
                let activeUsers: UsernameData[] = [];
                for (let log of this.gameLog) {
                    players = log.players;
                    for (let player of players) {
                        let currentUser = activeUsers.filter(
                            (element) => element.username === player.username
                        );
                        if (currentUser.length > 0) {
                            player.playerName = currentUser[0].playerName;
                            continue;
                        }
                        if (
                            player.playerName === '' ||
                            player.playerName === undefined
                        ) {
                            do {
                                player.playerName = prompt(
                                    'What is the player name for this username: ' +
                                        player.username
                                );
                            } while (player.playerName === null);
                            activeUsers.push(player);
                        }
                    }
                    log.players = players;
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
            '[name="' + name + '"]'
        );
        if (e) {
            return e.value.trim();
        }
        return '';
    }

    /**
     * Gets the value from the table with the given name.
     * Parameters:
     *  name: The name of the table in HTML.
     * Returns:
     *  All gameid values in the first row
     */
    getValuesFromTable(name: string): string[] {
        const e: HTMLTableElement | null = this.template.querySelector(
            'table[name="' + name + '"]'
        );
        if (e) {
            let table: string[] = [];
            let tableValue;
            for (let r = 1; r < e.rows.length; r++) {
                tableValue = e.rows[r].cells[0];
                if(tableValue !== null && tableValue.textContent !== null){
                    table.push(tableValue.textContent);
                }
            }
            return table;
        }
        return [];
    }

    //Replace each gameID in file with new format based on date (YYYYMMDD[a-z])
    displayNewGameIDs(file: GameLog[]): void {
        let newGameIDs: string[] = [];
        let dates: string[] = [];
        let allPlayers:string[][] = [];
        for (let key of file) {
            dates.push(key.date);
        }
        for (let key in this.oldGameLog){
            allPlayers.push(this.oldGameLog[key]['players']);
        }

        let currentDate = dates[0];
        let letter = 'a';
        for (let date of dates) {
            if (date !== undefined && date !== null) {
                let year = date.substring(6);
                let month = date.substring(3, 5);
                let day = date.substring(0, 2);
                if (date !== currentDate) {
                    letter = 'a';
                    currentDate = date;
                }
                let newGameID = year + month + day + letter;
                newGameIDs.push(newGameID);
                letter = String.fromCharCode(letter.charCodeAt(0) + 1);
            }
        }

        //this works, I'm not sure why but this refreshes the html element to populate the table
        this.showGameArea = true;
        this.showGameArea = false;
        this.showGameArea = true;
        let oldGameIDs: string[] = [];

        for (let key of file) {
            oldGameIDs.push(key.gameID);
        }
        let index = 0;

        let dataRow: GameIDsAndPlayers = {
            customGameId: '',
            dominionGameId: '',
            playerNames: []
        };
        for (let i = 0; i < newGameIDs.length; i++) {
            dataRow = {
                customGameId: newGameIDs[i],
                //will change to index from array of dominion ids
                dominionGameId: oldGameIDs[i],
                //can be either an array or a string seprated by commas, will implement after parsing through names
                playerNames: allPlayers[i]
            };
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

    //When all data has been validated, upload new log file to server
    onSaveGameLogToServer(): void {
        //gets values from table
        let newGameIDs: string[] = [];
        newGameIDs = this.getValuesFromTable('gameidtable');
        if (this.gameLog === undefined) {
            console.log('missing game log');
            return;
        }

        this.gameLog = this.replaceGameIDs(this.gameLog, newGameIDs);
        this.showGameArea = false;
        console.log('OBJECT: ', JSON.stringify(this.gameLog));

        fetch('api/v1/logUpload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.gameLog)
        }).then((response) => {
            if (response.status === 200) {
                console.log('Uploaded Successfully.');
            } else {
                response.json().then((json) => console.error(json));
            }
        });
        /*
        let test: Element;
        test = document.querySelector("tableInput");
        console.log('tableInput', test);
        */
    }

    //TODO: Change newGameIDs to Object, map from old game ids to new
    replaceGameIDs(file: GameLog[], newGameIDs: string[]): GameLog[] {
        file.forEach((element, index) => {
            element.gameID = newGameIDs[index];
        });
        /*
        Object.keys(file).forEach((UUID: string, index) => {
            file[UUID].gameID = newGameIDs[index];
        });
        */
        return file;
    }

    //Call validateSingle to validate each game in log
    async validatePlayers(file: Object): Promise<GameLog[]> {
        let allLogs: GameLog[] = [];
        //let players: string[] = [];
        for (let key in file) {
            allLogs.push(await this.validateSingle(file[key]));
        }
        return allLogs;
    }

    //Validates a single game, specifically checking if usernames have an associated playername in the DB
    validateSingle(file: Object): Promise<GameLog> {
        let players: string[] = file['players'];
        return fetch('api/v1/usernameCheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(players)
        })
            .then((response) => response.json())
            .then((data) => {
                return {
                    VPs: file['VPs'],
                    date: file['date'],
                    gameID: file['gameID'],
                    gameStatus: file['gameStatus'],
                    log: file['log'],
                    players: data,
                    uuid: file['uuid']
                };
                return data;
            })
            .catch((error) => console.error(error));
    }

    
    handleUploadFinished(event) {
        // Get the list of uploaded files
        //const uploadedFiles = event.detail.files;
        //alert('No. of files uploaded : ' + uploadedFiles.length);
        console.log("FILE UPLOADED");
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
