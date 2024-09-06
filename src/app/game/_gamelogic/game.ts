import Board from "@/app/game/_gamelogic/board";
import Square from "@/app/game/_gamelogic/square";
import {Bishop, ColoredPiece, King, Knight, Pawn, Queen, Rook} from "@/app/game/_gamelogic/piece";
import {Color} from "@/app/game/_gamelogic/color";
import {BoardMove} from "@/app/game/_gamelogic/move";


export default class Game
{
    private board: Board
    // Target square of castle uniquely identifies it
    // To be used as possibleCastles.get(move.to)
    private possibleCastles: Map<Square, boolean>
    initializeWithDefaults()
    {
        this.board.place(Square.fromString("a1")!, new ColoredPiece(new Rook(), Color.WHITE))
        this.board.place(Square.fromString("b1")!, new ColoredPiece(new Knight(), Color.WHITE))
        this.board.place(Square.fromString("c1")!, new ColoredPiece(new Bishop(), Color.WHITE))
        this.board.place(Square.fromString("d1")!, new ColoredPiece(new Queen(), Color.WHITE))
        this.board.place(Square.fromString("e1")!, new ColoredPiece(new King(), Color.WHITE))
        this.board.place(Square.fromString("f1")!, new ColoredPiece(new Bishop(), Color.WHITE))
        this.board.place(Square.fromString("g1")!, new ColoredPiece(new Knight(), Color.WHITE))
        this.board.place(Square.fromString("h1")!, new ColoredPiece(new Rook(), Color.WHITE))
        this.board.place(Square.fromString("a2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("b2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("c2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("d2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("e2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("f2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("g2")!, new ColoredPiece(new Pawn(), Color.WHITE))
        this.board.place(Square.fromString("h2")!, new ColoredPiece(new Pawn(), Color.WHITE))

        this.board.place(Square.fromString("a8")!, new ColoredPiece(new Rook(), Color.BLACK))
        this.board.place(Square.fromString("b8")!, new ColoredPiece(new Knight(), Color.BLACK))
        this.board.place(Square.fromString("c8")!, new ColoredPiece(new Bishop(), Color.BLACK))
        this.board.place(Square.fromString("d8")!, new ColoredPiece(new Queen(), Color.BLACK))
        this.board.place(Square.fromString("e8")!, new ColoredPiece(new King(), Color.BLACK))
        this.board.place(Square.fromString("f8")!, new ColoredPiece(new Bishop(), Color.BLACK))
        this.board.place(Square.fromString("g8")!, new ColoredPiece(new Knight(), Color.BLACK))
        this.board.place(Square.fromString("h8")!, new ColoredPiece(new Rook(), Color.BLACK))
        this.board.place(Square.fromString("a7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("b7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("c7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("d7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("e7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("f7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("g7")!, new ColoredPiece(new Pawn(), Color.BLACK))
        this.board.place(Square.fromString("h7")!, new ColoredPiece(new Pawn(), Color.BLACK))

        this.possibleCastles.set(Square.fromString("c1")!, false);
        this.possibleCastles.set(Square.fromString("g1")!, false);
        this.possibleCastles.set(Square.fromString("c8")!, false);
        this.possibleCastles.set(Square.fromString("g8")!, false);
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
        if (move.castle)
        {
            if (!this.possibleCastles.get(move.to)) return false;
        }
    }

}