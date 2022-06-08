import { PlayerTurn, PlayedCard, PlayerEffect, isGainEffect, isTrashEffect, isOtherPlayerEffect, isReactionEffect, isExileEffect } from './log_values';
import cards from './cards.json';
import { UsernameMapping } from './common';
import { match } from 'sequelize/lib/operators';

// Helper function to parse the actual log of the game
export function parseLog(
    gameID: string,
    players: UsernameMapping[],
    log: string
): PlayerTurn[] {
    if (players.length < 2)
        throw new Error('Insufficient number of players in list');
    let game: string[] = trimLog(log);

    let fullGame: PlayerTurn[] = [];

    let iterator = 0; // Tracks the turn index
    console.log('Game length: ' + game.length);
    for (let turn of game) {
        let turnResult: PlayerTurn | null = handleTurn(gameID, turn, iterator);
        if (turnResult !== null) {
            turnResult = updateNames(turnResult, players);
            fullGame.push(turnResult);
            iterator++;
        }
    }

    return fullGame;
}

// Helper function for trimming a log
function trimLog(log: string): string[] {
    // This uses a very specific string to identify what is an effect of another card, and appends the EFFECT
    // prefix to the sentence.
    // This is not at all a good way to do this, but it does seem to work for every card we've tested so far
    log = log.replace(
        /<div style="display:inline; padding-left:2em; text-indent:-0.5em;">/g,
        'EFFECT '
    );
    // Handles nested effects
    log = log.replace(
        /<div style="display:inline; padding-left:3.5em; text-indent:-0.5em;">/g,
        'EFFECT EFFECT '
    );
    //Does the same but for the newer/other div method
    //Single effect
    log = log.replace(
        /<div style="padding-left: 4.[0-9]{0,20}%; width:93.[0-9]{0,20}%;" >/g,
        'EFFECT'
    );
    //Nested effect
    log = log.replace(
        /<div style="padding-left: 8.[0-9]{0,20}%; width:89.[0-9]{0,20}%;" >/g,
        'EFFECT EFFECT'
    );
    //Double nested effect
    log = log.replace(
        /<div style="padding-left: 11.[0-9]{0,20}%; width:86.[0-9]{0,20}%;" >/g,
        'EFFECT EFFECT EFFECT'
    );

    //Removes < > and any characters between them
    log = log.replace(/<[\s\S]*?>/g, '');
    return log.split('Turn'); // Splits game up into turns
}

// Function to update all name references in a turn based off of the provided mapping
export function updateNames(
    turn: PlayerTurn,
    players: UsernameMapping[]
): PlayerTurn {
    let playerNameUpdate: string;

    // Handle playerName associated with turn
    const matchName = players.filter(
        (element) =>
            element.username === turn.playerName ||
            element.playerName === turn.playerName ||
            element.playerSymbol === turn.playerName
    );
    if (matchName.length === 1 && matchName[0].playerName)
        playerNameUpdate = matchName[0].playerName;
    else {
        throw new Error('Unrecognized player: ' + turn.playerName);
    }

    // Handle playerSymbols associated with effects
    for (let card of turn.playedCards) {
        for (let effect of card.effect) {
            effect = updateEffectName(effect, players);
        }
    }

    for (let card of turn.purchasedCards) {
        for (let effect of card.effect) {
            effect = updateEffectName(effect, players);
        }
    }
    return {
        gameId: turn.gameId,
        playerTurn: turn.playerTurn,
        turnIndex: turn.turnIndex,
        playerName: playerNameUpdate,
        playedCards: turn.playedCards,
        purchasedCards: turn.purchasedCards
    };
}

// Helper function to change the name in an individual effect, recursively
function updateEffectName(effect: PlayerEffect, players: UsernameMapping[]): PlayerEffect {
    // Find the matching player for this effect
    let matchSymbol = players.filter((element) => element.username === effect.player || element.playerName === effect.player || element.playerSymbol === effect.player);
    if (matchSymbol.length === 1 && matchSymbol[0].playerName)
        effect.player = matchSymbol[0].playerName;
    else if (matchSymbol.length > 1)
        throw new Error('Too many players match this symbol: ' + effect.player);
    else throw new Error('Unrecognized player: ' + effect.player);

    // Depending on the type of effect this is, update nested effects
    if(isGainEffect(effect)) {
        for(let card of effect.gain) {
            for(let gainEffect of card.effect) {
                gainEffect = updateEffectName(gainEffect, players);
            }
        }
    }
    else if(isTrashEffect(effect)) {
        for(let card of effect.trash) {
            for(let trashEffect of card.effect) {
                trashEffect = updateEffectName(trashEffect, players);
            }
        }
    }
    else if(isOtherPlayerEffect(effect)) {
        for(let otherEffect of effect.otherPlayers) {
            otherEffect = updateEffectName(otherEffect, players);
        }
    }
    else if(isReactionEffect(effect)) {
        for(let reactEffect of effect.reaction.effect) {
            reactEffect = updateEffectName(reactEffect, players);
        }
    }
    else if(isExileEffect(effect)) {
        for(let card of effect.exile) {
            for(let exileEffect of card.effect) {
                exileEffect = updateEffectName(exileEffect, players);
            }
        }
    }

    return effect;
}

