import { Checkpoint } from "./checkpoint.model";
import { Equipment } from "./equipment.model";
import { PublishedTour } from "./publishedTour.model";
import { TourTime } from "./tourTime.model";

export interface Tour {
    id?: number;
    name: string;
    description: string;
    demandignessLevel: string;
    price: number;
    tags: string[];
    authorId : number;
    status:string;
    equipment: Equipment[];
    checkpoints: Checkpoint[];
    publishedTours: PublishedTour[];
    tourTimes: TourTime[];
}