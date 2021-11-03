import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults } from 'my/resultsFetcher';


export default class PlayerRankingTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = extractPlayerStats(await getRawResults());
    }
}





