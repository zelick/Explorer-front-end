import { Status } from "./checkpoint-request.model";

export interface ObjectRequest {
    id: number,
    mapObjectId: number,
    authorId: number,
    status: Status
}