import '@testing-library/jest-dom'
import {describe, expect, it} from "@jest/globals";
import {Move} from '@/app/game/_gamelogic/move'
import Square from "@/app/game/_gamelogic/square";
import {Pawn, Queen} from "@/app/game/_gamelogic/piece";

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

describe("Square path test", () => {
    it('finds straight paths', () => {
        expect(new Square("d", 4).pathTo(new Square("h", 4))).toStrictEqual(expect.arrayContaining(
            [new Square("e", 4), new Square("f", 4), new Square("g", 4)]))
        expect(new Square("d", 1).pathTo(new Square("d", 8))).toStrictEqual(expect.arrayContaining(
            [new Square("d", 2), new Square("d", 3), new Square("d", 4),
                    new Square("d", 5), new Square("d", 6), new Square("d", 7)]
        ))
        expect(new Square("d", 8).pathTo(new Square("d", 1))).toStrictEqual(expect.arrayContaining(
            [new Square("d", 2), new Square("d", 3), new Square("d", 4),
                new Square("d", 5), new Square("d", 6), new Square("d", 7)]
        ))
        expect(new Square("a", 1).pathTo(new Square("a", 2))).toStrictEqual([])
        expect(new Square("a", 3).pathTo(new Square("a", 2))).toStrictEqual([])
        expect(new Square("c", 2).pathTo(new Square("c", 2))).toStrictEqual([])
        expect(new Square("c", 2).pathTo(new Square("c", 3))).toStrictEqual([])
        expect(new Square("c", 2).pathTo(new Square("c", 4))).toStrictEqual([new Square("c", 3)])
    });
    it('finds diagonal paths', () => {
        expect(new Square("a", 1).pathTo(new Square("h", 8))).toStrictEqual(expect.arrayContaining(
            [new Square("b", 2), new Square("c", 3), new Square("d", 4),
                    new Square("e", 5), new Square("f", 6), new Square("g", 7)]
        ))
        expect(new Square("e", 5).pathTo(new Square("h", 8))).toStrictEqual(expect.arrayContaining(
            [new Square("f", 6), new Square("g", 7)]
        ))
        expect(new Square("e", 5).pathTo(new Square("c", 3))).toStrictEqual(expect.arrayContaining(
            [new Square("d", 4)]
        ))
        expect(new Square("e", 5).pathTo(new Square("c", 7))).toStrictEqual(expect.arrayContaining(
            [new Square("d", 6)]
        ))
        expect(new Square("e", 5).pathTo(new Square("b", 2))).toStrictEqual(expect.arrayContaining(
            [new Square("c", 3), new Square("d", 4)]
        ))
    });
})