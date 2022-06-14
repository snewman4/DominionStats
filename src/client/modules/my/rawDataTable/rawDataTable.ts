import { LightningElement } from 'lwc';
import { getRawData } from 'my/resultsFetcher';
import type { GameLogDB } from '../resultsFetcher/resultsFetcher';

export default class RawDataValue extends LightningElement {
    tableData: GameLogDB[] = [];
    async connectedCallback() {
        this.tableData = await getRawData();
    }
}
