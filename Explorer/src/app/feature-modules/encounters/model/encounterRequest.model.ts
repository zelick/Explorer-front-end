export enum Status {
    OnHold = 0,
    Accepted = 1,
    Rejected = 2
}

export interface EncounterRequest {
    id: number,
    encounterId: number,
    touristId: number,
    status: Status
}