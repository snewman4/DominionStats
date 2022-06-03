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
        const testCard: PlayedCard = handleBuyKeyword(["Silver"]);

        expect(testCard).toEqual({
            card: "Silver",
            effect: [],
            phase: "buy",
            durationResolve: false,
            usedVillagers: false
        });
    });
});