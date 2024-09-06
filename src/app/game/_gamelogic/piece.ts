import Square from "@/app/game/_gamelogic/square";
import Board from "@/app/game/_gamelogic/board";
import {baseRank, Color, doublePawnMoveRank, enPassantRank} from "@/app/game/_gamelogic/color";
import {BoardMove} from "@/app/game/_gamelogic/move";
import {Castles} from "@/app/game/_gamelogic/castles";


export abstract class Piece
{
    abstract possibleMoves(from: Square, color: Color, board: Board): BoardMove[];
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

abstract class StraightLineMovingPiece extends Piece
{
    abstract getDirectionAdvancingFunctions(): ((square: Square) => Square | undefined)[]

    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {
        let retArr: BoardMove[] = [];

        for (const advancedInDirection of this.getDirectionAdvancingFunctions())
        {
            let curr: Square | undefined = advancedInDirection(from);
            // Build a path in the current direction, storing moves along the way
            while (curr)
            {
                if (board.at(curr))
                { // Encountered a piece
                    if (board.at(curr)!.color !== color)
                    { // Piece is of other color, can capture there
                        retArr.push(new BoardMove(from, curr, true))
                    }
                    // In any case cannot move that way any further
                    break;
                }

                retArr.push(new BoardMove(from, curr))
                curr = advancedInDirection(curr)
            }
        }

        return retArr
    }

}

export class ColoredPiece
{
    constructor(piece: Piece, color: Color)
    {
        this.piece = piece;
        this.color = color;
    }
    piece: Piece;
    color: Color;
}

export class King extends Piece
{
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {
        let reachable = King.reachableExistentSquares(from);

        // Moves
        let retArr: BoardMove[] = reachable.filter(square => !board.at(square)) // No piece at target square
                                    .map(square=> new BoardMove(from, square) )

        // Captures
        retArr = retArr.concat(reachable.filter(square => board.at(square)?.color !== color) // Piece of other color on target square -> can capture
                                    .map(square=> new BoardMove(from, square, true) ))

        // Castles
        const castleRank = baseRank(color);
        if (JSON.stringify(from) === JSON.stringify(new Square("e", castleRank))) // King is at his starting spot
        {
            if (JSON.stringify(board.at(new Square("h", castleRank))?.piece) === JSON.stringify(new Rook()) && // h file Rook is at its starting spot
                !board.at(new Square("f", castleRank))! && !board.at(new Square("g", castleRank))) // AND the path is not obstructed
            {
                retArr.push(new BoardMove(from, from.right()!.right()!, false, Castles.SHORT))
            }

            if (JSON.stringify(board.at(new Square("a", castleRank))?.piece) === JSON.stringify(new Rook()) && // a file Rook is at its starting spot
                !board.at(new Square("b", castleRank))! && !board.at(new Square("c", castleRank)) && !board.at(new Square("d", castleRank))) // AND the path is not obstructed
            {
                retArr.push(new BoardMove(from, from.left()!.left()!, false, Castles.LONG))
            }
        }

        return retArr;
    }

