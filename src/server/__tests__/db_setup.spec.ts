import { UsernameMapping } from '../common';
import { usernameCheck, userSymbolGenerator } from '../db_setup';

// jest tests
describe('User Symbol Generation', () => {
    it('Valid usernames', () => {
        const testNames: UsernameMapping[] = userSymbolGenerator([
            {
                username: 'snewman1',
                playerName: 'Sam',
                playerSymbol: undefined
            },
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: undefined
            }
        ]);

        expect(testNames.length).toEqual(2);
        expect(testNames).toContainEqual({
            username: 'snewman1',
            playerName: 'Sam',
            playerSymbol: 's'
        });
        expect(testNames).toContainEqual({
            username: 'matt.buland',
            playerName: 'Matt',
            playerSymbol: 'm'
        });
    });

    it('Valid usernames with similar letters', () => {
        const testNames: UsernameMapping[] = userSymbolGenerator([
            {
                username: 'snewman1',
                playerName: undefined,
                playerSymbol: undefined
            },
            { username: 'snewman2', playerName: 'Sam', playerSymbol: undefined }
        ]);

        expect(testNames.length).toEqual(2);
        expect(testNames).toContainEqual({
            username: 'snewman1',
            playerName: undefined,
            playerSymbol: 'snewman1'
        });
        expect(testNames).toContainEqual({
            username: 'snewman2',
            playerName: 'Sam',
            playerSymbol: 'snewman2'
        });
    });

    it('Valid usernames with predefined symbols', () => {
        const testNames: UsernameMapping[] = userSymbolGenerator([
            { username: 'snewman1', playerName: 'Sam', playerSymbol: 'marker' },
            {
                username: 'matt.buland',
                playerName: 'Matt',
                playerSymbol: 'tester'
            }
        ]);

        expect(testNames.length).toEqual(2);
        expect(testNames).toContainEqual({
            username: 'snewman1',
            playerName: 'Sam',
            playerSymbol: 'marker'
        });
        expect(testNames).toContainEqual({
            username: 'matt.buland',
            playerName: 'Matt',
            playerSymbol: 'tester'
        });
    });

    it('Valid usernames with one substring of other', () => {
        const testNames: UsernameMapping[] = userSymbolGenerator([
            {
                username: 'snewman1',
                playerName: 'Sam',
                playerSymbol: undefined
            },
            {
                username: 'snewman12',
                playerName: 'Matt',
                playerSymbol: undefined
            }
        ]);

        expect(testNames.length).toEqual(2);
        expect(testNames).toContainEqual({
            username: 'snewman1',
            playerName: 'Sam',
            playerSymbol: 'snewman1'
        });
        expect(testNames).toContainEqual({
            username: 'snewman12',
            playerName: 'Matt',
            playerSymbol: 'snewman12'
        });
    });

    it('Valid multiple duplicates', () => {
        const testNames: UsernameMapping[] = userSymbolGenerator([
            {
                username: 'sam11',
                playerName: 'Sam',
                playerSymbol: undefined
            },
            {
                username: 'sarah1',
                playerName: 'Sarah',
                playerSymbol: undefined
            },
            {
                username: 'matt8',
                playerName: 'Matt',
                playerSymbol: undefined
            },
            {
                username: 'matthew1',
                playerName: 'Matthew',
                playerSymbol: undefined
            },
            {
                username: 'king',
                playerName: 'King',
                playerSymbol: undefined
            }
        ]);

        expect(testNames.length).toEqual(5);
        expect(testNames).toContainEqual({
            username: 'sam11',
            playerName: 'Sam',
            playerSymbol: 'sam'
        });
        expect(testNames).toContainEqual({
            username: 'sarah1',
            playerName: 'Sarah',
            playerSymbol: 'sar'
        });
        expect(testNames).toContainEqual({
            username: 'matt8',
            playerName: 'Matt',
            playerSymbol: 'matt8'
        });
        expect(testNames).toContainEqual({
            username: 'matthew1',
            playerName: 'Matthew',
            playerSymbol: 'matth'
        });
        expect(testNames).toContainEqual({
            username: 'king',
            playerName: 'King',
            playerSymbol: 'k'
        });
    });

    it('Invalid, identical usernames', () => {
        expect(() => {
            userSymbolGenerator([
                {
                    username: 'snewman1',
                    playerName: 'Sam',
                    playerSymbol: undefined
                },
                {
                    username: 'snewman1',
                    playerName: 'Matt',
                    playerSymbol: undefined
                }
            ]);
        }).toThrow('Duplicate usernames in player names: snewman1');
    });
});
