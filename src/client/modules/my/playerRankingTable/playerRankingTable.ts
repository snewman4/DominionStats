import { LightningElement } from 'lwc';
import { extractAllPlayerStats, getRawResults } from 'my/resultsFetcher';


export default class PlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractAllPlayerStats(await getRawResults());
    }
}





