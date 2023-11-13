export interface TourRatingPreview {
    rating: number;
    comment?: string;
    touristId: number;
    tourDate: Date
    creationDate: Date;
    pictures?: string[];
}
