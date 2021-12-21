import { LightningElement } from 'lwc';
import { parse } from 'my/router';
import { getRawResults } from 'my/resultsFetcher';
import type { GameResultsData } from '../resultsFetcher/resultsFetcher';

const placeNumberToString = [
    'Zeroth',
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth'
]; // lazy way to convert; fine given we have a very small list

interface SummaryStats {
    games?: number;
    firstPlace?: number;
    points?: number;
}

export default class UserLanding extends LightningElement {
    userName = '';
    placeDistribution: { name: string; value: number }[] = [];
    summaryStats: SummaryStats = {};

    async connectedCallback() {
        const routeParams = parse('/user/:userName');
        console.log('Route Params: ', routeParams);
        if (routeParams) {
            this.userName = routeParams.userName;
        }

        const rawResults: GameResultsData[] = await getRawResults();
        const userResults = rawResults.filter(
            (game) => game.player_name === this.userName
        );

        // Place distribution donut
        this.placeDistribution = Object.entries(
            userResults.reduce((accum, gr) => {
                const { player_num } = gr;
                if (!accum[player_num]) {
                    accum[player_num] = 1;
                } else {
                    accum[player_num]++;
                }
                return accum;
            }, {})
        )
            .map(([name, value]) => {
                return { name, value };
            })
            .sort((a, b) => {
                if (a.name < b.name) {
                    return 1;
                } else if (a.name > b.name) {
                    return -1;
                }
                return 0;
            })
            .map(({ name, value }) => {
                return {
                    name: placeNumberToString[name] as string,
                    value: value as number
                };
            });

        // Number of games
        this.summaryStats.games = userResults.length;

        // Total Points
        this.summaryStats.points = userResults.reduce((sum, game) => {
            return sum + game.victory_points;
        }, 0);

        // Number of Wins
        this.summaryStats.firstPlace = userResults.reduce((count, game) => {
            if (game.player_num === 1) {
                count++;
            }
            return count;
        }, 0);

        // Total Points Percentile
    }
}
