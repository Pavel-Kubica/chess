
export default class Square
{
    constructor(file: string, rank: number)
    {
        this.file = file;
        this.rank = rank;
    }
    file: string;
    rank: number;

    pathTo(target: Square): Square[] | null
    {
        // Straight line paths
        if (target.rank === this.rank)
        {
            return Square.horizontalPath(this, target);
        }
        else if (target.file === this.file)
        {
            return Square.verticalPath(this, target);
        }
        // Top right - bottom left path
        else if (target.rank - this.rank === target.file.charCodeAt(0) - this.file.charCodeAt(0))
        {
            return Square.diagonalTopRightPath(this, target);
        }
        else if (-(target.rank - this.rank) === target.file.charCodeAt(0) - this.file.charCodeAt(0))
        {
            return Square.diagonalTopLeftPath(this, target);
        }
        else
            return null;

    }
    squareBelow(): Square | null
    {
        if (this.rank === 1) return null;
        return new Square(this.file, this.rank - 1);
    }
    squareAbove(): Square | null
    {
        if (this.rank === 8) return null;
        return new Square(this.file, this.rank + 1);
    }
    squareToTheLeft(): Square | null
    {
        if (this.file === "a") return null;
        return new Square(String.fromCharCode(this.file.charCodeAt(0) - 1), this.rank);
    }
    squareToTheRight(): Square | null
    {
        if (this.file === "h") return null;
        return new Square(String.fromCharCode(this.file.charCodeAt(0) + 1), this.rank);
    }

    // Performs no integrity checks, make sure a horizontal path is possible before calling
    private static horizontalPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.file.charCodeAt(0) < currSquare.file.charCodeAt(0) - 1)
        {
            retArr.push(currSquare = currSquare.squareToTheLeft()!)
        }
        while (target.file.charCodeAt(0) > currSquare.file.charCodeAt(0) + 1)
        {
            retArr.push(currSquare = currSquare.squareToTheRight()!)
        }
        return retArr;
    }

    // Performs no integrity checks, make sure a vertical path is possible before calling
    private static verticalPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.squareBelow()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.squareAbove()!)
        }
        return retArr;
    }
    // Performs no integrity checks, make sure a diagonal path in the top right-bottom left direction is possible before calling
    private static diagonalTopRightPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.squareBelow()!.squareToTheLeft()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.squareAbove()!.squareToTheRight()!)
        }
        return retArr;
    }
    // Performs no integrity checks, make sure a diagonal path in the top left-bottom right direction is possible before calling
    private static diagonalTopLeftPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.squareBelow()!.squareToTheRight()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.squareAbove()!.squareToTheLeft()!)
        }
        return retArr;
    }


    static fromString(s: string): Square | null
    {
        if (!s.match(/^[a-h][1-8]$/))
        {
            return null;
        }
        return new Square(s.charAt(0), +s.charAt(1))
    }
}