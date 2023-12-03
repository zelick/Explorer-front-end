export interface Sale{
    id?: number,
    toursIds: number[],
    start: Date,
    end: Date,
    discount: number,
    authorId: number
}