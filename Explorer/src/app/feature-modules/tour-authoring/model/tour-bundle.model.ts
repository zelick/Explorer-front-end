import { Tour } from "./tour.model"
export interface TourBundle{
    id?: number,
    name: string,
    price: number,
    authorId: number,
    status: string,
    tours: Tour[]
}