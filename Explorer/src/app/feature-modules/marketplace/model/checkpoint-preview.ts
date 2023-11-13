export interface CheckpointPreview{
    id?: number,
    tourId: number,
    longitude: number,
    latitude: number,
    name: string,
    description: string,
    pictures: string[],
    requiredTimeInSeconds: number
}