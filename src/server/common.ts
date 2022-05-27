export interface TestObject {
    id: number;
    name: string;
    score: number;
}

export interface GameResultsDB {
    id: number;
    game_label: string;
    player_num: number;
    player_name: string;
    victory_points: number;
}

export interface GameResults {
    id: number;
    gameLabel: string;
    playerNum: number;
    playerName: string;
    victoryPoints: number;
}

export interface PlayerResultForm {
    playerName: string;
    playerPlace: number;
    victoryPoints: number;
}

export interface GameResultsForm {
    gameId: string;
    playerData: PlayerResultForm[];
}

export interface ErrorObject {
    status: 'error';
    error: string;
}

export interface UserErrorResult {
    status: 400 | 409;
    results: ErrorObject[];
}
export interface DevErrorResult {
    status: 500;
    results: ErrorObject[];
}
export interface SuccessResult {
    status: 200;
    results: GameResults[];
}
export type GameResultsFormResult =
    | UserErrorResult
    | DevErrorResult
    | SuccessResult;

export interface DominionUser {
    email: string;
    name: string;
}

export interface PlayerTurn {
    gameId: string;
    playerTurn: number;
    playerName: string;
    playedCards: PlayedCard[];
    purchasedCards: PlayedCard[];
}

export interface PlayedCard {
    card: string;
    effect: Effect;
    phase: "action" | "buy" | "night";
    durationResolve: boolean;
    usedVillagers: boolean;
}

export interface Effect {
    gain: PlayedCard[];
    draw: string[];
    action: number;
    villagers: number;
    coffers: number;
    VP: number;
    trash: PlayedCard[];
}