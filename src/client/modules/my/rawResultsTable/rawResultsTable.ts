import { LightningElement } from 'lwc';
import { getRawResults } from 'my/resultsFetcher';
import type { GameResultsData } from 'my/resultsFetcher';

export default class RawResultsTable extends LightningElement {
    tableData: GameResultsData[] = [];
    async connectedCallback() {
        this.tableData = await getRawResults();
    }
}
