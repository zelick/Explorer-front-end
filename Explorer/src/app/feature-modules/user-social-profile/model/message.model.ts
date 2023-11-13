export interface Message {
    id?: number;
    senderId?: number;
    recipientId?: number;
    sentDateTime: Date;
    readDateTime: Date;
    content: string;
    isRead: boolean;
}