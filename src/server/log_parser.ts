import type { PlayerTurn, PlayedCard, PlayerEffect } from './log_values';
import cards from './cards.json';

// Helper function to parse the actual log of the game
export function parseLog(
    gameID: string,
    players: string[],
    log: string
): PlayerTurn[] {
    let game: string[] = trimLog(log);

    let fullGame: PlayerTurn[] = [];

    for (let turn of game) {
        let turnResult: PlayerTurn | null = handleTurn(gameID, turn);
        if (turnResult != null) {
            fullGame.push(turnResult);
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
function handleTurn(gameID: string, turn: string): PlayerTurn | null {
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
    if (isNaN(Number(splitTurn[0][0]))) {
        return null;
    }

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
            }
        }
    }

    let thisTurn: PlayerTurn = {
        gameId: gameID,
        playerTurn: activeTurn,
        playerName: activePlayer,
        playedCards: playedCards,
        purchasedCards: purchasedCards
    };

    console.log(thisTurn);

    return thisTurn;
}

function handlePlayKeyword(sentence: string[]): PlayedCard[] {
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

    for(let i = 1; i < sentence.length; i++){
        if(
            sentence[i].charAt(sentence[i].length - 1) === '.' ||
            sentence[i].charAt(sentence[i].length - 1) === ',' ||
            sentence[i+1] === "and"
        ){
            cardName = sentence.slice(1, i+1).join(" ");
            cardIndexOffset = i;
        }
    }

    // Single of this type of card, more cards to follow
    if (
        isNaN(Number(sentence[0])) &&
        cardName.charAt(cardName.length - 1) !== '.'
    ) {
        cardName = cardName.replace(',', '');
        retList = retList.concat(handlePlayKeyword(sentence.slice(cardIndexOffset + 1)));
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
            cardName = cardName.replace(',', '').slice(0, -1); // Chop off 's' from card name, TODO : needs testing
            retList = retList.concat(handlePlayKeyword(sentence.slice(cardIndexOffset + 1)));
        }
        // Last card of the played cards
        else {
            cardName = cardName.replace('.', '').slice(0, -1); // Chop off 's' from card name, TODO : needs testing
        }
    }

    phase = cards['PlayKeyword'][cardName as keyof typeof cards['PlayKeyword']];
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

function generateCard(
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
            throw new Error('not a valid card phase: ' + card + ' ' + phase);
    }
    return retCard;
}
