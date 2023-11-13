export enum Status {
    OnHold = 0,
    Accepted = 1,
    Rejected = 2
  }

export interface CheckpointRequest {
    id: number,
    checkpointId: number,
    authorId: number,
    status: Status
}