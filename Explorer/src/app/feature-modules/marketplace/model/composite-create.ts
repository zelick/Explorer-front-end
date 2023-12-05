export interface CompositeForm {
    id?: number;
    ownerId: number;
    name: string;
    description: string;
    tourIds: number[];
}