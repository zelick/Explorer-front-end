import { TourPreview } from "../../marketplace/model/tour-preview";
import { PurchasedTourPreview } from "./purchased_tour_preview.model";


export interface TourExecution{
    touristId: number,
    tourId: number,
    tour: PurchasedTourPreview,
    start: Date,
    lastActivity: Date,
    executionStatus: ExecutionStatus
}

export enum ExecutionStatus
{
    Completed = "Completed",
    Abandoned = "Abandoned",
    InProgress = "InProgress"
}