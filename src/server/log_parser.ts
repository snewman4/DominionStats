import type { PlayerTurn, PlayedCard, PlayerEffect } from './log_values';
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
    if (matchName.length === 1) playerNameUpdate = matchName[0].playerName;
    else {
        throw new Error('Unrecognized player: ' + turn.playerName);
    }

    // Handle playerSymbols associated with effects
    for (let card of turn.playedCards) {
        for (let effect of card.effect) {
            let matchSymbol = players.filter(
                (element) =>
                    element.username === effect.player ||
                    element.playerName === effect.player ||
                    element.playerSymbol === effect.player
            );

            if (matchSymbol.length === 1)
                effect.player = matchSymbol[0].playerName;
            else {
                throw new Error('Unrecognized player: ' + effect.player);
            }
        }
    }

    for (let card of turn.purchasedCards) {
        for (let effect of card.effect) {
            let matchSymbol = players.filter(
                (element) =>
                    element.username === effect.player ||
                    element.playerName === effect.player ||
                    element.playerSymbol === effect.player
            );

            if (matchSymbol.length === 1)
                effect.player = matchSymbol[0].playerName;
            else {
                throw new Error('Unrecognized player: ' + effect.player);
            }
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

    console.log(splitTurn); //TODO: remove when done testing

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
                        handleBuyKeyword(splitSentence.slice(4))
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

    console.log(thisTurn);

    return thisTurn;
}

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

export function handleBuyKeyword(sentence: string[]): PlayedCard[] {
    //Default values
    let amount = 1;

    if (!isNaN(Number(sentence[0]))) {
        //If there is more than 1 card bought
        amount = Number(sentence[0]);
    }
    
    let cardName: string;

    //Dealing with leading/no leading word
    if(sentence[0] !== "a" && sentence[0] !== "an" && !isNaN(Number(sentence[0]))){
        //If there isn't a leading a/an/number
        cardName = sentence.slice(0).join(' ');
    }else{
        //Else there is a leading a/an/number
        cardName = sentence.slice(1).join(' ');
    }

    //Setting default values
    cardName = cardName.slice(0, -1); //Chop off period
    cardName = singularize(cardName);

    let phase = 'buy';
    let effect: PlayerEffect[] = [];
    let durationResolve = false;
    let usedVillagers = false;
    let retList: PlayedCard[] = [];

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
