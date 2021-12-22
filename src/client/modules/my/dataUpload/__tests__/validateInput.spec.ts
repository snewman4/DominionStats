import {
    isEmptyName,
    isEmptyNumber,
    allEmpty,
    anyEmpty,
    validPlace,
    validateInput,
    ERRORS,
    validateFilledData
} from '../helpers/validateInput';
import type { GameData, PlayerData } from '../helpers/types';

//jest tests
describe('Input form field validation', () => {
    it('Valid input object with two entries has no errors', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 1,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);
    });

    it('Valid input object with six entries has no errors', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 30
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 25
                },
                {
                    playerName: 'Player 3',
                    playerPlace: 3,
                    victoryPoints: 20
                },
                {
                    playerName: 'Player 4',
                    playerPlace: 4,
                    victoryPoints: 15
                },
                {
                    playerName: 'Player 5',
                    playerPlace: 5,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 6',
                    playerPlace: 6,
                    victoryPoints: 5
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);
    });

    it('Valid input object with scores <= 0 has no errors', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 0
                },
                {
                    playerName: 'Player 3',
                    playerPlace: 3,
                    victoryPoints: -10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);
    });

    it('Input object with blank game ID is invalid', () => {
        const testObject: GameData = {
            gameId: '',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 1,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);
    });

    it('Input object with no entries is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: []
        };

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);
    });

    it('Input object with one entry is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.MINIMUM_ENTRIES);
    });

    it('Entry missing a name is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: '',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.NO_EMPTY_VALUES);
    });

    it('Entry missing a score is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: NaN
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.NO_EMPTY_VALUES);
    });

    it('Input object with a gap between entries is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: '',
                    playerPlace: NaN,
                    victoryPoints: NaN
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 3,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.NO_BLANKS);
    });

    it('Input object with no first entry is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: '',
                    playerPlace: NaN,
                    victoryPoints: NaN
                },
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 10
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 10
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(ERRORS.NO_EMPTY_VALUES);
        expect(result[1]).toEqual(ERRORS.PLACE_RANGE);
    });

    it('Victory points not in descending order is invalid', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 30
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 40
                },
                {
                    playerName: 'Player 3',
                    playerPlace: 3,
                    victoryPoints: 20
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.DECREASING_VP);
    });

    it('Place must be in increasing order', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 2',
                    playerPlace: 2,
                    victoryPoints: 30
                },
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 40
                },
                {
                    playerName: 'Player 3',
                    playerPlace: 3,
                    victoryPoints: 20
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(2);
        expect(result[0]).toEqual(ERRORS.DECREASING_VP);
        expect(result[1]).toEqual(ERRORS.INCREASING_PLACE);
    });

    it('Ties must have equal victory points', () => {
        const testObject: GameData = {
            gameId: 'id',
            playerData: [
                {
                    playerName: 'Player 1',
                    playerPlace: 1,
                    victoryPoints: 30
                },
                {
                    playerName: 'Player 2',
                    playerPlace: 1,
                    victoryPoints: 20
                }
            ]
        };

        const result = validateInput(testObject);
        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(ERRORS.TIE_VP);
    });
});

describe('empty functions', () => {
    it('isEmptyName identifies falsy values', () => {
        expect(isEmptyName(null as any)).toEqual(true);
        expect(isEmptyName(undefined as any)).toEqual(true);
        expect(isEmptyName(NaN as any)).toEqual(true);
        expect(isEmptyName('' as any)).toEqual(true);
        expect(isEmptyName(0 as any)).toEqual(true);
    });
    it('isEmptyName identifies truthy values', () => {
        expect(isEmptyName({} as any)).toEqual(false);
        expect(isEmptyName('bob' as any)).toEqual(false);
        expect(isEmptyName('a' as any)).toEqual(false);
        expect(isEmptyName('0' as any)).toEqual(false);
    });

    it('isEmptyNumber identifies NaN values as empty', () => {
        const empties = [null, NaN, '', 'bob', undefined];
        expect(isEmptyNumber(null as any)).toEqual(true);
        expect(isEmptyNumber(undefined as any)).toEqual(true);
        expect(isEmptyNumber(NaN as any)).toEqual(true);
        expect(isEmptyNumber('' as any)).toEqual(true);
        expect(isEmptyNumber('bob' as any)).toEqual(true);
    });
    it('isEmptyNumber returns true for numbers', () => {
        expect(isEmptyNumber(-Infinity as any)).toEqual(false);
        expect(isEmptyNumber(Infinity as any)).toEqual(false);
        expect(isEmptyNumber(-1 as any)).toEqual(false);
        expect(isEmptyNumber(0 as any)).toEqual(false);
        expect(isEmptyNumber(1 as any)).toEqual(false);
    });
});

