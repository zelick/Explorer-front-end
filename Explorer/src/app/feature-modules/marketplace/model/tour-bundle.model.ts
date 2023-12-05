import { Tour } from "../../tour-authoring/model/tour.model";

export interface TourBundle {
    id?: number;
    authorId?: number;
    name: string;
    price: number;
    status: TourBundleStatus;
    username?: string;
    tours?: Tour[];
}

export enum TourBundleStatus {
    Draft = 'DRAFT',
    Published = 'PUBLISHED',
    Archived = 'ARCHIVED',
}