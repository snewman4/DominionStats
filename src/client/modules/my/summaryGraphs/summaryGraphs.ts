import { LightningElement } from 'lwc';
import { extractAllPlayerStats, getRawResults } from 'my/resultsFetcher';
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

interface PointsData {
    player_name: string;
    total_victory_points: number;
}

export default class SummaryGraphs extends LightningElement {
    gameParticipationTrendData: PlayersPerGame[] = [];
    firstPlaceFreqDonutData: DonutData[] = [];
    gamesPlayedDonuntData: DonutData[] = [];
    avgPointsWonBarData: AvgPointsData[] = [];
    totalPointsWonBarData: PlayerStatsAllGames[] = [];
    hasRendered = false;
    // @ts-ignore: TS2708
    scalePoint = d3.scalePoint;

    async renderedCallback() {
        // Avoids some infinite loop of trying to re-render. No idea why
        if (!this.hasRendered) {
            this.hasRendered = true;
            const rawResults: GameResultsData[] = await getRawResults();
            const playerOverviewStats: PlayerStatsAllGames[] =
                extractAllPlayerStats(rawResults);

            // Most Frequent First Place
            this.firstPlaceFreqDonutData = playerOverviewStats
                .filter((ps) => ps.first_place > 0)
                .map((ps) => {
                    return { name: ps.player_name, value: ps.first_place };
                })
                // sort descending
                .sort((a, b) => {
                    if (a.value < b.value) {
                        return 1;
                    } else if (a.value > b.value) {
                        return -1;
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
            // Game participation
            const playersPerGame: { [key: string]: number } = rawResults.reduce(
                (accum, gd: GameResultsData) => {
                    const { game_label } = gd;
                    if (!accum[game_label]) {
                        accum[game_label] = 1;
                    } else {
                        accum[game_label]++;
                    }
                    return accum;
                },
                {}
            );
            this.gameParticipationTrendData = Object.entries(
                playersPerGame
            ).map(([key, value]) => {
                return { game_label: key, player_num: value };
            });

            // Total Points
            this.totalPointsWonBarData = playerOverviewStats
                // sort descending
                .sort((a, b) => {
                    if (a.total_victory_points < b.total_victory_points) {
                        return 1;
                    } else if (
                        a.total_victory_points > b.total_victory_points
                    ) {
                        return -1;
                    }
                    return 0;
                });
        } else {
            console.log('Blocked a re-render propagation');
        }
    }
}
