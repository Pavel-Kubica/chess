
export enum Color
{
    WHITE,
    BLACK
}

export function baseRank(color: Color): 1 | 8
{
    if (color === Color.WHITE) return 1;
    return 8;
}
export function promotionRank(color: Color): 1 | 8
{
    return baseRank(otherColor(color));
}
export function doublePawnMoveRank(color: Color): 2 | 7
{
    if (color === Color.WHITE) return 2;
    return 7;
}
export function enPassantRank(color: Color): 4 | 5
{
    if (color === Color.WHITE) return 5;
    return 4;
}
export function otherColor(color: Color): Color
{
    if (color === Color.WHITE) return Color.BLACK;
    return Color.WHITE;
}