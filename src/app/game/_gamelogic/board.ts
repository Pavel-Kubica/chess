import {ColoredPiece, Piece} from "@/app/game/_gamelogic/piece";
import Square from "@/app/game/_gamelogic/square";
import {Color} from "@/app/game/_gamelogic/color";
import {BoardMove, Move} from "@/app/game/_gamelogic/move";
import {Castles} from "@/app/game/_gamelogic/castles";

export default class Board
{
    private pieces: Map<Square, ColoredPiece>

    constructor()
    {
        this.pieces = new Map<Square, ColoredPiece>;
    }


    at(square: Square): ColoredPiece | undefined
    {
        return this.pieces.get(square)
    }

    getAvailableMovesFrom(square: Square): BoardMove[]
    {

    }

    doMove(move: BoardMove): void
    {

    }
    moveExposesKing(move: BoardMove): boolean
    {
        return false;
    }
    enPassantPossibleFrom(square: Square): boolean
    {

    }
    castlesPossible(color: Color, shortCastle: Castles): boolean
    {

    }
    setCheckOrMateOfMove(move: BoardMove): void
    {

    }


    private validateMove(move: Move): BoardMove | null
    {

    }
}
