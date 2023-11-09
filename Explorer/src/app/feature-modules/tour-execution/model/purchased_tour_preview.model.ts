import { Equipment } from "../../administration/model/equipment.model";
import { CheckpointPreview } from "../../marketplace/model/checkpoint-preview";
import { TourRatingPreview } from "../../marketplace/model/tour-rating-preview";
import { TourRating } from "../../marketplace/model/tour-rating.model";
import { TourTime } from "../../tour-authoring/model/tourTime.model";

export interface PurchasedTourPreview{
    id: number,
    name: string,
    description: string,
    demandignessLevel: string,
    price: number,
    tags: string[],
    equipment: Equipment[],
    checkpoints: CheckpointPreview[],
    tourRatings: TourRatingPreview[],
    tourTimes: TourTime[]
}