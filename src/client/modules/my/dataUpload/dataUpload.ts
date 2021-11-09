import { LightningElement } from 'lwc';

export default class DataUploader extends LightningElement {

    /**
     * Retrieves the data from the input fields and makes a query to upload it to the database api.
     */
    gatherDataAndSend() {

        let playerData = []; //data for each player input

        //get entered player data
        for(let x = 0; x < 6; x++) {
            playerData.push({
                "playerName": this.getValueFromInput("playerName" + (x+1).toString()),
                "victoryPoints": parseInt(this.getValueFromInput("victoryPoints" + (x+1).toString()), 10)
            });
        }

        //data for post
        let data = {
            "gameId": this.getValueFromInput("gameId"),
            "playerData": playerData
        };

        console.log(data);
        console.log(JSON.stringify(data));

        //send POST request to api
        fetch("api/v1/gameLogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log("Got response: ", response);
            return response.json();
        })
        .then(returnedData => {
            console.log("Successfully uploaded: ", returnedData);
        })
        .catch((error) => {
            console.log("Error uploading data: ", error);
        });

    }

    /** 
     * Gets the value from the input field with the given name.
     * Parameters:
     *  name: The name of the input field in HTML.
     * Returns:
     *  The value currently in the input field. Can be null.
    */
    getValueFromInput(name) {
        console.log("Getting data from input field with name " + name);
        return this.template.querySelector("input[name=\"" + name + "\"]").value
    }

}