export interface MapObject{
    id?: number,
    longitude: number,
    latitude: number,
    name: string,
    category: string,
    description: string,
    picture: File | null,
    pictureURL: string
}