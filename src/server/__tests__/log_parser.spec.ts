import {
    generateCard,
    handleBuyKeyword,
    handlePlayKeyword,
    handleTurn,
    parseLog,
    updateNames,
    handleEffect
} from '../log_parser';
import {
    BuyEffect,
    BuyingPowerEffect,
    DiscardEffect,
    isGainEffect,
    isOtherPlayerEffect,
    isReactionEffect,
    ReactionEffect
} from '../log_values';
import type {
    PlayedCard,
    PlayerEffect,
    ActionEffect,
    OtherPlayerEffect,
    GainEffect,
    PlayerTurn,
    DrawEffect
} from '../log_values';
import { UsernameMapping } from '../common';

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
        const testCard: PlayedCard[] = handleBuyKeyword(['a', 'Gardens']);

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
            '3 - matt.buland   m plays a Council Room.   EFFECT m draws 2 Coppers and 2 Estates.   EFFECT m gets +1 Buy.   EFFECT W draws a card.   EFFECT j shuffles their deck.   EFFECT j draws a card.   EFFECT g shuffles their deck.   EFFECT g draws a card.   EFFECT D draws a card.   EFFECT a draws a card.   m plays 5 Coppers. (+$5)   m buys and gains an Ironmonger.   m shuffles their deck.   m draws 2 Coppers, 2 Estates and a Cellar.',
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

    it('Valid turn with multi-word name', () => {
        const testTurn = handleTurn(
            '20220604a',
            '1 - Matt Buland   M plays 2 Coppers. (+$2)   M buys and gains 2 Cellars.',
            1
        );

        expect(testTurn).toEqual({
            gameId: '20220604a',
            playerTurn: 1,
            turnIndex: 1,
            playerName: 'Matt Buland',
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
                },
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
                '1 - matt.buland   m plays 2 Coppers. (+$2)   m buys and gains 2 Cellas.',
                0
            );
        }).toThrow('Not a valid card name: Cellas');
    });
});

