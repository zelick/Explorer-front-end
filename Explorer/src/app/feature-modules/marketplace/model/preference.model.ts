export interface TourPreference {
    id?: number;
    creatorId: number;
    difficulty: string;
    walk: number;
    bike: number;
    car: number;
    boat: number;
    tags: string[];
}