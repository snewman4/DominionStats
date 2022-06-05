import type { PlayerTurn, PlayedCard, PlayerEffect } from './log_values';
import cards from './cards.json';

// Helper function to parse the actual log of the game
export function parseLog(
    gameID: string,
    players: string[],
    log: string
): PlayerTurn[] {
    if (players.length < 2) throw new Error('Insufficient number of players in list');
    let game: string[] = trimLog(log);

    let fullGame: PlayerTurn[] = [];

    let iterator = 0; // Tracks the turn index
    for (let turn of game) {
        let turnResult: PlayerTurn | null = handleTurn(gameID, turn, iterator);
        if (turnResult != null) {
            fullGame.push(turnResult);
            iterator++;
        }
    }

    return fullGame;
}

// Helper function for trimming a log
function trimLog(log: string): string[] {
    //TODO: implement, may need more processing

    //Removes < > and any characters between them
    log = log.replace(/<[\s\S]*?>/g, '');
    return log.split('Turn'); // Splits game up into turns
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

    //Setting default values
    let cardName = sentence.slice(1).join(' ').slice(0, -1); //Chop off period
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
        return word;
    } else if (
        lowerWord.slice(-3) === 'ies' &&
        cards['AllCards'].includes(lowerWord.slice(0, -3) + 'y')
    ) {
        return word.slice(0, -3) + 'y';
    } else if (
        lowerWord.slice(-2) === 'es' &&
        cards['AllCards'].includes(lowerWord.slice(0, -2))
    ) {
        return word.slice(0, -2);
    } else if (cards['AllCards'].includes(lowerWord.slice(0, -1))) {
        return word.slice(0, -1);
    }

    throw new Error('Not a valid card name: ' + word);
}