describe('allEmpty', () => {
    it('allEmpty', () => {
        expect(
            allEmpty({ playerName: '', playerPlace: null, victoryPoints: null })
        ).toEqual(true);
        expect(
            allEmpty({
                playerName: null,
                playerPlace: '',
                victoryPoints: ''
            } as any)
        ).toEqual(true);
    });
    it('allEmpty returns false if any values are filled', () => {
        expect(
            allEmpty({
                playerName: 'bob',
                playerPlace: null,
                victoryPoints: null
            })
        ).toEqual(false);
        expect(
            allEmpty({
                playerName: null,
                playerPlace: 1,
                victoryPoints: ''
            } as any)
        ).toEqual(false);
        expect(
            allEmpty({
                playerName: null,
                playerPlace: undefined,
                victoryPoints: 1
            } as any)
        ).toEqual(false);
        expect(
            allEmpty({
                playerName: 'bob',
                playerPlace: 1,
                victoryPoints: 1
            } as any)
        ).toEqual(false);
    });
});

describe('anyEmpty', () => {
    it('anyEmpty', () => {
        expect(
            anyEmpty({ playerName: '', playerPlace: null, victoryPoints: null })
        ).toEqual(true);
        expect(
            anyEmpty({
                playerName: null,
                playerPlace: '',
                victoryPoints: ''
            } as any)
        ).toEqual(true);
        expect(
            anyEmpty({
                playerName: 'bob',
                playerPlace: null,
                victoryPoints: null
            })
        ).toEqual(true);
        expect(
            anyEmpty({
                playerName: null,
                playerPlace: 1,
                victoryPoints: ''
            } as any)
        ).toEqual(true);
        expect(
            anyEmpty({
                playerName: null,
                playerPlace: undefined,
                victoryPoints: 1
            } as any)
        ).toEqual(true);
    });

    it('anyEmpty returns false if all values are filled', () => {
        expect(
            anyEmpty({
                playerName: 'bob',
                playerPlace: 1,
                victoryPoints: 1
            } as any)
        ).toEqual(false);
    });
});

describe('validPlace', () => {
    it('rejects place < 1', () => {
        expect(validPlace({ playerPlace: 0 } as any)).toEqual(false);
        expect(validPlace({ playerPlace: -1 } as any)).toEqual(false);
        expect(validPlace({ playerPlace: -Infinity } as any)).toEqual(false);
    });
    it('rejects place > 6', () => {
        expect(validPlace({ playerPlace: 7 } as any)).toEqual(false);
        expect(validPlace({ playerPlace: 10 } as any)).toEqual(false);
        expect(validPlace({ playerPlace: Infinity } as any)).toEqual(false);
    });
    it('accepts >=1 and <=6', () => {
        expect(validPlace({ playerPlace: 1 } as any)).toEqual(true);
        expect(validPlace({ playerPlace: 2 } as any)).toEqual(true);
        expect(validPlace({ playerPlace: 3 } as any)).toEqual(true);
        expect(validPlace({ playerPlace: 4 } as any)).toEqual(true);
        expect(validPlace({ playerPlace: 5 } as any)).toEqual(true);
        expect(validPlace({ playerPlace: 6 } as any)).toEqual(true);
    });
});
