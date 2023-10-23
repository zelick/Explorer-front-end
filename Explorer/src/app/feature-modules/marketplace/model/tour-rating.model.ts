export interface TourRating {
    id?: number;
    rating: number;
    comment?: string;
    touristId: number;
    tourId: number;
    date: string;
    pictures?: string;
}