describe('In-Depth Single Valid Turn Test', () => {
    const testTurn: PlayerTurn = handleTurn(
        '20220606a',
        '11 - tsornson   t plays a Horse.   EFFECT t draws 2 cards.   EFFECT t gets +1 Action.   EFFECT t returns a Horse to the Horse Pile.   t plays a Harbinger.   EFFECT t draws a card.   EFFECT t gets +1 Action.   t plays a Camel Train using Way of the Ox.   EFFECT t gets +2 Actions.   t plays a Sleigh.   EFFECT t gains a Horse.   EFFECT EFFECT t reacts with a Sleigh.   EFFECT EFFECT t discards a Sleigh.   EFFECT EFFECT t looks at 2 cards.   EFFECT EFFECT t topdecks a card.   EFFECT t gains a Horse.   t plays 2 Coppers. (+$2)   t ends their buy phase.   EFFECT t loses 1 Coin.   EFFECT t gets +1 Coffers. (Pageant)   t draws 5 cards.',
        3
    );

    it('Basic turn information', () => {
        expect(testTurn.gameId).toEqual('20220606a');
        expect(testTurn.playerTurn).toEqual(11);
        expect(testTurn.turnIndex).toEqual(3);
        expect(testTurn.playerName).toEqual('tsornson');
    });

    it('Basic played card information', () => {
        expect(testTurn.playedCards.length).toEqual(6);
        expect(
            testTurn.playedCards.filter((element) => element.card === 'Horse')
                .length
        ).toEqual(1);
        expect(
            testTurn.playedCards.filter(
                (element) => element.card === 'Harbinger'
            ).length
        ).toEqual(1);
        expect(
            testTurn.playedCards.filter(
                (element) => element.card === 'Camel Train'
            ).length
        ).toEqual(1);
        expect(
            testTurn.playedCards.filter((element) => element.card === 'Sleigh')
                .length
        ).toEqual(1);
        expect(
            testTurn.playedCards.filter((element) => element.card === 'Copper')
                .length
        ).toEqual(2);
        expect(testTurn.playedCards).toContainEqual({
            card: 'Copper',
            effect: [],
            phase: 'buy',
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Basic purchased card information', () => {
        expect(testTurn.purchasedCards.length).toEqual(0);
    });

    it('Top level effect information', () => {
        // Test top-level effect information
        const horseCard: PlayedCard = testTurn.playedCards.filter(
            (element) => element.card === 'Horse'
        )[0];
        expect(horseCard.phase).toEqual('action');
        expect(horseCard.effect.length).toEqual(2);
        expect(horseCard.effect).toContainEqual({
            type: 'draw',
            player: 't',
            draw: 2
        });
        expect(horseCard.effect).toContainEqual({
            type: 'action',
            player: 't',
            action: 1
        });
        const harbingerCard: PlayedCard = testTurn.playedCards.filter(
            (element) => element.card === 'Harbinger'
        )[0];
        expect(harbingerCard.phase).toEqual('action');
        expect(harbingerCard.effect.length).toEqual(2);
        expect(harbingerCard.effect).toContainEqual({
            type: 'draw',
            player: 't',
            draw: 1
        });
        expect(harbingerCard.effect).toContainEqual({
            type: 'action',
            player: 't',
            action: 1
        });
        const camelCard: PlayedCard = testTurn.playedCards.filter(
            (element) => element.card === 'Camel Train'
        )[0];
        expect(camelCard.phase).toEqual('action');
        expect(camelCard.effect).toEqual([
            {
                type: 'action',
                player: 't',
                action: 2
            }
        ]);
    });

    it('Nested effects', () => {
        const sleighCard1: PlayedCard = testTurn.playedCards.filter(
            (element) => element.card === 'Sleigh'
        )[0];
        // Basic card information
        expect(sleighCard1.phase).toEqual('action');
        expect(sleighCard1.effect.length).toEqual(1);
        expect(
            sleighCard1.effect.filter((element) => element.type === 'gain')
                .length
        ).toEqual(1);
        // Card effect information
        const gainEffect: PlayerEffect = sleighCard1.effect.filter(
            (element) => element.type === 'gain'
        )[0];
        if (isGainEffect(gainEffect)) {
            // Top level gained cards
            expect(gainEffect.gain.length).toEqual(2);
            expect(
                gainEffect.gain.filter(
                    (element) =>
                        element.card === 'Horse' && element.effect.length === 0
                ).length
            ).toEqual(1);
            expect(
                gainEffect.gain.filter(
                    (element) =>
                        element.card === 'Horse' && element.effect.length !== 0
                ).length
            ).toEqual(1);
            expect(
                gainEffect.gain.filter(
                    (element) =>
                        element.card === 'Horse' && element.effect.length === 0
                )
            ).toEqual([
                {
                    card: 'Horse',
                    effect: [],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]);
            // Cards with effects of their own
            const horseWEffect: PlayedCard = gainEffect.gain.filter(
                (element) =>
                    element.card === 'Horse' && element.effect.length !== 0
            )[0];
            expect(horseWEffect.phase).toEqual('action');
            expect(horseWEffect.effect.length).toEqual(1);
            const reactEffect: PlayerEffect = horseWEffect.effect[0];
            if (isReactionEffect(reactEffect)) {
                expect(reactEffect.reaction.phase).toEqual('reaction');
                expect(reactEffect.reaction.effect.length).toEqual(2);
                expect(reactEffect.reaction.effect).toContainEqual({
                    type: 'discard',
                    player: 't',
                    discard: 1
                });
                expect(reactEffect.reaction.effect).toContainEqual({
                    type: 'topdeck',
                    player: 't',
                    topdeck: 1
                });
            }
        }
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

describe('Name Updating Tests', () => {
    it('Valid input', () => {
        // Active players in the game
        const players: UsernameMapping[] = [
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: 'm'
            },
            {
                username: 'snewman1',
                playerName: 'Sam On',
                playerSymbol: 's'
            }
        ];

        // Raw turn inputs with unaltered names
        const drawEffect1: DrawEffect = {
            type: 'draw',
            player: 'm',
            draw: 4
        };
        const drawEffect2: DrawEffect = {
            type: 'draw',
            player: 's',
            draw: 1
        };
        const buyEffect1: BuyEffect = {
            type: 'buy',
            player: 'm',
            buy: 1
        };
        const otherPlayerEffect: OtherPlayerEffect = {
            type: 'other players',
            player: 'm',
            otherPlayers: [drawEffect2]
        };
        const rawTurn: PlayerTurn = {
            gameId: '20220604a',
            playerTurn: 2,
            turnIndex: 5,
            playerName: 'matt.buland',
            playedCards: [
                {
                    card: 'Council Room',
                    effect: [drawEffect1, buyEffect1, otherPlayerEffect],
                    phase: 'action',
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
                    card: 'Ironmonger',
                    effect: [],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        };

        const testUpdate: PlayerTurn = updateNames(rawTurn, players);

        // Expected test outputs
        const expectDraw1: DrawEffect = {
            type: 'draw',
            player: 'Matt',
            draw: 4
        };
        const expectDraw2: DrawEffect = {
            type: 'draw',
            player: 'Sam On',
            draw: 1
        };
        const expectBuy1: BuyEffect = {
            type: 'buy',
            player: 'Matt',
            buy: 1
        };
        const expectOtherPlayer: OtherPlayerEffect = {
            type: 'other players',
            player: 'Matt',
            otherPlayers: [expectDraw2]
        };
        const expectTurn: PlayerTurn = {
            gameId: '20220604a',
            playerTurn: 2,
            turnIndex: 5,
            playerName: 'Matt',
            playedCards: [
                {
                    card: 'Council Room',
                    effect: [drawEffect1, buyEffect1, otherPlayerEffect],
                    phase: 'action',
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
                    card: 'Ironmonger',
                    effect: [],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        };

        expect(testUpdate).toEqual(expectTurn);
    });

    it('Nested names within effects', () => {
        const players: UsernameMapping[] = [
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: 'm'
            },
            {
                username: 'snewman1',
                playerName: 'Sam',
                playerSymbol: 's'
            }
        ];
        const discard: DiscardEffect = {
            type: 'discard',
            player: 's',
            discard: 1
        };
        const buyingPower: BuyingPowerEffect = {
            type: 'buying power',
            player: 'm',
            buyingPower: 1
        };
        const reaction: ReactionEffect = {
            type: 'reaction',
            player: 'm',
            reaction: {
                card: 'Militia',
                effect: [discard, buyingPower],
                phase: 'attack',
                durationResolve: false,
                usedVillagers: false
            }
        };
        const rawTurn: PlayerTurn = {
            gameId: '20220606a',
            playerTurn: 2,
            turnIndex: 4,
            playerName: 'snewman1',
            playedCards: [
                {
                    card: 'Horse',
                    effect: [reaction],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ],
            purchasedCards: [
                {
                    card: 'Horse',
                    effect: [reaction],
                    phase: 'buy',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        };

        const testUpdate: PlayerTurn = updateNames(rawTurn, players);

        expect(testUpdate.gameId).toEqual('20220606a');
        expect(testUpdate.playerTurn).toEqual(2);
        expect(testUpdate.turnIndex).toEqual(4);
        expect(testUpdate.playerName).toEqual('Sam');
        expect(testUpdate.playedCards.length).toEqual(1);
        expect(testUpdate.purchasedCards.length).toEqual(1);

        expect(testUpdate.playedCards[0].effect.length).toEqual(1);
        const playEffect: PlayerEffect = testUpdate.playedCards[0].effect[0];
        expect(playEffect.player).toEqual('Matt');
        if (isReactionEffect(playEffect)) {
            expect(playEffect.reaction.effect.length).toEqual(2);
            expect(playEffect.reaction.effect).toContainEqual({
                type: 'discard',
                player: 'Sam',
                discard: 1
            });
            expect(playEffect.reaction.effect).toContainEqual({
                type: 'buying power',
                player: 'Matt',
                buyingPower: 1
            });
        }

        expect(testUpdate.purchasedCards[0].effect.length).toEqual(1);
        const buyEffect: PlayerEffect = testUpdate.purchasedCards[0].effect[0];
        expect(buyEffect.player).toEqual('Matt');
        if (isReactionEffect(buyEffect)) {
            expect(buyEffect.reaction.effect.length).toEqual(2);
            expect(buyEffect.reaction.effect).toContainEqual({
                type: 'discard',
                player: 'Sam',
                discard: 1
            });
            expect(buyEffect.reaction.effect).toContainEqual({
                type: 'buying power',
                player: 'Matt',
                buyingPower: 1
            });
        }
    });

    it('Missing name definition, basic', () => {
        const players: UsernameMapping[] = [
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: 'm'
            },
            {
                username: 'snewman1',
                playerName: 'Sam',
                playerSymbol: 's'
            }
        ];
        const rawTurn: PlayerTurn = {
            gameId: '20220604a',
            playerTurn: 1,
            turnIndex: 2,
            playerName: 'lord-rat',
            playedCards: [],
            purchasedCards: []
        };

        expect(() => {
            updateNames(rawTurn, players);
        }).toThrow('Unrecognized player: lord-rat');
    });

    it('Missing name definition, effect', () => {
        const players: UsernameMapping[] = [
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: 'm'
            },
            {
                username: 'snewman1',
                playerName: 'Sam On',
                playerSymbol: 's'
            }
        ];
        const drawEffect: DrawEffect = {
            type: 'draw',
            player: 'l',
            draw: 1
        };
        const rawTurn: PlayerTurn = {
            gameId: '20220604a',
            playerTurn: 2,
            turnIndex: 3,
            playerName: 'matt.buland',
            playedCards: [
                {
                    card: 'Cellar',
                    effect: [drawEffect],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ],
            purchasedCards: []
        };

        expect(() => {
            updateNames(rawTurn, players);
        }).toThrow('Unrecognized player: l');
    });
});

describe('Effect Generation Tests', () => {
    it('Valid action effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'gets', '+1', 'Action.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'action',
            player: 't',
            action: 1
        });
    });

    // TODO : Add test for buy effect
    it('Valid gain effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['L', 'gains', 'a', 'Curse.'],
            'attack'
        );

        expect(effectTest).toEqual({
            type: 'gain',
            player: 'L',
            gain: [
                {
                    card: 'Curse',
                    effect: [],
                    phase: 'attack',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        });
    });

    it('Valid gain effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'gains', '2', 'Horses.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'gain',
            player: 't',
            gain: [
                {
                    card: 'Horse',
                    effect: [],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                },
                {
                    card: 'Horse',
                    effect: [],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        });
    });

    it('Valid trash effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['m', 'trashes', 'an', 'Estate.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'trash',
            player: 'm',
            trash: [
                {
                    card: 'Estate',
                    effect: [],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        });
    });

    it('Valid draw effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'draws', '2', 'cards.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'draw',
            player: 't',
            draw: 2
        });
    });

    it('Valid draw effect with multiple cards, player-side', () => {
        const effectTest: PlayerEffect = handleEffect(
            [
                'm',
                'draws',
                'a',
                'Copper,',
                'a',
                'Silver',
                'and',
                'a',
                'Platinum.'
            ],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'draw',
            player: 'm',
            draw: 3
        });
    });

    it('Valid topdeck effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['W', 'topdecks', 'a', 'card.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'topdeck',
            player: 'W',
            topdeck: 1
        });
    });

    it('Valid topdeck effect, multi-word player-side', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['m', 'topdecks', 'a', 'Treasure', 'Trove.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'topdeck',
            player: 'm',
            topdeck: 1
        });
    });

    it('Plural discard effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['s', 'discards', 'a', 'card', 'and', 'a', 'Copper.'],
            'attack'
        );

        expect(effectTest).toEqual({
            type: 'discard',
            player: 's',
            discard: 2
        });
    });

    it('Valid exile discard effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['j', 'discards', 'a', 'Gold', 'from', 'Exile.'],
            'buy'
        );

        expect(effectTest).toEqual({
            type: 'discard',
            player: 'j',
            discard: 1
        });
    });

    it('Valid plural exile discard effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['D', 'discards', '3', 'Golds', 'from', 'Exile,'],
            'buy'
        );

        expect(effectTest).toEqual({
            type: 'discard',
            player: 'D',
            discard: 3
        });
    });

    // TODO : Add test for villagers effect

    it('Valid coffers effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'gets', '+1', 'Coffers.', '(Pageant)'],
            'buy'
        );

        expect(effectTest).toEqual({
            type: 'coffers',
            player: 't',
            coffers: 1
        });
    });

    // TODO : Add test for VP effect

    it('Valid buying power effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['W', 'gets', '+$2.'],
            'attack'
        );

        expect(effectTest).toEqual({
            type: 'buying power',
            player: 'W',
            buyingPower: 2
        });
    });

    it('Valid buying power effect, postponed', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['L', 'gets', '+$1.', '(Merchant)'],
            'buy'
        );

        expect(effectTest).toEqual({
            type: 'buying power',
            player: 'L',
            buyingPower: 1
        });
    });

    // TODO : Add test for other players effect

    it('Valid reaction effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'reacts', 'with', 'a', 'Sleigh.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'reaction',
            player: 't',
            reaction: {
                card: 'Sleigh',
                effect: [],
                phase: 'reaction',
                durationResolve: false,
                usedVillagers: false
            }
        });
    });

    it('Valid exile effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['D', 'exiles', 'a', 'Gold.'],
            'action'
        );

        expect(effectTest).toEqual({
            type: 'exile',
            player: 'D',
            exile: [
                {
                    card: 'Gold',
                    effect: [],
                    phase: 'action',
                    durationResolve: false,
                    usedVillagers: false
                }
            ]
        });
    });

    it('Valid not-a-tracked-effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['j', 'loses', '1', 'Coin'],
            'buy'
        );

        expect(effectTest).toEqual(null);
    });

    it('Valid not-a-tracked-effect', () => {
        const effectTest: PlayerEffect = handleEffect(
            ['t', 'returns', 'a', 'Horse', 'to', 'the', 'Horse', 'pile.'],
            'action'
        );

        expect(effectTest).toEqual(null);
    });

    it('Invalid, too short effect', () => {
        expect(() => {
            handleEffect(['t', 'gets'], 'action');
        }).toThrow('Effect too short: t gets');
    });

    it('Invalid phase', () => {
        expect(() => {
            handleEffect(['t', 'gains', 'a', 'Gardens.'], 'slay');
        }).toThrow('Not a valid card phase: slay for Gardens');
    });
});
