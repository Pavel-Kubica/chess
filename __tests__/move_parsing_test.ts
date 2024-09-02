import '@testing-library/jest-dom'
import {describe, expect, it} from "@jest/globals";
import Move from '../src/app/game/move'
import Square from "@/app/game/square";
import {Pawn, Queen} from "@/app/game/piece";

describe('Move Parser test', () => {
    it('parses standard moves', () => {
        let move = Move.fromString("d4")
        expect(move).not.toBeNull()
        move = move!
        expect(move.from).toBeUndefined()
        expect(move.to).toStrictEqual(new Square("d", 4))
        expect(move.promotesTo).toBeUndefined()
        expect(move.piece).toBeInstanceOf(Pawn)
        expect(move.deliversCheck).toBe(false)
        expect(move.deliversCheckmate).toBe(false)
        expect(move.isCapture).toBe(false)

        move = Move.fromString("Qxc5#")
        expect(move).not.toBeNull()
        move = move!
        expect(move.from).toBeUndefined()
        expect(move.to).toStrictEqual(new Square("c", 5))
        expect(move.promotesTo).toBeUndefined()
        expect(move.piece).toBeInstanceOf(Queen)
        expect(move.deliversCheck).toBe(true)
        expect(move.deliversCheckmate).toBe(true)
        expect(move.isCapture).toBe(true)
    });
    it('reports incorrect moves', () => {
        expect(Move.fromString("c9")).toBeNull()
        expect(Move.fromString("Ric8")).toBeNull()
        expect(Move.fromString("Pd3")).toBeNull()
        expect(Move.fromString("Kd3-")).toBeNull()
        expect(Move.fromString("a-dc4")).toBeNull()
        expect(Move.fromString("B*d3")).toBeNull()
        expect(Move.fromString("Qj3")).toBeNull()
        expect(Move.fromString("A3")).toBeNull()
        expect(Move.fromString("B5")).toBeNull()
        expect(Move.fromString("Rg0")).toBeNull()
        expect(Move.fromString("cQd4")).toBeNull()
    })
})