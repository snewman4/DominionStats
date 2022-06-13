import {
    PlayerTurn,
    PlayedCard,
    PlayerEffect,
    isGainEffect,
    isTrashEffect,
    isOtherPlayerEffect,
    isReactionEffect,
    isExileEffect,
    GainEffect,
    ExileEffect,
    ReactionEffect,
    TrashEffect,
    DiscardEffect,
    OtherPlayerEffect,
    isDiscardEffect
} from './log_values';
import cards from './cards.json';
import { UsernameMapping } from './common';

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
        let turnResult: PlayerTurn | null = handleTurn(
            gameID,
            turn,
            iterator,
            players
        );
        if (turnResult !== null) {
            turnResult = updateNames(turnResult, players);

            // TODO : Remove when done testing
            console.log('\nProcessed turn: ');
            console.log('gameId: ', turnResult.gameId);
            console.log('playerTurn: ', turnResult.playerTurn);
            console.log('turnIndex: ', turnResult.turnIndex);
            console.log('playerName: ', turnResult.playerName);
            console.log('\nPlayed Cards:');
            for (let card of turnResult.playedCards) {
                console.log('\nCard: ', card.card);
                console.log('Effects:');
                for (let effect of card.effect) {
                    console.log(effect);
                }
                console.log('Phase: ', card.phase);
            }
            console.log('\nPurchased Cards:');
            for (let card of turnResult.purchasedCards) {
                console.log('\nCard: ', card.card);
                console.log('Effects:');
                for (let effect of card.effect) {
                    console.log(effect);
                }
                console.log('Phase: ', card.phase);
            }
            // End of testing block

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
        'spacing EFFECT 1 '
    );
    // Handles nested effects
    log = log.replace(
        /<div style="display:inline; padding-left:3.5em; text-indent:-0.5em;">/g,
        'spacing EFFECT 2 '
    );
    //Does the same but for the newer/other div method
    //Single effect
    log = log.replace(
        /<div style="padding-left: 4.[0-9]{0,20}%; width:93.[0-9]{0,20}%;" >/g,
        'spacing EFFECT 1'
    );
    //Nested effect
    log = log.replace(
        /<div style="padding-left: 8.[0-9]{0,20}%; width:89.[0-9]{0,20}%;" >/g,
        'spacing EFFECT 2'
    );
    //Double nested effect
    log = log.replace(
        /<div style="padding-left: 11.[0-9]{0,20}%; width:86.[0-9]{0,20}%;" >/g,
        'spacing EFFECT 3'
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
function updateEffectName(
    effect: PlayerEffect,
    players: UsernameMapping[]
): PlayerEffect {
    // Find the matching player for this effect
    let matchSymbol = players.filter(
        (element) =>
            element.username === effect.player ||
            element.playerName === effect.player ||
            element.playerSymbol === effect.player
    );
    if (matchSymbol.length === 1 && matchSymbol[0].playerName)
        effect.player = matchSymbol[0].playerName;
    else if (matchSymbol.length > 1)
        throw new Error('Too many players match this symbol: ' + effect.player);
    else throw new Error('Unrecognized player: ' + effect.player);

    // Depending on the type of effect this is, update nested effects
    if (isGainEffect(effect)) {
        for (let card of effect.gain) {
            for (let gainEffect of card.effect) {
                gainEffect = updateEffectName(gainEffect, players);
            }
        }
    } else if (isTrashEffect(effect)) {
        for (let card of effect.trash) {
            for (let trashEffect of card.effect) {
                trashEffect = updateEffectName(trashEffect, players);
            }
        }
    } else if (isOtherPlayerEffect(effect)) {
        for (let otherEffect of effect.otherPlayers) {
            otherEffect = updateEffectName(otherEffect, players);
        }
    } else if (isReactionEffect(effect)) {
        for (let reactEffect of effect.reaction.effect) {
            reactEffect = updateEffectName(reactEffect, players);
        }
    } else if (isExileEffect(effect)) {
        for (let card of effect.exile) {
            for (let exileEffect of card.effect) {
                exileEffect = updateEffectName(exileEffect, players);
            }
        }
    } else if (isDiscardEffect(effect)) {
        for (let discardEffect of effect.miscEffects) {
            effect = updateEffectName(discardEffect, players);
        }
    }

    return effect;
}

// TODO : Handle more keywords, like reveals
// Helper function to handle the individual turn of a game
export function handleTurn(
    gameID: string,
    turn: string,
    turnIndex: number,
    players: UsernameMapping[]
): PlayerTurn | null {
    // Split up the turn into sentences
    let splitTurn: string[] = turn.split('  ');

    // Remove unnecessary spaces
    // Weird error where last turn would always have an empty string at the end. Double filter works, but is messy
    splitTurn = splitTurn
        .filter((element) => {
            return element !== '';
        })
        .map((element) => element.trim())
        .filter((element) => {
            return element !== '';
        });

    //TODO: remove when done testing
    console.log('\nUnprocessed turn:');
    console.log(splitTurn);
    // End of testing block

    // Check if this is a turn or the beginning of the game
    // TODO : Better handling of not-a-turn
    if (splitTurn.length < 1 || isNaN(Number(splitTurn[0][0]))) return null;

    let activeTurn = 0;
    let activePlayerName = ''; // Player who's turn it is
    // Mapping for active player
    let activePlayer: UsernameMapping = {
        username: 'DEFAULT',
        playerName: 'DEFAULT',
        playerSymbol: 'DEFAULT'
    };
    let activeCard: PlayedCard;
    let playedCards: PlayedCard[] = [];
    let purchasedCards: PlayedCard[] = [];

    let effectList: PlayerEffect[];
    let effectHandled = false; // Tracks whether the current effect has been handled
    let previousPlay = false; // Tracks whether the previous card was played (true) or bought (false)

    let j: number;

    for (let i = 0; i < splitTurn.length; i++) {
        let sentence = splitTurn[i];
        let splitSentence = sentence.split(' ');
        // Handles the first sentence of the turn, w/ turn number and name
        if (!isNaN(Number(splitSentence[0]))) {
            activeTurn = Number(splitSentence[0]);
            activePlayerName = sentence.substring(sentence.indexOf('-') + 2);
            // Check that this is a valid player in the game
            let filteredPlayer: UsernameMapping[] = players.filter(
                (element) =>
                    element.username === activePlayerName ||
                    element.playerName === activePlayerName ||
                    element.playerSymbol === activePlayerName
            );
            if (filteredPlayer.length < 1)
                throw new Error('Unrecognized player: ' + activePlayerName);
            else if (filteredPlayer.length > 1)
                throw new Error('Duplicate players: ' + activePlayerName);
            activePlayer = filteredPlayer[0];
            continue;
            // Handles the rest of the turn
        } else if (splitSentence.length > 1) {
            let keyword: string = splitSentence[1];
            if (keyword !== 'EFFECT') effectHandled = false; // Reset effect tracker

            switch (keyword) {
                case 'EFFECT':
                    if (effectHandled) break; // All effects in a row are handled at once

                    // Determine which card caused the effect
                    if (previousPlay)
                        activeCard = playedCards[playedCards.length - 1];
                    else if (purchasedCards.length < 1) {
                        // TODO : Handle effects that result from previous turns
                        // Some effects come from previous turns, before any card is used
                        break;
                    } else
                        activeCard = purchasedCards[purchasedCards.length - 1];

                    // Identify where consecutive effects end
                    j = i;
                    for (j; j < splitTurn.length; j++) {
                        if (splitTurn[j].split(' ')[1] !== 'EFFECT') {
                            j -= 1;
                            break;
                        }
                    }

                    effectList = handleEffectList(
                        splitTurn.slice(i, j + 1),
                        activeCard.phase,
                        Number(splitSentence[2]),
                        activePlayer
                    );
                    activeCard.effect = effectList;
                    effectHandled = true; // Marks that all consecutive effects are handled
                    break;
                case 'plays':
                    previousPlay = true;
                    playedCards = playedCards.concat(
                        handlePlayKeyword(splitSentence.slice(2))
                    );
                    break;
                case 'buys':
                    previousPlay = false;
                    purchasedCards = purchasedCards.concat(
                        handleBuyKeyword(splitSentence.slice(2))
                    );
                    break;
            }
        } else throw new Error('Unhandlable Sentence: ' + sentence);
    }

    let thisTurn: PlayerTurn = {
        gameId: gameID,
        playerTurn: activeTurn,
        turnIndex: turnIndex,
        playerName: activePlayerName,
        playedCards: playedCards,
        purchasedCards: purchasedCards
    };

    return thisTurn;
}

// TODO : Add handling for using a secondary way
// "W plays an Ironmonger using Way of the Monkey"
// Function to handle the plays keyword, such as
// "Matt plays a Copper."
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

export function handleBuyKeyword(sentence: string[]): PlayedCard[] {
    //If there is "and gains" in the sentence get rid of it
    if (sentence[0] === 'and') sentence = sentence.slice(2);

    return listCards(sentence, 'buy');
}

// Function to generate a single effect, based on the keyword in the string
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
                case 'Actions':
                    return {
                        type: 'action',
                        player: player,
                        action: amount
                    };
                case 'Coffer':
                case 'Coffers':
                    return {
                        type: 'coffers',
                        player: player,
                        coffers: amount
                    };
                case 'Buy':
                case 'Buys':
                    return {
                        type: 'buy',
                        player: player,
                        buy: amount
                    };
                // TODO : Add more get keyword effects
                default:
                    console.log("Uknown action type: " + type);
                    return {
                        type: 'unknown',
                        player: ''
                    };
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
                discard: numCards(sentence.slice(2), 0),
                miscEffects: []
            };

        // Some cards, i.e. Scepter, allow you to play another card
        // It isn't necessarily a reaction, but it is identical to reaction
        case 'plays':
            return {
                type: 'reaction',
                player: player,
                reaction: generateCard(
                    sentence.slice(3).join(' ').slice(0, -1),
                    'reaction',
                    [],
                    false,
                    false
                )
            };

        case 'reacts':
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
            // It is important that this doesn't error out, as there are so many effects that we couldn't possibly
            // list all cases here, and many of them don't matter enough to track.
            // i.e. 'm shuffles their deck.'
            console.log('Unknown effect: ' + sentence.join(' '));
            //If the effect isn't identified here just return unknown
            return {
                type: 'unknown',
                player: ''
            };
    }
}

