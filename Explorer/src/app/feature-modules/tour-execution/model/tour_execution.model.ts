import { Tour } from "../../tour-authoring/model/tour.model";

export interface TourExecution{
    TouristId: number,
    TourId: number,
    Tour: Tour,
    Start: Date,
    LastActivity: Date,
    ExecutionStatus: ExecutionStatus
}

export enum ExecutionStatus
{
    Completed = "Completed",
    Abandoned = "Abandoned",
    InProgress = "InProgress"
}