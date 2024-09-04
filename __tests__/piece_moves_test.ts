import '@testing-library/jest-dom'
import {describe, expect, it} from "@jest/globals";
import {Rook} from "@/app/game/_gamelogic/piece";
import Square from "@/app/game/_gamelogic/square";
import {Color} from "@/app/game/_gamelogic/color";
import Board from "@/app/game/_gamelogic/board";
import {BoardMove} from "@/app/game/_gamelogic/move";


describe("Pawn move finder", () => {
    it("finds moves correctly on empty board", () => {

    });
    it("finds moves correctly on empty board", () => {

    })
});

describe("King move finder", () => {
    it("finds moves correctly on empty board", () => {

    });

    it("finds moves and captures correctly with other pieces on the board", () => {

    });
});

describe("Queen move finder", () => {
    it("finds moves correctly on empty board", () => {

    });

    it("finds moves and captures correctly with other pieces on the board", () => {

    });
});

describe("Knight move finder", () => {
    it("finds moves correctly on empty board", () => {

    });

    it("finds moves and captures correctly with other pieces on the board", () => {

    });
});

describe("Bishop move finder", () => {
    it("finds moves correctly on empty board", () => {

    });

    it("finds moves and captures correctly with other pieces on the board", () => {

    });
});

describe("Rook move finder", () => {
    it("finds moves correctly on empty board", () => {
        let d4square = Square.fromString("d4")!;
        expect(new Rook().possibleMoves(d4square, Color.WHITE, new Board())).toStrictEqual(
            expect.arrayContaining(d4square.allOnSameFile().concat(d4square.allOnSameFile()).map(square => new BoardMove(d4square, square) )))

    });

    it("finds moves and captures correctly with other pieces on the board", () => {

    });
});