import { LightningElement } from 'lwc';
import { getRawResults, extractaGameSizePlayerStats } from 'my/resultsFetcher';
import type { GameResultsData, PlayerStatsAllGames } from 'my/resultsFetcher';

// allows type-completion of the global-variable D3, which is assumed to already have been loaded (from script tag)
declare global {
    namespace d3 {}
}

const placeNumberToString = [
    'Zeroth',
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth'
]; // lazy way to convert; fine given we have a very small list

type PlayersPerGame = Pick<GameResultsData, 'game_label' | 'player_num'>;
interface DonutData {
    name: string;
    value: number;
}
interface AvgPointsData {
    player_name: string;
    avg_points: number;
}

export default class SummaryGraphs extends LightningElement {
    //gameParticipationTrendData: PlayersPerGame[] = [];
    firstPlaceFreqDonutData: DonutData[] = [];
    gamesPlayedDonuntData: DonutData[] = [];
    avgPointsWonBarData: AvgPointsData[] = [];
    hasRendered = false;
    // @ts-ignore: TS2708
    scalePoint = d3.scalePoint;

    async renderedCallback() {
        // Avoids some infinite loop of trying to re-render. No idea why
        if (!this.hasRendered) {
            this.hasRendered = true;
            const rawResults: GameResultsData[] = await getRawResults();
            const playerOverviewStats: PlayerStatsAllGames[] =
                extractaGameSizePlayerStats(rawResults, 6);

            // Most Frequent First Place
            this.firstPlaceFreqDonutData = playerOverviewStats
                .filter((ps) => ps.first_place > 0)
                .map((ps) => {
                    return { name: ps.player_name, value: ps.first_place };
                })
                .sort((a, b) => {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    }
                    return 0;
                });
            // Games Played Most Frequent
            this.gamesPlayedDonuntData = playerOverviewStats
                .filter((ps) => ps.num_games > 1)
                .map((ps) => {
                    return { name: ps.player_name, value: ps.num_games };
                })
                .sort((a, b) => {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    }
                    return 0;
                });
            // Average Points
            this.avgPointsWonBarData = playerOverviewStats.sort((a, b) => {
                if (a.avg_points < b.avg_points) {
                    return 1;
                } else if (a.avg_points > b.avg_points) {
                    return -1;
                }
                return 0;
            });
        } else {
            console.log('Blocked a re-render propagation');
        }
    }
}
