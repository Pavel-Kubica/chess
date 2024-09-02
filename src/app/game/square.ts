
export default class Square
{
    constructor(file: string, rank: number)
    {
        this.file = file;
        this.rank = rank;
    }
    file: string;
    rank: number;

    static fromString(s: string): Square | null
    {
        if (!s.match(/^[a-h][1-8]$/))
        {
            return null;
        }
        return new Square(s.charAt(0), +s.charAt(1))
    }
}