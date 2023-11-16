export interface ReportedIssueNotification{
    id: number;
    description: string;
    creationTime: Date;
    isRead: boolean;
    userId: number;
    reportedIssueId: number;
}