// TODO : Handle more keywords, like reacts
// Helper function to handle the individual turn of a game
export function handleTurn(
    gameID: string,
    turn: string,
    turnIndex: number
): PlayerTurn | null {
    // Split up the turn into sentences
    let splitTurn: string[] = turn.split('  ');

    // Remove unnecessary spaces
    // TODO : Weird error where last turn would always have an empty string at the end. Double filter works, but is messy
    splitTurn = splitTurn
        .filter((element) => {
            return element !== '';
        })
        .map((element) => element.trim())
        .filter((element) => {
            return element !== '';
        });

    //TODO: remove when done testing
    console.log('Unprocessed turn:');
    console.log(splitTurn);

    // Check if this is a turn or the beginning of the game
    // TODO : Better handling of not-a-turn
    if (splitTurn.length < 1 || isNaN(Number(splitTurn[0][0]))) return null;

    let activeTurn = 0;
    let activePlayer = '';
    let playedCards: PlayedCard[] = [];
    let purchasedCards: PlayedCard[] = [];

    for (let sentence of splitTurn) {
        let splitSentence = sentence.split(' ');
        // Handles the first sentence of the turn, w/ turn number and name
        if (!isNaN(Number(splitSentence[0]))) {
            activeTurn = Number(splitSentence[0]);
            activePlayer = sentence.substring(sentence.indexOf('-') + 2);
            continue;
        } else if (splitSentence.length > 1) {
            let keyword: string = splitSentence[1];
            //Handles a played card

            switch (keyword) {
                //Handles a played card
                case 'plays':
                    playedCards = playedCards.concat(
                        handlePlayKeyword(splitSentence.slice(2))
                    );
                    break;
                case 'buys':
                    purchasedCards = purchasedCards.concat(
                        handleBuyKeyword(splitSentence.slice(2))
                    );
                    break;
            }
        }
    }

    let thisTurn: PlayerTurn = {
        gameId: gameID,
        playerTurn: activeTurn,
        turnIndex: turnIndex,
        playerName: activePlayer,
        playedCards: playedCards,
        purchasedCards: purchasedCards
    };

    //TODO: remove when done testing
    console.log('Processed turn:');
    console.log(thisTurn);

    return thisTurn;
}

