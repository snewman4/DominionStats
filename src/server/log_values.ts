export interface PlayerTurn {
    gameId: string;
    playerTurn: number;
    turnIndex: number;
    playerName: string;
    playedCards: PlayedCard[];
    purchasedCards: PlayedCard[];
}

// Interface of card used
export interface PlayedCard {
    card: string; // name of card
    effect: PlayerEffect[]; // list of effects of card
    phase: 'action' | 'buy' | 'night' | 'attack' | 'reaction'; // phase the card was used/bought in
    durationResolve: boolean; // used as result of duration?
    usedVillagers: boolean; // used as result of villagers?
}

export interface PlayerEffect {
    type: string;
    player: string;
}

/*
 * Below are all different effects that a card can have,
 * along with tests to go from parent to child class
 */

// # of actions added
export interface ActionEffect extends PlayerEffect {
    type: 'action';
    action: number;
}

export function isActionEffect(pe: PlayerEffect): pe is ActionEffect {
    return pe.type === 'action' && !isNaN(Number((pe as ActionEffect).action));
}

// # of buys added
export interface BuyEffect extends PlayerEffect {
    type: 'buy';
    buy: number;
}

export function isBuyEffect(pe: PlayerEffect): pe is BuyEffect {
    return pe.type === 'buy' && !isNaN(Number((pe as BuyEffect).buy));
}

// list of cards gained
export interface GainEffect extends PlayerEffect {
    type: 'gain';
    gain: PlayedCard[];
}

export function isGainEffect(pe: PlayerEffect): pe is GainEffect {
    return pe.type === 'gain' && Array.isArray((pe as GainEffect).gain);
}

// list of cards trashed
export interface TrashEffect extends PlayerEffect {
    type: 'trash';
    trash: PlayedCard[];
}

export function isTrashEffect(pe: PlayerEffect): pe is TrashEffect {
    return pe.type === 'trash' && Array.isArray((pe as TrashEffect).trash);
}

// # of cards drawn
export interface DrawEffect extends PlayerEffect {
    type: 'draw';
    draw: number;
}

export function isDrawEffect(pe: PlayerEffect): pe is DrawEffect {
    return pe.type === 'draw' && !isNaN(Number((pe as DrawEffect).draw));
}

// list of cards put back into deck
export interface DeckEffect extends PlayerEffect {
    type: 'topdeck';
    topdeck: PlayedCard[];
}

export function isDeckEffect(pe: PlayerEffect): pe is DeckEffect {
    return pe.type === 'topdeck' && Array.isArray((pe as DeckEffect).topdeck);
}

// # of cards discarded
export interface DiscardEffect extends PlayerEffect {
    type: 'discard';
    discard: number;
}

export function isDiscardEffect(pe: PlayerEffect): pe is DiscardEffect {
    return (
        pe.type === 'discard' && !isNaN(Number((pe as DiscardEffect).discard))
    );
}

// # of villagers gained
export interface VillagerEffect extends PlayerEffect {
    type: 'villagers';
    villagers: number;
}

export function isVillagerEffect(pe: PlayerEffect): pe is VillagerEffect {
    return (
        pe.type === 'villagers' &&
        !isNaN(Number((pe as VillagerEffect).villagers))
    );
}

// # of coffers gained
export interface CofferEffect extends PlayerEffect {
    type: 'coffers';
    coffers: number;
}

export function isCofferEffect(pe: PlayerEffect): pe is CofferEffect {
    return (
        pe.type === 'coffers' && !isNaN(Number((pe as CofferEffect).coffers))
    );
}

// # of victory points gained
export interface VPEffect extends PlayerEffect {
    type: 'VP';
    VP: number;
}

export function isVPEffect(pe: PlayerEffect): pe is VPEffect {
    return pe.type === 'VP' && !isNaN(Number((pe as VPEffect).VP));
}

// # of buying power added
export interface BuyingPowerEffect extends PlayerEffect {
    type: 'buying power';
    buyingPower: number;
}

export function isBuyingPowerEffect(pe: PlayerEffect): pe is BuyingPowerEffect {
    return (
        pe.type === 'buying power' &&
        !isNaN(Number((pe as BuyingPowerEffect).buyingPower))
    );
}

// list of effects on other players
export interface OtherPlayerEffect extends PlayerEffect {
    type: 'other players';
    otherPlayers: PlayerEffect[];
}

export function isOtherPlayerEffect(pe: PlayerEffect): pe is OtherPlayerEffect {
    return (
        pe.type === 'other players' &&
        Array.isArray((pe as OtherPlayerEffect).otherPlayers)
    );
}
