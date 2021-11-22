import { LightningElement } from 'lwc';
import { getRawResults,extractaGameSizePlayerStats } from 'my/resultsFetcher';


export default class twoPlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractaGameSizePlayerStats(await getRawResults(),2);
    }
}





