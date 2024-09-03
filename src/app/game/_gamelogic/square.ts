
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
    below(): Square | null
    {
        if (this.rank === 1) return null;
        return new Square(this.file, this.rank - 1);
    }
    above(): Square | null
    {
        if (this.rank === 8) return null;
        return new Square(this.file, this.rank + 1);
    }
    left(): Square | null
    {
        if (this.file === "a") return null;
        return new Square(String.fromCharCode(this.file.charCodeAt(0) - 1), this.rank);
    }
    right(): Square | null
    {
        if (this.file === "h") return null;
        return new Square(String.fromCharCode(this.file.charCodeAt(0) + 1), this.rank);
    }
    topRight(): Square | null | undefined
    {
        return this.right()?.above();
    }
    topLeft(): Square | null | undefined
    {
        return this.left()?.above();
    }
    bottomRight(): Square | null | undefined
    {
        return this.right()?.below();
    }
    bottomLeft(): Square | null | undefined
    {
        return this.left()?.below();
    }

    allOnSameFile(): Square[]
    {
        let retArr: Square[] = [];
        for (let i = 1; i <= 8; i++)
        {
            if (i != this.rank)
            {
                retArr.push(new Square(this.file, i));
            }
        }
        return retArr;
    }
    allOnSameRank(): Square[]
    {
        let retArr: Square[] = [];
        for (let i = "a".charCodeAt(0); i <= "h".charCodeAt(0); i++)
        {
            if (i != this.file.charCodeAt(0))
            {
                retArr.push(new Square(String.fromCharCode(i), this.rank));
            }
        }
        return retArr;
    }
    allDiagonal(): Square[]
    {
        let retArr: Square[] = [];
        let curr = new Square(this.file, this.rank)
        while (curr.topRight())
        {
            retArr.push(curr = curr.topRight()!)
        }
        curr = new Square(this.file, this.rank)
        while (curr.topLeft())
        {
            retArr.push(curr = curr.topLeft()!);
        }
        curr = new Square(this.file, this.rank)
        while (curr.bottomLeft())
        {
            retArr.push(curr = curr.bottomLeft()!);
        }
        curr = new Square(this.file, this.rank)
        while (curr.bottomRight())
        {
            retArr.push(curr = curr.bottomRight()!);
        }
        return retArr;
    }


    // Performs no integrity checks, make sure a horizontal path is possible before calling
    private static horizontalPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.file.charCodeAt(0) < currSquare.file.charCodeAt(0) - 1)
        {
            retArr.push(currSquare = currSquare.left()!)
        }
        while (target.file.charCodeAt(0) > currSquare.file.charCodeAt(0) + 1)
        {
            retArr.push(currSquare = currSquare.right()!)
        }
        return retArr;
    }

    // Performs no integrity checks, make sure a vertical path is possible before calling
    private static verticalPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.below()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.above()!)
        }
        return retArr;
    }
    // Performs no integrity checks, make sure a diagonal path in the top right-bottom left direction is possible before calling
    private static diagonalTopRightPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.below()!.left()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.above()!.right()!)
        }
        return retArr;
    }
    // Performs no integrity checks, make sure a diagonal path in the top left-bottom right direction is possible before calling
    private static diagonalTopLeftPath(currSquare: Square, target: Square): Square[]
    {
        let retArr: Square[] = []
        while (target.rank < currSquare.rank - 1)
        {
            retArr.push(currSquare = currSquare.below()!.right()!)
        }
        while (target.rank > currSquare.rank + 1)
        {
            retArr.push(currSquare = currSquare.above()!.left()!)
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