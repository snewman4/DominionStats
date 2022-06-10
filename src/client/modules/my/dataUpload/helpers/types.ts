export interface GameData {
    gameId: string;
    playerData: PlayerData[];
}
export interface PlayerData {
    playerName: string;
    playerPlace: number;
    victoryPoints: number;
}
export interface UsernameData {
    username: string;
    playerName: string | null;
    playerSymbol: string;
}
export interface GameIDsAndPlayers {
    customGameId: string;
    dominionGameId: string;
    playerNames: string[];
}
export interface VP {
    player: string;
    vp_value: string;
}
export interface GameLog {
    VPs: VP[];
    date: string;
    gameID: string;
    gameStatus: string;
    log: string;
    players: UsernameData[];
    uuid: string;
}
