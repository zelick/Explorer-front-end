import { CheckpointPreview } from "./checkpoint-preview";
import { Equipment } from "../../tour-authoring/model/equipment.model";
import { Checkpoint } from "../../tour-authoring/model/checkpoint.model";


export interface CompositePreview {
    id?: number;
    name: string;
    description: string;
    ownerId : number;
    demandignessLevel: string;
    equipment: Equipment[];
    checkpoints: Checkpoint[];
    totalCount: number;
}