import {
    generateCard,
    handleBuyKeyword
} from '../log_parser';
import type {
    PlayedCard,
    PlayerEffect,
    ActionEffect,
    OtherPlayerEffect,
    GainEffect
} from '../log_values'

// jest tests
describe('Card Generation', () => {
    it('Valid card input with known phase', () => {
        const testCard: PlayedCard = generateCard("TestName", "attack", [], false, false);

        expect(testCard).toEqual({
            card: "TestName",
            phase: "attack",
            effect: [],
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid card input with effects', () => {
        const testEffect: ActionEffect = {
            type: "action",
            player: "TestPlayer",
            action: 2
        };
        const testCard: PlayedCard = generateCard("TestName", "action", [ testEffect ], false, false);

        expect(testCard).toEqual({
            card: "TestName",
            phase: "action",
            effect: [ testEffect ],
            durationResolve: false,
            usedVillagers: false
        });
    });

    it('Valid complex card with many effects', () => {
        const testEffect1: ActionEffect = {
            type: "action",
            player: "TestPlayer1",
            action: 2
        };
        const otherEffect1: GainEffect = {
            type: "gain",
            player: "TestPlayer2",
            gain: [{
                card: "GainCard",
                phase: "action",
                effect: [],
                durationResolve: false,
                usedVillagers: false
            }]
        };
        const testEffect2: OtherPlayerEffect = {
            type: "other players",
            player: "TestPlayer1",
            otherPlayers: [ otherEffect1 ]
        };

        const testCard: PlayedCard = generateCard("TestName", "action", [ testEffect1, testEffect2 ], true, false);

        expect(testCard).toEqual({
            card: "TestName",
            phase: "action",
            effect: [{
                type: "action",
                player: "TestPlayer1",
                action: 2
            }, testEffect2 ],
            durationResolve: true,
            usedVillagers: false
        });
    });

    it('Invalid card input with unknown phase', () => {
        expect(() => {
            generateCard("TestName", "dodge", [], false, false) 
        }).toThrow('not a valid card phase: TestName dodge');
    });

    it('Invalid card input with mispelled phase', () => {
        expect(() => {
            generateCard("TestName", "atack", [], false, false)
        }).toThrow('not a valid card phase: TestName atack');
    });
});

describe('Buy Keyword Handling', () => {
    it('Valid input of single card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["a", "Silver."]);

        expect(testCard).toEqual([{
            card: "Silver",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of a single multi-word card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["a", "Merchant", "Camp."]);

        expect(testCard).toEqual([{
            card: "Merchant Camp",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of multiple single-word card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["2", "Silvers"]);

        expect(testCard).toEqual([{
            card: "Silver",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Silver",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of multiple single-word cards with complex plurals', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["3", "Spies."]);

        expect(testCard).toEqual([{
            card: "Spy",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Spy",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Spy",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of multiple multi-word cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["2", "Capital", "Cities."]);

        expect(testCard).toEqual([{
            card: "Capital City",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Capital City",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    // NOTE : We are not sure that this is how the log prints such a purchase. We will look into it further
    it('Valid input of multiple multi-word cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["3", "Families", "of", "Inventors."]);

        expect(testCard).toEqual([{
            card: "Family of Inventors",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Family of Inventors",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Family of Inventors",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of single pluralized(ish) card', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["a", "Gardens."]);

        expect(testCard).toEqual([{
            card: "Gardens",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Valid input of multiple plural cards', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["2", "Taxes."]);

        expect(testCard).toEqual([{
            card: "Tax",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }, {
            card: "Tax",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    // Demonstrates that odd pluralization can still be handled
    it('Unexpected pluralization', () => {
        const testCard: PlayedCard[] = handleBuyKeyword(["a", "Palaces."]);

        expect(testCard).toEqual([{
            card: "Palace",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        }]);
    });

    it('Missing punctuation', () => {
        expect(() => {
            handleBuyKeyword(["a", "Gardens"])
        }).toThrow('Not a valid card name: Garden');
    });

    it('Invalid card name', () => {
        expect(() => {
            handleBuyKeyword(["a", "Stormtrooper."])
        }).toThrow('Not a valid card name: Stormtrooper');
    });

    it('Unexpected additional term', () => {
        expect(() => {
            handleBuyKeyword(["a", "Gardens.", "Kingdom."])
        }).toThrow('Not a valid card name: Gardens. Kingdom');
    });
});