// TODO : Make it so that reaction effects go into the reaction list, even though reaction effects aren't nested
// Helper function to take in a list of nested effects and return a list of them
export function handleEffectList(
    sentences: string[],
    phase: string,
    activeNest = 1,
    activePlayer: UsernameMapping,
    otherPlayer = false
): PlayerEffect[] {
    if (sentences.length < 1) return [];
    let currentEffect: PlayerEffect = handleEffect(
        sentences[0].split(' ').slice(3),
        phase
    );
    if (currentEffect.type === 'unknown')
        return handleEffectList(
            sentences.slice(1),
            phase,
            activeNest,
            activePlayer,
            otherPlayer
        );

    // Determine if this is an otherPlayer effect, and if so, handle it
    let isOtherPlayer: boolean =
        currentEffect.player !== activePlayer.playerName &&
        currentEffect.player !== activePlayer.playerSymbol &&
        currentEffect.player !== activePlayer.username &&
        !otherPlayer;
    if (sentences.length < 2 && isOtherPlayer) {
        // Only one other player effect
        let otherEffect: OtherPlayerEffect = {
            type: 'other players',
            player: activePlayer.playerSymbol,
            otherPlayers: [currentEffect]
        };
        return [otherEffect];
    } else if (sentences.length < 2) return [currentEffect]; // Not an other player effect
    let nextEffect: string[] = sentences[1].split(' ');
    let finalIndex = 0; // Tracks which effects have been handled

    // Multiple other player effects
    if (isOtherPlayer) {
        let j = 0;
        for (j; j < sentences.length; j++) {
            if (
                sentences[j].split(' ')[3] === activePlayer.playerName ||
                sentences[j].split(' ')[3] === activePlayer.playerSymbol ||
                sentences[j].split(' ')[3] === activePlayer.username
            ) {
                j -= 1;
                break;
            }
        }

        let otherEffect: OtherPlayerEffect = {
            type: 'other players',
            player: activePlayer.playerSymbol,
            otherPlayers: handleEffectList(
                sentences.slice(0, j + 1),
                phase,
                activeNest,
                activePlayer,
                true
            )
        };
        // Generates the list of effects that come after all otherPlayerEffects
        let continueEffect: PlayerEffect[] = handleEffectList(
            sentences.slice(j + 1),
            phase,
            activeNest,
            activePlayer,
            false
        );

        continueEffect.push(otherEffect);

        return continueEffect;
    }

    /*
    TODO : Effects of a reaction card are, for whatever reason, not nested under
    the card itself in the log. As such, we can't add the correct effects
    to the reaction, so they just get added at the same level as the reaction.
    For all intents and purposes, it should work, it's just kind of strange.
    */
    // If the next effect is nested under this one
    if (Number(nextEffect[2]) > activeNest) {
        finalIndex = 1;
        for (finalIndex; finalIndex < sentences.length; finalIndex++) {
            if (Number(sentences[finalIndex].split(' ')[2]) === activeNest) {
                finalIndex -= 1;
                break;
            }
        }

        // Generate a list of nested effects
        let nestedEffects: PlayerEffect[] = handleEffectList(
            sentences.slice(1, finalIndex + 1),
            phase,
            Number(nextEffect[2]),
            activePlayer,
            otherPlayer
        );

        // Add nested effects to the current effect
        if (isGainEffect(currentEffect)) {
            currentEffect.gain[0].effect = nestedEffects;
        } else if (isTrashEffect(currentEffect)) {
            currentEffect.trash[0].effect = nestedEffects;
        } else if (isReactionEffect(currentEffect)) {
            currentEffect.reaction.effect = nestedEffects;
        } else if (isExileEffect(currentEffect)) {
            currentEffect.exile[0].effect = nestedEffects;
        } else if (isDiscardEffect(currentEffect)) {
            currentEffect.miscEffects = nestedEffects;
        } else {
            throw new Error(
                'This effect should not have nested effects: ' + sentences[0]
            );
        }
    }

    return [currentEffect].concat(
        handleEffectList(
            sentences.slice(finalIndex + 1),
            phase,
            activeNest,
            activePlayer,
            otherPlayer
        )
    );
}

// Function to generate a list of cards interacted with in a sentence
function listCards(sentence: string[], phase) {
    //Default values
    let amount = 1;
    let retList: PlayedCard[] = [];

    //If there are multiple cards bought that are comma seperated
    if (sentence.join().indexOf(',') != -1) {
        for (let i = 0; i < sentence.length; i++) {
            if (sentence[i].slice(-1) === ',') {
                let sliceIndex: number;
                // The following is necessary in the event of an Oxford comma
                if (sentence[i + 1] === 'and') sliceIndex = i + 2;
                else sliceIndex = i + 1;
                retList = retList.concat(
                    listCards(sentence.slice(sliceIndex), phase)
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
        cardName = sentence.join(' ');
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

// Function to determine the number of cards interacted with in a sentence,
// without having to verify that they are valid
// Good for sentences like 'm plays a Gold and 2 cards.'
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

// Function to create a card using provided keywords
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
