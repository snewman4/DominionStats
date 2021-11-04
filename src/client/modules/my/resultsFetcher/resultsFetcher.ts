export interface GameResultsData {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

export interface PlayerStatsAllGames {
    player_name: string;
    num_games: number;
    percent_played: number;
    total_victory_points: number;
    avg_points: number;
    first_place: number;
    percent_first: number;
    second_place: number;
    percent_second: number;
    third_place: number;
    percent_third: number;
    fourth_place: number;
    percent_fourth: number;
    fifth_place: number;
    percent_fifth: number;
    sixth_place: number;
    percent_sixth: number;
}

let cachedData: GameResultsData[] = [];

export function getRawResults(): Promise<GameResultsData[]> {
    if (cachedData && !cachedData.length) {
        return fetch('/api/v1/gameLogs')
            .then(response => response.json())
            .then(data => {
                cachedData = data as GameResultsData[];
                return data ;
            })
            .catch( error => {
                console.error(error);
            });
    }
    return new Promise((resolve) => resolve(cachedData));
}

export function extractPlayerStats(resultsData: GameResultsData[]): PlayerStatsAllGames[] {
    let PlayerStats: PlayerStatsAllGames[] = [];
    let total = 0;
    resultsData.forEach((entry, i) => {
       if(!PlayerStats.find(o => o.player_name == entry.player_name)){
        PlayerStats.push({player_name: entry.player_name,first_place: 0,percent_first: 0,percent_second: 0,percent_third:0,percent_fourth:0,percent_fifth:0,percent_sixth:0,avg_points: 0,percent_played: 0, total_victory_points: 0, num_games: 0,second_place: 0,third_place: 0,fourth_place: 0, fifth_place: 0,sixth_place: 0})
       }
       if(entry.player_num == 1){
           total++;
       }
       for (var j in PlayerStats){
            if(PlayerStats[j].player_name == entry.player_name){
                PlayerStats[j].num_games++;
                PlayerStats[j].total_victory_points += resultsData[i].victory_points;
                switch (entry.player_num) {
                    case 1:
                        PlayerStats[j].first_place++;
                        break;
                    case 2:
                        PlayerStats[j].second_place++;
                        break;
                    case 3:
                        PlayerStats[j].third_place++;
                        break;
                    case 4:
                        PlayerStats[j].fourth_place++;
                        break;
                    case 5:
                        PlayerStats[j].fifth_place++;
                        break;
                    case 6:
                        PlayerStats[j].sixth_place++;
                        break;
                }
                
            }
            let avg = PlayerStats[j].total_victory_points/PlayerStats[j].num_games;
            PlayerStats[j].avg_points = +avg.toFixed(2);
            let games_played = (PlayerStats[j].num_games/total)*100;
            PlayerStats[j].percent_played = +games_played.toFixed(2);
            let first = (PlayerStats[j].first_place/total)*100;
            PlayerStats[j].percent_first = +first.toFixed(2);
            let second = (PlayerStats[j].second_place/total)*100;
            PlayerStats[j].percent_second = +second.toFixed(2);
            let third = (PlayerStats[j].third_place/total)*100;
            PlayerStats[j].percent_third = +third.toFixed(2);
            let fourth = (PlayerStats[j].fourth_place/total)*100;
            PlayerStats[j].percent_fourth = +fourth.toFixed(2);
            let fifth = (PlayerStats[j].fifth_place/total)*100;
            PlayerStats[j].percent_fifth = +fifth.toFixed(2);
            let sixth = (PlayerStats[j].sixth_place/total)*100;
            PlayerStats[j].percent_sixth = +sixth.toFixed(2);
       }
   },PlayerStats);
   return PlayerStats;
}