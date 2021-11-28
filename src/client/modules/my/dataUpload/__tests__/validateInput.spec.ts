import { validateInput } from "../helpers/validateInput";

//jest tests
describe("Input form field validation", () => {

    it("Valid input object with two entries has no errors", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);

    });

    it("Valid input object with six entries has no errors", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 30
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 25
                },
                {
                    "playerName": "Player 3",
                    "victoryPoints": 20
                },
                {
                    "playerName": "Player 4",
                    "victoryPoints": 15
                },
                {
                    "playerName": "Player 5",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 6",
                    "victoryPoints": 5
                },
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);

    });

    it("Valid input object with two entries has no errors", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);

    });

    it("Valid input object with scores <= 0 has no errors", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 0
                },
                {
                    "playerName": "Player 3",
                    "victoryPoints": -10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).toEqual(0);

    });

    it("Input object with blank game ID is invalid", () => {

        const testObject = {
            "gameId": "",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Input object with no entries is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": []
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Input object with one entry is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Entry missing a name is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Entry missing a score is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": NaN
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Input object with a gap between entries is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "",
                    "victoryPoints": NaN
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Input object with no first entry is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "",
                    "victoryPoints": NaN
                },
                {
                    "playerName": "Player 1",
                    "victoryPoints": 10
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 10
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

    it("Victory points not in descending order is invalid", () => {

        const testObject = {
            "gameId": "id",
            "playerData": [
                {
                    "playerName": "Player 1",
                    "victoryPoints": 30
                },
                {
                    "playerName": "Player 2",
                    "victoryPoints": 40
                },
                {
                    "playerName": "Player 3",
                    "victoryPoints": 20
                }
            ]
        }

        const result = validateInput(testObject);
        expect(result.length).not.toEqual(0);

    });

})