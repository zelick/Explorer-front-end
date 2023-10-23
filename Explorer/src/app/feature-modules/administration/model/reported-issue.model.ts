export interface ReportedIssue {
    id?: number;
    category: string;
    description: string;
    priority: number;
    time: Date;
    tourId: number;
    touristId: number;
}