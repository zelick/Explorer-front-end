import { TourRating } from "../../marketplace/model/tour-rating.model";
import { CheckpointPreview } from "./checkpoint-preview";
import { Equipment } from "../../tour-authoring/model/equipment.model";
import { TourTime } from "../../tour-authoring/model/tourTime.model";

export interface TourPreview {
    id?: number;
    name: string;
    description: string;
    demandignessLevel: string;
    price: number;
    tags: string[];
    authorId : number;
    equipment: Equipment[];
    checkpoint: CheckpointPreview;
    tourRating: TourRating[];
    tourTime: TourTime[];
    discount: number;
    salePrice?: number;
    isOnSale: boolean;
}