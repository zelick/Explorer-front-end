export interface Checkpoint{
    id?: number,
    tourId: number,
    orderNumber: number,
    longitude: number,
    latitude: number,
    name: string,
    description: string,
    pictures: string[]
}