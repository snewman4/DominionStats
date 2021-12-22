export interface GameData {
    gameId: string;
    playerData: PlayerData[];
}
export interface PlayerData {
    playerName: string;
    playerPlace: number;
    victoryPoints: number;
}
