import { LightningElement } from 'lwc';
import { getRawData } from 'my/resultsFetcher';
import type { GameLogDB } from '../resultsFetcher/types';
import type { PlayerStatsAllGames } from 'my/resultsFetcher';

export default class RawDataValue extends LightningElement {
    tableData: GameLogDB[] = [];
    async connectedCallback() {
        this.tableData = await getRawData();
    }
}
