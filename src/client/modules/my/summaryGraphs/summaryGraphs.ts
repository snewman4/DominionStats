import { LightningElement } from 'lwc';
import { extractPlayerStats, getRawResults } from 'my/resultsFetcher';
import type { GameResultsData, PlayerStatsAllGames } from 'my/resultsFetcher';

// allows type-completion of the global-variable D3, which is assumed to already have been loaded (from script tag)
declare global {
    namespace d3 {}
}

const placeNumberToString = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];   // lazy way to convert; fine given we have a very small list

type PlayersPerGame = Pick<GameResultsData, "game_label" | "player_num">;
interface DonutData {
    name: string;
    value: number;
}

export default class SummaryGraphs extends LightningElement {
    gameParticipationTrendData: PlayersPerGame[] = [];
    firstPlaceFreqDonutData: DonutData[] = [];
    hasRendered = false;
    scalePoint = d3.scalePoint;

    async renderedCallback() {
        // Avoids some infinite loop of trying to re-render. No idea why
        if (!this.hasRendered) {
            this.hasRendered = true;
            const rawResults: GameResultsData[] = await getRawResults();
            const playerOverviewStats: PlayerStatsAllGames[] = extractPlayerStats(rawResults);

            // Most Frequent First Place
            this.firstPlaceFreqDonutData = playerOverviewStats
                .filter(ps => ps.first_place > 0)
                .map((ps) => { return {name: ps.player_name, value: ps.first_place}; })
                .sort((a, b) => {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    }
                    return 0;
                });

            // Game participation
            const playersPerGame = rawResults.reduce((accum, gd: GameResultsData) => {
                const {game_label} = gd;
                if (!accum[game_label]) {
                    accum[game_label] = 1;
                } else {
                    accum[game_label]++;
                }
                return accum;
            }, {});
            this.gameParticipationTrendData = Object.entries(playersPerGame).map(([key, value]) => { return {game_label: key, player_num: value}});
        } else {
            console.log("Blocked a re-render propagation");
        }
    }
}