// TODO : Migrate handlePlayKeyword down to listCard
// TODO : Add handling for using a secondary way
// "W plays an Ironmonger using Way of the Monkey"
// Function to handle the plays keyword, such as
// "Matt plays a copper"
export function handlePlayKeyword(sentence: string[]): PlayedCard[] {
    // Default values for tracking information
    let cardName = '';
    let phase = 'action';
    let effect: PlayerEffect[] = [];
    let durationResolve = false;
    let usedVillagers = false;
    let way: string; // Holds the Way used, if one is used
    let amount = 1;
    let cardIndexOffset = 0;

    let retList: PlayedCard[] = [];
    if (sentence.length === 0) return retList; // Empty list case
    if (sentence[0] === 'and') return handlePlayKeyword(sentence.slice(1)); // Remove leading and

    //Loop through strings until the end of the card name is found
    for (let i = 1; i < sentence.length; i++) {
        if (
            sentence[i].charAt(sentence[i].length - 1) === '.' ||
            sentence[i].charAt(sentence[i].length - 1) === ',' ||
            sentence[i + 1] === 'and'
        ) {
            //Once it's found set the name and cardIndexOffset
            if (sentence[i].slice(0, -1) === 'again') {
                //If again is at the end get rid of it but copy over punctuation for processing
                cardName =
                    sentence.slice(1, i).join(' ') + sentence[i].slice(-1);
            } else {
                cardName = sentence.slice(1, i + 1).join(' ');
            }
            cardIndexOffset = i;
            break;
        }
    }

    // Single of this type of card, more cards to follow
    if (
        isNaN(Number(sentence[0])) &&
        cardName.charAt(cardName.length - 1) !== '.'
    ) {
        cardName = cardName.replace(',', '');
        retList = retList.concat(
            handlePlayKeyword(sentence.slice(cardIndexOffset + 1))
        );
    }
    // Single of this type of card, last of played cards
    else if (isNaN(Number(sentence[0]))) {
        cardName = cardName.replace('.', '');
    }
    // Multiple of this type of card
    else {
        amount = Number(sentence[0]);
        // More cards to follow
        if (cardName.charAt(cardName.length - 1) !== '.') {
            cardName = cardName.replace(',', '');
            retList = retList.concat(
                handlePlayKeyword(sentence.slice(cardIndexOffset + 1))
            );
        }
        // Last card of the played cards
        else {
            cardName = cardName.replace('.', '');
        }
    }

    // If a card is played using a Way, store the Way, fix the card
    if (cardName.includes(' using ')) {
        way = cardName.slice(cardName.indexOf(' using ') + 6);
        cardName = cardName.slice(0, cardName.indexOf(' using '));
    }

    //Singularizing card name and verifying the card exists
    cardName = singularize(cardName);

    // Fetching phase of the card
    phase =
        cards['PlayKeyword'][
            cardName.toLowerCase() as keyof typeof cards['PlayKeyword']
        ];
    if (phase === undefined)
        throw new Error('This is not a playable card: ' + cardName);

    //Push the cards to return list
    for (let i = 0; i < amount; i++)
        retList.push(
            generateCard(
                cardName,
                phase,
                effect,
                durationResolve,
                usedVillagers
            )
        );

    return retList;
}

export function handleBuyKeyword(
    sentence: string[],
): PlayedCard[] {
    //If there is "and gains" in the sentence get rid of it
    if (sentence[0] === 'and') {
        sentence = sentence.slice(2);
    }

    return listCards(sentence, 'buy');
}

// Make sure to check for 'EFFECT' and 'EFFECT EFFECT' before passing into this
export function handleEffect(sentence: string[], phase: string) {
    if (sentence.length < 3)
        throw new Error('Effect too short: ' + sentence.join(' '));
    let player: string = sentence[0];
    let keyword: string = sentence[1];
    let amount: number;
    let type: string;

    switch (keyword) {
        case 'gets':
            // If it is a buying power effect
            if (sentence[2][1] === '$' && sentence[2].slice(-1) === '.') {
                amount = Number(sentence[2].slice(2, -1));
                return {
                    type: 'buying power',
                    player: player,
                    buyingPower: amount
                };
            }
            // If not buying power, need more info
            if (sentence.length < 4)
                throw new Error('Effect too short: ' + sentence.join(' '));
            amount = Number(sentence[2].slice(1));
            type = sentence[3].slice(0, -1);
            switch (type) {
                case 'Action':
                    return {
                        type: 'action',
                        player: player,
                        action: amount
                    };
                case 'Coffers':
                    return {
                        type: 'coffers',
                        player: player,
                        coffers: amount
                    };
                // TODO : Add more get keyword effects
                default:
                    throw new Error('Unknown effect: ' + sentence.join(' '));
            }

        case 'gains':
            return {
                type: 'gain',
                player: player,
                gain: listCards(sentence.slice(2), phase)
            };

        case 'trashes':
            return {
                type: 'trash',
                player: player,
                trash: listCards(sentence.slice(2), phase)
            };

        case 'draws':
            return {
                type: 'draw',
                player: player,
                draw: numCards(sentence.slice(2), 0)
            };

        case 'topdecks':
            return {
                type: 'topdeck',
                player: player,
                topdeck: numCards(sentence.slice(2), 0)
            };

        case 'discards':
            return {
                type: 'discard',
                player: player,
                discard: numCards(sentence.slice(2), 0)
            };

        // Some cards, i.e. Scepter, allow you to play another card
        // It isn't necessarily a reaction, but it is identical to reaction
        case 'reacts':
        case 'plays':
            return {
                type: 'reaction',
                player: player,
                reaction: generateCard(
                    sentence.slice(4).join(' ').slice(0, -1),
                    'reaction',
                    [],
                    false,
                    false
                )
            };

        case 'exiles':
            return {
                type: 'exile',
                player: player,
                exile: listCards(sentence.slice(2), phase)
            };

        default:
            return null; // some effects are not tracked, and null represents that
    }
}

