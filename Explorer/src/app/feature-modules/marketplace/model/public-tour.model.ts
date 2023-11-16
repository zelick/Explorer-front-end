import { CheckpointPreview } from "./checkpoint-preview";

export interface PublicTour{
    id?: number,
    authorId: number,
    longitude: number,
    latitude: number,
    name: string,
    description: string,
    tags: string[],
    previewCheckpoints: CheckpointPreview[]
}