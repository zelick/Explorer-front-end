import { SocialEncounter } from "./socialEncounter.model";
import { HiddenLocationEncounter } from "./hiddenLocationEncounter.model";
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
    socialEncounter?:SocialEncounter,
    hiddenLocationEncounter?:HiddenLocationEncounter,
    completedEncounter?:CompletedEncounter
}