    private static reachableExistentSquares(from: Square): Square[]
    {
        return [from.above(), from.below(), from.right(), from.left(),
            from.topRight(), from.topLeft(), from.bottomRight(), from.bottomLeft()].filter(Boolean) as Square[]
    }
}

export class Pawn extends Piece
{
    // Promotions to be handled by Board
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {
        let retArr: BoardMove[] = [];
        let [aheadSquare, doubleMoveSquare, leftCaptureSquare, rightCaptureSquare] = Pawn.reachableSquares(from, color);

        // Moves
        if (!board.at(aheadSquare!)) // Pawn can't be on last rank
        { // If the square ahead is not occupied
            retArr.push(new BoardMove(from, aheadSquare!));
            if (from.rank === doublePawnMoveRank(color) &&
                !board.at(doubleMoveSquare!)) // If we are on double move rank, doubleMoveSquare is also definitely not null
            { // If that square is also not occupied
                retArr.push(new BoardMove(from, doubleMoveSquare!))
            }
        }

        // Captures
        if (leftCaptureSquare)
        {
            leftCaptureSquare = leftCaptureSquare!
            if (
                // En passant could be possible to the left
                (from.rank === enPassantRank(color) &&
                !board.at(leftCaptureSquare) &&
                board.at(from.left()!))
                ||
                // Or there is simply an opponent's piece on the left capture square
                (board.at(leftCaptureSquare)?.color !== color)
                )
            {
                retArr.push(new BoardMove(from, leftCaptureSquare, true))
            }
        }
        if (rightCaptureSquare)
        {
            rightCaptureSquare = rightCaptureSquare!
            if (
                // En passant could be possible to the right
                (from.rank === enPassantRank(color) &&
                !board.at(rightCaptureSquare) &&
                board.at(from.right()!))
                ||
                // Or there is simply an opponent's piece on the right capture square
                (board.at(rightCaptureSquare)?.color !== color)
                )
            {
                retArr.push(new BoardMove(from, rightCaptureSquare, true))
            }
        }
        return retArr;
    }

    /**
     * @returns [square ahead, doublemove target square, left capture square, right capture square]
     */
    private static reachableSquares(from: Square, color: Color): [Square | undefined, Square | undefined, Square | undefined, Square | undefined]
    {
        if (color === Color.WHITE)
        {
            return [from.above(), from.above()?.above(), from.topLeft(), from.topRight()]
        }
        else
        {
            return [from.below(), from.below()?.below(), from.bottomLeft(), from.bottomRight()]
        }
    }
}
export class Queen extends StraightLineMovingPiece
{
    getDirectionAdvancingFunctions(): ((square: Square) => (Square | undefined))[]
    {
        return [
            (square: Square): Square | undefined => square.above(),
            (square: Square): Square | undefined => square.below(),
            (square: Square): Square | undefined => square.left(),
            (square: Square): Square | undefined => square.right(),
            (square: Square): Square | undefined => square.topRight(),
            (square: Square): Square | undefined => square.bottomLeft(),
            (square: Square): Square | undefined => square.topLeft(),
            (square: Square): Square | undefined => square.bottomRight()
        ];
    }
}
export class Bishop extends StraightLineMovingPiece
{
    getDirectionAdvancingFunctions(): ((square: Square) => (Square | undefined))[]
    {
        return [
            (square: Square): Square | undefined => square.topRight(),
            (square: Square): Square | undefined => square.bottomLeft(),
            (square: Square): Square | undefined => square.topLeft(),
            (square: Square): Square | undefined => square.bottomRight()
        ];
    }
}
export class Knight extends Piece
{
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {
        let retArr: BoardMove[] = [];
        let reachable = Knight.reachableExistentSquares(from);
        retArr = retArr.concat(reachable.filter(square => !board.at(square)) // Moves
                        .map(square => new BoardMove(from, square)))

        retArr = retArr.concat(reachable.filter(square => board.at(square)?.color !== color) // Captures
                        .map(square => new BoardMove(from, square, true)))

        return retArr;
    }

    private static reachableExistentSquares(from: Square): Square[]
    {
        return [from.above()?.above()?.left(), from.above()?.above()?.right(),
                from.below()?.below()?.left(), from.below()?.below()?.right(),
                from.right()?.right()?.above(), from.right()?.right()?.below(),
                from.left()?.left()?.above(), from.left()?.left()?.below()].filter(Boolean) as Square[]
    }
}
export class Rook extends StraightLineMovingPiece
{
    getDirectionAdvancingFunctions(): ((square: Square) => (Square | undefined))[]
    {
        return [
            (square: Square): Square | undefined => square.above(),
            (square: Square): Square | undefined => square.below(),
            (square: Square): Square | undefined => square.left(),
            (square: Square): Square | undefined => square.right()
        ];
    }

}