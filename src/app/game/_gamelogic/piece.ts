import Square from "@/app/game/_gamelogic/square";
import Board from "@/app/game/_gamelogic/board";
import {Color, doublePawnMoveRank} from "@/app/game/_gamelogic/color";
import {BoardMove, MoveBuilder} from "@/app/game/_gamelogic/move";
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
        let moveBase: BoardMove = new BoardMove();
        moveBase.piece = new King();
        moveBase.from = from;

        let reachable = this.reachableExistentSquares(from);
        let retArr: BoardMove[] = reachable.filter(square => !board.at(square)) // No piece at target square
                                    .map( (square): BoardMove => {return {to: square, ...moveBase}} )

        retArr = retArr.concat(reachable.filter(square => board.at(square)?.color !== color) // Piece of other color on target square -> can capture
                                    .map( (square): BoardMove => {return {to: square, captures: true, ...moveBase}} ))

        if (board.castlesPossible(color, Castles.SHORT))
        {
            retArr.push({to: from.left()!.left()!, castle: Castles.SHORT, ...moveBase})
        }
        if (board.castlesPossible(color, Castles.LONG))
        {
            retArr.push({to: from.right()!.right()!, castle: Castles.LONG, ...moveBase})
        }

        return retArr.filter(move => !board.moveExposesKing(move))
    }

    reachableExistentSquares(from: Square): Square[]
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
        let moveBase: BoardMove = new BoardMove();
        moveBase.piece = new Pawn();
        moveBase.from = from;
        let [aheadSquare, doubleMoveSquare, leftCaptureSquare, rightCaptureSquare] = this.reachableSquares(from, color);

        // Moves
        if (!board.at(aheadSquare!)) // Pawn can't be on last rank
        { // If the square ahead is not occupied
            retArr.push({to: aheadSquare!, ...moveBase});
            if (from.rank === doublePawnMoveRank(color) &&
                !board.at(doubleMoveSquare!)) // If we are on double move rank, doubleMoveSquare is also definitely not null
            { // If that square is also not occupied
                retArr.push({to: doubleMoveSquare!, ...moveBase})
            }
        }

        // Captures
        if (leftCaptureSquare)
        {
            leftCaptureSquare = leftCaptureSquare!
            if (board.enPassantPossibleFrom(from) &&
                board.at(from.left()!)) // The en passant capturable pawn is to the correct side
            { // If an en passant enabling move was made, there cannot be a piece to block it
                retArr.push({to: leftCaptureSquare, captures: true, ...moveBase})
            }
            else if (board.at(leftCaptureSquare)?.color !== color)
            { // Piece of opponent's color on the square to the top left
                retArr.push({to: leftCaptureSquare, captures: true, ...moveBase})
            }
        }
        if (rightCaptureSquare)
        {
            rightCaptureSquare = rightCaptureSquare!
            if (board.enPassantPossibleFrom(from) &&
                board.at(from.right()!)) // The en passant capturable pawn is to the correct side
            { // If an en passant enabling move was made, there cannot be a piece to block it
                retArr.push({to: rightCaptureSquare, captures: true, ...moveBase})
            }
            else if (board.at(rightCaptureSquare)?.color !== color)
            { // Piece of opponent's color on the square to the top left
                retArr.push({to: rightCaptureSquare, captures: true, ...moveBase})
            }
        }
        return retArr;
    }

    /**
     * @returns [BoardMove base, square ahead, doublemove target square, left capture square, right capture square]
     */
    reachableSquares(from: Square, color: Color): [Square | null, Square | null | undefined, Square | null | undefined, Square | null | undefined]
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
export class Queen extends Piece
{

    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {

    }
    reachableExistentSquares(from: Square): Square[]
    {
        return from.allOnSameDiagonals().concat(from.allOnSameRank()).concat(from.allOnSameFile());
    }

}
export class Bishop extends Piece
{
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {

    }

    reachableExistentSquares(from: Square): Square[]
    {
        return from.allOnSameDiagonals();
    }
}
export class Knight extends Piece
{
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {

    }

    reachableExistentSquares(from: Square): Square[]
    {
        return [from.above()?.above()?.left(), from.above()?.above()?.right(),
                from.below()?.below()?.left(), from.below()?.below()?.right(),
                from.right()?.right()?.above(), from.right()?.right()?.below(),
                from.left()?.left()?.below(), from.left()?.left()?.above()].filter(Boolean) as Square[]
    }
}
export class Rook extends Piece
{
    possibleMoves(from: Square, color: Color, board: Board): BoardMove[]
    {

    }
    reachableExistentSquares(from: Square): Square[]
    {
        return from.allOnSameRank().concat(from.allOnSameFile());
    }
}