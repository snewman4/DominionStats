import { LightningElement } from 'lwc';
import { getRawResults } from 'my/resultsFetcher';


export default class RawResultsTable extends LightningElement {

    tableData = [];
    async connectedCallback() {
        this.tableData = await getRawResults();
    }

}



