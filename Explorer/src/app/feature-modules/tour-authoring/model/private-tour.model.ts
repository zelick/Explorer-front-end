import { PublicCheckpoint } from "src/app/feature-modules/tour-execution/model/public_checkpoint.model";

export interface PrivateTour{
    id: number;
    touristId: number;
    checkPoints: PublicCheckpoint[];
    name:string; 
}