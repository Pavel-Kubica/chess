import {ColoredPiece} from "@/app/game/_gamelogic/piece";
import Square from "@/app/game/_gamelogic/square";

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

    /**
     * @returns false if square is occupied, true otherwise
     */
    placeAt(square: Square, piece: ColoredPiece): boolean
    {
        if (this.pieces.get(square)) return false;
        this.pieces.set(square, piece);
        return true;
    }

    /**
     * @returns false if square is empty, true otherwise
     */
    removeAt(square: Square): boolean
    {
        return this.pieces.delete(square);
    }
    replaceAt(square: Square, piece: ColoredPiece): boolean
    {
        return this.removeAt(square) && this.placeAt(square, piece);
    }
}
