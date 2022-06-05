import {
    generateCard,
    handleBuyKeyword,
    handlePlayKeyword,
    handleTurn,
    parseLog
} from '../log_parser';
import { isOtherPlayerEffect } from '../log_values';
import type {
    PlayedCard,
    PlayerEffect,
    ActionEffect,
    OtherPlayerEffect,
    GainEffect,
    PlayerTurn
} from '../log_values';

// jest tests
describe('Card Generation', () => {
    it('Valid card input with known phase', () => {
        const testCard: PlayedCard = generateCard(
            'TestName',
            'attack',
            [],
            false,
            false
        );

        expect(testCard).toEqual({
            card: 'TestName',
            phase: 'attack',
            effect: [],
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid card input with effects', () => {
        const testEffect: ActionEffect = {
            type: 'action',
            player: 'TestPlayer',
            action: 2
        };
        const testCard: PlayedCard = generateCard(
            'TestName',
            'action',
            [testEffect],
            false,
            false
        );

        expect(testCard).toEqual({
            card: 'TestName',
            phase: 'action',
            effect: [testEffect],
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid complex card with many effects', () => {
        const testEffect1: ActionEffect = {
            type: 'action',
            player: 'TestPlayer1',
            action: 2
        };
        const otherEffect1: GainEffect = {
            type: 'gain',
            player: 'TestPlayer2',
            gain: [
                {
                    card: 'GainCard',
                    phase: 'action',
                    effect: [],
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        };
        const testEffect2: OtherPlayerEffect = {
            type: 'other players',
            player: 'TestPlayer1',
            otherPlayers: [otherEffect1]
        };

        const testCard: PlayedCard = generateCard(
            'TestName',
            'action',
            [testEffect1, testEffect2],
            true,
            false
        );

        expect(testCard).toEqual({
            card: 'TestName',
            phase: 'action',
            effect: [
                {
                    type: 'action',
                    player: 'TestPlayer1',
                    action: 2
                },
                testEffect2
            ],
            durationResolve: true,
            usedVillagers: false
        });
    });

    it('Invalid card input with unknown phase', () => {
        expect(() => {
            generateCard('TestName', 'dodge', [], false, false);
        }).toThrow('Not a valid card phase: dodge for TestName');
    });

    it('Invalid card input with mispelled phase', () => {
        expect(() => {
            generateCard('TestName', 'atack', [], false, false);
        }).toThrow('Not a valid card phase: atack for TestName');
    });
});

describe('Buy Keyword Handling', () => {
    it('Valid input of single card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['a', 'Silver.']);

        expect(testCard).toEqual([
            {
                card: 'Silver',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of a single multi-word card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword([
            'a',
            'Merchant',
            'Camp.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Merchant Camp',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of multiple single-word card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['2', 'Silvers']);

        expect(testCard).toEqual([
            {
                card: 'Silver',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Silver',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of multiple single-word cards with complex plurals', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['3', 'Spies.']);

        expect(testCard).toEqual([
            {
                card: 'Spy',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Spy',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Spy',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of multiple multi-word cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword([
            '2',
            'Capital',
            'Cities.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Capital City',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Capital City',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid long card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword([
            'a',
            'Jack',
            'of',
            'All',
            'Trades.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Jack of All Trades',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    // NOTE : We are not sure that this is how the log prints such a purchase. We will look into it further
    it('Valid input of multiple multi-word cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword([
            '3',
            'Families',
            'of',
            'Inventors.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Family of Inventors',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Family of Inventors',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Family of Inventors',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of single pluralized(ish) card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['a', 'Gardens.']);

        expect(testCard).toEqual([
            {
                card: 'Gardens',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of multiple plural cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['2', 'Taxes.']);

        expect(testCard).toEqual([
            {
                card: 'Tax',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Tax',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of card without prefix', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['City', 'Gate.']);

        expect(testCard).toEqual([
            {
                card: 'City Gate',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid input of strange combination', () => {
        const testCard: PlayedCard[] = handleBuyKeyword([
            'a',
            'Council',
            'Room',
            'and',
            'City',
            'Gate.'
        ]);

        expect(testCard.length).toEqual(2);
        expect(
            testCard.filter((element) => element.card === 'Council Room').length
        ).toEqual(1);
        expect(
            testCard.filter((element) => element.card === 'City Gate').length
        ).toEqual(1);
        expect(testCard).toContainEqual({
            card: 'Council Room',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'City Gate',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    // Demonstrates that odd pluralization can still be handled
    it('Unexpected pluralization', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(['a', 'Palaces.']);

        expect(testCard).toEqual([
            {
                card: 'Palace',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Missing punctuation', () => {
        expect(() => {
            handleBuyKeyword(['a', 'Gardens']);
        }).toThrow('Not a valid card name: Garden');
    });

    it('Invalid card name', () => {
        expect(() => {
            handleBuyKeyword(['a', 'Stormtrooper.']);
        }).toThrow('Not a valid card name: Stormtrooper');
    });

    it('Unexpected additional term', () => {
        expect(() => {
            handleBuyKeyword(['a', 'Gardens.', 'Kingdom.']);
        }).toThrow('Not a valid card name: Gardens. Kingdom');
    });
});

describe('Play Keyword Handling', () => {
    it('Valid single play card', () => {
        const testCard: PlayedCard[] = handlePlayKeyword(['a', 'Gold.']);

        expect(testCard).toEqual([
            {
                card: 'Gold',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid single play card, an', () => {
        const testCard: PlayedCard[] = handlePlayKeyword(['an', 'Artisan.']);

        expect(testCard).toEqual([
            {
                card: 'Artisan',
                effect: [],
                phase: 'action',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid multiple same type of play cards', () => {
        const testCard: PlayedCard[] = handlePlayKeyword(['2', 'Silvers.']);

        expect(testCard).toEqual([
            {
                card: 'Silver',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            },
            {
                card: 'Silver',
                effect: [],
                phase: 'buy',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid multiple different cards', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            '2',
            'Coppers,',
            '3',
            'Golds',
            'and',
            'a',
            'Silver.'
        ]);

        expect(testCard.length).toEqual(6);
        expect(
            testCard.filter((element) => element.card === 'Copper').length
        ).toEqual(2);
        expect(
            testCard.filter((element) => element.card === 'Silver').length
        ).toEqual(1);
        expect(
            testCard.filter((element) => element.card === 'Gold').length
        ).toEqual(3);
        expect(testCard).toContainEqual({
            card: 'Copper',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Silver',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Gold',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid multiple, single different cards', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            'an',
            'Artisan,',
            'a',
            'Spy',
            'and',
            'a',
            'Gold.'
        ]);

        expect(testCard.length).toEqual(3);
        expect(
            testCard.filter((element) => element.card === 'Artisan').length
        ).toEqual(1);
        expect(
            testCard.filter((element) => element.card === 'Spy').length
        ).toEqual(1);
        expect(
            testCard.filter((element) => element.card === 'Gold').length
        ).toEqual(1);
        expect(testCard).toContainEqual({
            card: 'Artisan',
            effect: [],
            phase: 'action',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Spy',
            effect: [],
            phase: 'attack',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Gold',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    // Note that this case will probably never happen in a game, but it can be handled if needed
    it('Valid strange plurals', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            '2',
            'Spies',
            'and',
            '3',
            'Rocks.'
        ]);

        expect(testCard.length).toEqual(5);
        expect(
            testCard.filter((element) => element.card === 'Spy').length
        ).toEqual(2);
        expect(
            testCard.filter((element) => element.card === 'Rocks').length
        ).toEqual(3);
        expect(testCard).toContainEqual({
            card: 'Spy',
            effect: [],
            phase: 'attack',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Rocks',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid more strange plurals', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            '2',
            'Silvers',
            'and',
            '2',
            'Platina.'
        ]);

        expect(testCard.length).toEqual(4);
        expect(
            testCard.filter((element) => element.card === 'Silver').length
        ).toEqual(2);
        expect(
            testCard.filter((element) => element.card === 'Platinum').length
        ).toEqual(2);
        expect(testCard).toContainEqual({
            card: 'Silver',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
        expect(testCard).toContainEqual({
            card: 'Platinum',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid night card', () => {
        const testCard: PlayedCard[] = handlePlayKeyword(['a', 'Monastery.']);

        expect(testCard).toEqual([
            {
                card: 'Monastery',
                effect: [],
                phase: 'night',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid long card', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            'a',
            'Jack',
            'of',
            'All',
            'Trades.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Jack of All Trades',
                effect: [],
                phase: 'action',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid card using a Way', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            'an',
            'Ironmonger',
            'using',
            'Way',
            'of',
            'the',
            'Monkey.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Ironmonger',
                effect: [],
                phase: 'action',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Valid multi-word card using a Way', () => {
        const testCard: PlayedCard[] = handlePlayKeyword([
            'a',
            'Flag',
            'Bearer',
            'using',
            'Way',
            'of',
            'the',
            'Monkey.'
        ]);

        expect(testCard).toEqual([
            {
                card: 'Flag Bearer',
                effect: [],
                phase: 'action',
                durationResolve: false,
                usedVillagers: false
            }
        ]);
    });

    it('Invalid non-playable card', () => {
        expect(() => {
            handlePlayKeyword(['a', 'Gardens.']);
        }).toThrow('This is not a playable card: Gardens');
    });

    it('Invalid non-existant card', () => {
        expect(() => {
            handlePlayKeyword(['a', 'Stormtrooper.']);
        }).toThrow('Not a valid card name: Stormtrooper');
    });
});

describe('Handle Turn', () => {
    it('Valid simple turn', () => {
        const testTurn: PlayerTurn = handleTurn(
            '20220604a',
            '1 - matt.buland   matt.buland plays 2 Coppers. (+$2)   matt.buland buys and gains a Cellar.   matt.buland draws 5 Coppers.',
            0
        );

        expect(testTurn).toEqual({
            gameId: '20220604a',
            playerTurn: 1,
            turnIndex: 0,
            playerName: 'matt.buland',
            playedCards: [
                {
                    card: 'Copper',
                    effect: [],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                },
                {
                    card: 'Copper',
                    effect: [],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                }
            ],
            purchasedCards: [
                {
                    card: 'Cellar',
                    effect: [],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        });
    });

    it('Valid turn with effects', () => {
        const testTurn: PlayerTurn = handleTurn(
            '20220604a',
            '3 - matt.buland   m plays a Council Room.   m draws 2 Coppers and 2 Estates.   m gets +1 Buy.   W draws a card.   j shuffles their deck.   j draws a card.   g shuffles their deck.   g draws a card.   D draws a card.   a draws a card.   m plays 5 Coppers. (+$5)   m buys and gains an Ironmonger.   m shuffles their deck.   m draws 2 Coppers, 2 Estates and a Cellar.',
            6
        );

        // Test basic information
        expect(testTurn.gameId).toEqual('20220604a');
        expect(testTurn.playerTurn).toEqual(3);
        expect(testTurn.turnIndex).toEqual(6);
        expect(testTurn.playerName).toEqual('matt.buland');

        // Test basic played card information
        expect(testTurn.playedCards.length).toEqual(6);
        expect(
            testTurn.playedCards.filter((element) => element.card === 'Copper')
                .length
        ).toEqual(5);
        expect(
            testTurn.playedCards.filter(
                (element) => element.card === 'Council Room'
            ).length
        ).toEqual(1);
        expect(testTurn.playedCards).toContainEqual({
            card: 'Copper',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });

        // Test top-level effect information
        const effectCard: PlayedCard = testTurn.playedCards.filter(
            (element) => element.card === 'Council Room'
        )[0];
        expect(effectCard.effect.length).toEqual(3);
        expect(
            effectCard.effect.filter((element) => element.type === 'draw')
                .length
        ).toEqual(1);
        expect(
            effectCard.effect.filter((element) => element.type === 'buy').length
        ).toEqual(1);
        expect(
            effectCard.effect.filter(
                (element) => element.type === 'other players'
            ).length
        ).toEqual(1);
        expect(effectCard.effect).toContainEqual({
            type: 'draw',
            player: 'm',
            draw: 4
        });
        expect(effectCard.effect).toContainEqual({
            type: 'buy',
            player: 'm',
            buy: 1
        });

        // Test that other player effects work
        const otherPlayerEffect: PlayerEffect = effectCard.effect.filter(
            (element) => element.type === 'other players'
        )[0];
        if (isOtherPlayerEffect(otherPlayerEffect)) {
            expect(otherPlayerEffect.player).toEqual('m');
            expect(otherPlayerEffect.otherPlayers.length).toEqual(5);
            expect(
                otherPlayerEffect.otherPlayers.filter(
                    (element) => element.type === 'draw'
                ).length
            ).toEqual(5);
            expect(otherPlayerEffect.otherPlayers).toContainEqual({
                type: 'draw',
                player: 'W',
                draw: 1
            });
            expect(otherPlayerEffect.otherPlayers).toContainEqual({
                type: 'draw',
                player: 'j',
                draw: 1
            });
            expect(otherPlayerEffect.otherPlayers).toContainEqual({
                type: 'draw',
                player: 'g',
                draw: 1
            });
            expect(otherPlayerEffect.otherPlayers).toContainEqual({
                type: 'draw',
                player: 'D',
                draw: 1
            });
            expect(otherPlayerEffect.otherPlayers).toContainEqual({
                type: 'draw',
                player: 'a',
                draw: 1
            });
        }

        // Test purchased card information
        expect(testTurn.purchasedCards).toEqual({
            card: 'Ironmonger',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid input of non-turn', () => {
        const testTurn = handleTurn(
            '20220604a',
            'Game 20220604a, unrated.   m starts with 7 Coppers.   m starts with 3 Estates.   W starts with 7 Coppers.   W starts with 3 Estates.   m shuffles their deck.   m draws 2 Coppers and 3 Estates.   W shuffles their deck.   W draws 5 cards.',
            0
        );

        expect(testTurn).toBeNull;
    });

    it('Invalid card name play keyword', () => {
        expect(() => {
            handleTurn(
                '20220604a',
                '1 - matt.buland   m plays 2 Stormtroopers.   m buys and gains a Cellar.   m draws 5 cards.',
                0
            );
        }).toThrow('Not a valid card name: Stormtroopers');
    });

    it('Invalid card name buys keyword', () => {
        expect(() => {
            handleTurn(
                '20220604a',
                '1 - matt.buland   m plays 2 Coppers. ($+2)   m buys and gains 2 Cellas.',
                0
            );
        }).toThrow('Not a valid card name: Cellas');
    });
});

describe('Parse Log Tests', () => {
    it('Valid log with valid players', () => {
        const testParse: PlayerTurn[] = parseLog(
            '20220604a',
            [
                { username: 'snewman1', playerName: 'Sam', playerSymbol: 's' },
                {
                    username: 'matt.buland',
                    playerName: 'Matt',
                    playerSymbol: 'm'
                }
            ],
            'Test Turn'
        );

        expect(testParse).toBeNull;
    });

    it('Invalid list of player names', () => {
        expect(() => {
            parseLog('20220604a', [], 'Test Turn');
        }).toThrow('Insufficient number of players in list');
    });
});
