import Square from "@/app/game/_gamelogic/square";
import {Piece} from "@/app/game/_gamelogic/piece";
import {
    Castles,
    LONG_CSTL_ROOK_SRC_FILE,
    LONG_CSTL_ROOK_TARGET_FILE,
    SHORT_CSTL_ROOK_SRC_FILE,
    SHORT_CSTL_ROOK_TARGET_FILE
} from "@/app/game/_gamelogic/castles";
import Board from "@/app/game/_gamelogic/board";


// An instance of this class existing ensures that such a move exists and is possible on the board it was made with.
// If the decision is made to execute this move, the board must properly find and process en passant, castles, promotions, captures etc.
export class BoardMove
{

    // If a move should capture but there is no piece at the target square => en passant
    constructor(from: Square, to: Square, captures: boolean = false, castle: Castles | undefined = undefined)
    {
        this.from = from;
        this.to = to;
        this.captures = captures;
        this.castle = castle;
    }
    from: Square;
    to: Square;
    captures: boolean = false;
    castle: Castles | undefined = undefined

    execute(board: Board)
    {
        if (this.castle)
        {
            this.executeCastle(board);
            return;
        }
        if (this.captures)
        {
            if (!board.removeAt(this.to))
            { // No piece to remove at capture target => en passant
                board.removeAt(new Square(this.to.file, this.from.rank));
            }
        }
        board.placeAt(this.to, board.at(this.from)!);
        board.removeAt(this.from);
    }
    private executeCastle(board: Board)
    {
        const baseRank = this.from.rank;
        let rookSrcSquare: Square;
        let rookTargetSquare: Square;
        if (this.castle === Castles.SHORT)
        {
            rookSrcSquare = new Square(SHORT_CSTL_ROOK_SRC_FILE, baseRank);
            rookTargetSquare = new Square(SHORT_CSTL_ROOK_TARGET_FILE, baseRank);
        }
        else
        {
            rookSrcSquare = new Square(LONG_CSTL_ROOK_SRC_FILE, baseRank);
            rookTargetSquare = new Square(LONG_CSTL_ROOK_TARGET_FILE, baseRank);
        }
        board.placeAt(this.to, board.at(this.from)!);
        board.placeAt(rookTargetSquare, board.at(rookSrcSquare)!);
        board.removeAt(this.from);
        board.removeAt(rookSrcSquare);
    }
}

export class Move
{
    // In fromString() we might know only rank, or only file, or neither. The type only becomes Square when we know the full square
    from: Square | string | undefined;
    to: Square;
    isCapture: boolean;
    promotesTo: Piece | undefined;
    deliversCheck: boolean;
    deliversCheckmate: boolean;
    piece: Piece;

    // This function only checks the syntax of the move
    // The board must check its validity (if it's possible, promotion legality, check/mate etc.)
    static fromString(s: string): Move | null
    {
        let move: Move = new Move();

        // Parse check and checkmate
        if (s.endsWith("+"))
        {
            move.deliversCheck = true;
            move.deliversCheckmate = false;
            s = s.slice(0, -1);
        }
        else if (s.endsWith("#"))
        {
            move.deliversCheckmate = true;
            move.deliversCheck = true;
            s = s.slice(0, -1);
        }
        else
        {
            move.deliversCheckmate = false;
            move.deliversCheck = false;
        }

        // Parse promotion
        if (s.slice(-2).match(/=[QRBN]/))
        {
            move.promotesTo = Piece.fromString(s.slice(-1))!;
            s = s.slice(0, -2);
        }
        else
        {
            move.promotesTo = undefined;
        }

        // Parse target square
        let target = Square.fromString(s.slice(-2));
        if (!target) return null;
        move.to = target;
        s = s.slice(0, -2);

        // Parse capture
        if (s.endsWith("x"))
        {
            move.isCapture = true;
            s = s.slice(0, -1);
        }
        else
        {
            move.isCapture = false;
        }

        // Parse optional from square specifier
        if (s.match(/[a-h][1-8]$/))
        {
            move.from = Square.fromString(s.slice(-2))!;
            s = s.slice(0, -2);
        }
        else if (s.match(/[a-h]$/) || s.match(/[1-8]$/))
        {
            move.from = s.slice(-1);
            s = s.slice(0, -1);
        }
        else
            move.from = undefined;

        // Parse piece
        let piece = Piece.fromString(s);
        if (!piece) return null;
        move.piece = piece;

        return move;
    }
}