// TODO : Migrate handlePlayKeyword down here too
// Function to generate a list of cards interacted with in a sentence
function listCards(sentence: string[], phase) {
    //Default values
    let amount = 1;
    let retList: PlayedCard[] = [];

    //If there are multiple cards bought that are comma seperated
    if (sentence.join().indexOf(',') != -1) {
        for (let i = 0; i < sentence.length; i++) {
            if (sentence[i].slice(-1) === ',') {
                retList = retList.concat(
                    listCards(sentence.slice(i + 1), phase)
                );
                sentence = sentence.slice(0, i + 1);
                break;
            }
        }
    }

    //If there are multiple cards sepereated by an "and"
    if (sentence.indexOf('and') != -1) {
        retList = retList.concat(
            listCards(sentence.slice(sentence.indexOf('and') + 1), phase)
        );
        sentence = sentence.slice(0, sentence.indexOf('and'));
    }

    if (!isNaN(Number(sentence[0]))) {
        //If there is more than 1 card bought
        amount = Number(sentence[0]);
    }

    let cardName: string;

    //Dealing with leading/no leading word
    if (
        sentence[0] !== 'a' &&
        sentence[0] !== 'an' &&
        isNaN(Number(sentence[0]))
    ) {
        //If there isn't a leading a/an/number
        cardName = sentence.slice(0).join(' ');
    } else {
        //Else there is a leading a/an/number
        cardName = sentence.slice(1).join(' ');
    }

    //Setting default values
    if (cardName.slice(-1) === '.' || cardName.slice(-1) === ',') {
        cardName = cardName.slice(0, -1); //Chop off period/comma
    }
    cardName = singularize(cardName);

    let effect: PlayerEffect[] = [];
    let durationResolve = false;
    let usedVillagers = false;

    //Adding cards to returning array
    for (let i = 0; i < amount; i++) {
        retList.push(
            generateCard(
                cardName,
                phase,
                effect,
                durationResolve,
                usedVillagers
            )
        );
    }

    return retList;
}

// Function to determine the number of cards interacted with in a sentence
function numCards(sentence: string[], initialAmount: number): number {
    let amount: number = initialAmount;
    if (sentence.length === 0) return amount; // Empty sentence
    if (sentence[0] === 'a' || sentence[0] === 'an') amount++;
    // Single card
    else if (!isNaN(Number(sentence[0]))) amount += Number(sentence[0]); // Number of cards
    // No card names have the words "a" or "an" in them, or a number, so we don't need to
    // worry about actually reading the cards' names. Just iterate through each word
    return numCards(sentence.slice(1), amount);
}

export function generateCard(
    card: string,
    phase: string,
    effect: PlayerEffect[],
    durationResolve: boolean,
    usedVillagers: boolean
): PlayedCard {
    // Create the card object
    let retCard: PlayedCard = {
        card: card,
        effect: effect,
        phase: 'action', // Default phase, to change
        durationResolve: durationResolve,
        usedVillagers: usedVillagers
    };

    // Assign an accurate phase
    // TODO : Find more efficient way to do this
    switch (phase) {
        case 'action':
            retCard.phase = 'action';
            break;
        case 'attack':
            retCard.phase = 'attack';
            break;
        case 'buy':
            retCard.phase = 'buy';
            break;
        case 'night':
            retCard.phase = 'night';
            break;
        case 'reaction':
            retCard.phase = 'reaction';
            break;
        default:
            // TODO : Use errors provided in common.ts?
            throw new Error(
                'Not a valid card phase: ' + phase + ' for ' + card
            );
    }
    return retCard;
}

//Singularizes a card, or returns an empty string is the word isn't a card
function singularize(word: string): string {
    let lowerWord = word.toLowerCase();
    if (cards['AllCards'].includes(lowerWord)) {
        // Gardens -> Gardens
        return word;
    } else if (
        // Spies -> Spy
        lowerWord.slice(-3) === 'ies' &&
        cards['AllCards'].includes(lowerWord.slice(0, -3) + 'y')
    ) {
        return word.slice(0, -3) + 'y';
    } else if (
        // Necropolises -> Necropolis
        lowerWord.slice(-2) === 'es' &&
        cards['AllCards'].includes(lowerWord.slice(0, -2))
    ) {
        return word.slice(0, -2);
    } else if (cards['AllCards'].includes(lowerWord.slice(0, -1))) {
        // Militias -> Militia
        return word.slice(0, -1);
    } else if (cards['AllCards'].includes(lowerWord.slice(0, -1) + 'um')) {
        // Platina -> Platinum
        return word.slice(0, -1) + 'um';
    }

    throw new Error('Not a valid card name: ' + word);
}
