import { LightningElement } from 'lwc';
import { extractAllPlayerStats, getRawResults } from 'my/resultsFetcher';
import type { PlayerStatsAllGames } from 'my/resultsFetcher';

export default class PlayerRankingTable extends LightningElement {
    tableData: PlayerStatsAllGames[] = [];
    async connectedCallback() {
        this.tableData = extractAllPlayerStats(await getRawResults());
    }
}
