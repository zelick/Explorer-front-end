import { CompletedEncounter } from "./completedEncounter.model";
export interface Encounter {
    id?: number;
    authorId: number;
    name: string;
    xp:number;
    longitude:number;
    latitude:number;
    status:string,
    type:string,
    locationLongitude?:number,
    locationLatitude?:number,
    image?:string[],
    imageF?:FileList,
    range?:number,
    requiredPeople?:number
    completedEncounter?:CompletedEncounter,
    activeTouristsIds?: number[]
}