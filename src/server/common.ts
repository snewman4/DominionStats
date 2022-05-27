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

// Interface of card used
export interface PlayedCard {
    card: string; // name of card
    effect: PlayerEffect[]; // list of effects of card
    phase: "action" | "buy" | "night" | "attack" | "reaction"; // phase the card was used/bought in
    durationResolve: boolean; // used as result of duration?
    usedVillagers: boolean; // used as result of villagers?
}

// Interface of various effects a card can have
export interface PlayerEffect {
    player: string; // player effected
    action?: number; // # of actions added
    gain?: PlayedCard[]; // list of cards gained
    draw?: number; // # of cards drawn
    discard?: number; // # of cards discarded
    trash?: PlayedCard[]; // list of cards trashed
    villagers?: number; // # of villagers gained
    coffers?: number; // # of coffers gained
    VP?: number; // # of victory points gained
    otherPlayers?: PlayerEffect[]; // list of effects on other players
}