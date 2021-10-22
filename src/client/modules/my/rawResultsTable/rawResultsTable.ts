import { LightningElement } from 'lwc';

export default class RawResultsTable extends LightningElement {

    tableData = this.getData();

    getData() {

        //eventual function to return a processed list of data to place into the table

        return [
            {
                name: "Dave",
                gamesPlayed: 17,
                gamePercent: 89.47,
                averagePoints: 26,
                totalPoints: 442,
                totalFirst: 7,
                percentFirst: 41.18
            },
            {
                name: "Dave",
                gamesPlayed: 17,
                gamePercent: 89.47,
                averagePoints: 26,
                totalPoints: 442,
                totalFirst: 7,
                percentFirst: 41.18
            },
            {
                name: "Dave",
                gamesPlayed: 17,
                gamePercent: 89.47,
                averagePoints: 26,
                totalPoints: 442,
                totalFirst: 7,
                percentFirst: 41.18
            },
        ];
    
    }

}



