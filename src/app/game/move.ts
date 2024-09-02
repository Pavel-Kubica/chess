import Square from "@/app/game/square";
import {Pawn, Piece} from "@/app/game/piece";

export default class Move
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