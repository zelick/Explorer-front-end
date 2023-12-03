import { Encounter } from "./encounter.model";

export interface EncounterExecution {
    encounterId: number,
    encounterDto: Encounter,
    touristId: number,
    touristLatitude: number,
    touristLongitude: number,
    status: string,
    startTime: Date
}