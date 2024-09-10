import Board from "@/app/game/_gamelogic/board";
import Square from "@/app/game/_gamelogic/square";
import {Bishop, ColoredPiece, King, Knight, Pawn, Queen, Rook} from "@/app/game/_gamelogic/piece";
import {Color, otherColor} from "@/app/game/_gamelogic/color";
import {BoardMove} from "@/app/game/_gamelogic/move";


export default class Game
{
    private board: Board
    // Target square of castle uniquely identifies it
    // To be used as possibleCastles.get(move.to)
    private possibleCastles: Map<Square, boolean>;
    private kingSquares: Map<Color, Square>;
    private lastMove: BoardMove | undefined;
    private onTurn: Color;

    constructor()
    {
        this.board = new Board();
        this.possibleCastles = new Map<Square, boolean>;
        this.kingSquares = new Map<Color, Square>;
        this.lastMove = undefined;
    }
    initializeWithDefaults()
    {

        this.board.placeAt(Square.fromString("a1")!, new ColoredPiece(new Rook(), Color.WHITE))
        this.board.placeAt(Square.fromString("b1")!, new ColoredPiece(new Knight(), Color.WHITE))
        this.board.placeAt(Square.fromString("c1")!, new ColoredPiece(new Bishop(), Color.WHITE))
        this.board.placeAt(Square.fromString("d1")!, new ColoredPiece(new Queen(), Color.WHITE))
        this.board.placeAt(Square.fromString("e1")!, new ColoredPiece(new King(), Color.WHITE))
        this.kingSquares.set(Color.WHITE, Square.fromString("e1")!);
        this.board.placeAt(Square.fromString("f1")!, new ColoredPiece(new Bishop(), Color.WHITE))
        this.board.placeAt(Square.fromString("g1")!, new ColoredPiece(new Knight(), Color.WHITE))
        this.board.placeAt(Square.fromString("h1")!, new ColoredPiece(new Rook(), Color.WHITE))
        this.board.placeAt(Square.fromString("a2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("b2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("c2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("d2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("e2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("f2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("g2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.placeAt(Square.fromString("h2")!, new ColoredPiece(new Pawn(), Color.WHITE))

        this.board.placeAt(Square.fromString("a8")!, new ColoredPiece(new Rook(), Color.BLACK))
        this.board.placeAt(Square.fromString("b8")!, new ColoredPiece(new Knight(), Color.BLACK))
        this.board.placeAt(Square.fromString("c8")!, new ColoredPiece(new Bishop(), Color.BLACK))
        this.board.placeAt(Square.fromString("d8")!, new ColoredPiece(new Queen(), Color.BLACK))
        this.board.placeAt(Square.fromString("e8")!, new ColoredPiece(new King(), Color.BLACK))
        this.kingSquares.set(Color.BLACK, Square.fromString("e8")!);
        this.board.placeAt(Square.fromString("f8")!, new ColoredPiece(new Bishop(), Color.BLACK))
        this.board.placeAt(Square.fromString("g8")!, new ColoredPiece(new Knight(), Color.BLACK))
        this.board.placeAt(Square.fromString("h8")!, new ColoredPiece(new Rook(), Color.BLACK))
        this.board.placeAt(Square.fromString("a7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("b7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("c7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("d7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("e7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("f7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("g7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.placeAt(Square.fromString("h7")!, new ColoredPiece(new Pawn(), Color.BLACK))

        this.possibleCastles.set(Square.fromString("c1")!, false);
        this.possibleCastles.set(Square.fromString("g1")!, false);
        this.possibleCastles.set(Square.fromString("c8")!, false);
        this.possibleCastles.set(Square.fromString("g8")!, false);

        this.onTurn = Color.WHITE;
    }
    getAvailableMovesFrom(square: Square): BoardMove[]
    {
        const targetPiece = this.board.at(square);
        if (!targetPiece) return [];
        const unobstructedMoves = targetPiece.piece.unobstructedMoves(square, targetPiece.color, this.board);
        return unobstructedMoves.filter(move => this.isLegal(move));
    }

    private isLegal(move: BoardMove): boolean
    {
        if (move.captures && !this.board.at(move.to)) // Captures yet no piece at target square => en passant
        {
            if (!this.enPassantMovePossible(move)) return false;
        }
        else if (move.castle)
        {
            if (!this.possibleCastles.get(move.to)) return false;
        }

        return !this.moveExposesKing(move);
    }

    // Move is a guaranteed en passant move (captures but no piece on target square)
    private enPassantMovePossible(move: BoardMove): boolean
    {
        return (
            this.lastMove !== undefined && // There must be a previous move to en passant
            this.board.at(this.lastMove!.to)!.piece instanceof Pawn && // AND the last move must be a pawn move
            Math.abs((move.from.rank) - (move.to.rank)) == 2 && // AND the last move must have moved by 2 squares
            this.lastMove.to.file == move.to.file // AND the last move must be on the same file that this capture is targeting
        )
        // Pawn.unobstructedMoves() already checks to make sure move.from is on the correct rank

    }

    private moveExposesKing(move: BoardMove): boolean
    {
        let boardAfterMove = this.board.clone();
        const kingSquareAfterMove: Square = this.board.at(move.from)!.piece instanceof King ? move.to : this.kingSquares.get(this.onTurn)!
        move.execute(boardAfterMove); // Get a new board which will represent the state after move was executed
        for (const [square, coloredPiece] of boardAfterMove.pieces)
        {
            if (coloredPiece.color === otherColor(this.onTurn))
            { // If any piece of the opponent's color is unobstructed to move to the new king square after the move, then this move exposes the king
                const moves: BoardMove[] = coloredPiece.piece.unobstructedMoves(square, coloredPiece.color, boardAfterMove);
                if (moves.map((move: BoardMove): Square => move.to).includes(kingSquareAfterMove))
                {
                    return true;
                }
            }
        }
        return false;
    }
}