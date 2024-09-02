import Square from "@/app/game/square";
import Board from "@/app/game/board";


export abstract class Piece
{
    abstract canMoveFromTo(from: Square, to: Square, board: Board): boolean;
    static fromString(s: string): Piece | null
    {
        if (s.length > 1)
        {
            return null
        }
        switch (s)
        {
            case "":
                return new Pawn()
            case "K":
                return new King()
            case "Q":
                return new Queen()
            case "B":
                return new Bishop()
            case "N":
                return new Knight()
            case "R":
                return new Rook()
            default:
                return null
        }
    }
}

export class Pawn extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}
export class King extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}
export class Queen extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}
export class Bishop extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}
export class Knight extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}
export class Rook extends Piece
{
    canMoveFromTo(from: Square, to: Square, board: Board): boolean
    {

    }
}