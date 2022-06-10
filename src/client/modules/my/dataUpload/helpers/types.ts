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
