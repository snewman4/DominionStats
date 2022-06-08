import type { PlayerTurn } from './log_values';

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

export interface NameSuccessResult {
    status: 200;
    results: UsernameMapping[];
}

export type UsernameFormResult =
    | UserErrorResult
    | DevErrorResult
    | NameSuccessResult;

export interface LogSuccessResult {
    status: 200;
    results: PlayerTurn[];
}

export type LogFormResult = UserErrorResult | DevErrorResult | LogSuccessResult;

export interface DominionUser {
    email: string;
    name: string;
}

export interface UsernameMapping {
    username: string;
    playerName: string | undefined;
    playerSymbol: string | undefined;
}
