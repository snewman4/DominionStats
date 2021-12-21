import { LightningElement } from 'lwc';
import { getRawResults, extractaGameSizePlayerStats } from 'my/resultsFetcher';
import type { PlayerStatsAllGames } from 'my/resultsFetcher';

export default class sixPlayerRankingTable extends LightningElement {
    tableData: PlayerStatsAllGames[] = [];
    async connectedCallback() {
        this.tableData = extractaGameSizePlayerStats(await getRawResults(), 3);
    }
}
