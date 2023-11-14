export interface Message {
    id?: number;
    senderId?: number;
    recipientId?: number;
    senderUsername: string;
    title: string;
    sentDateTime: Date;
    readDateTime: Date;
    content: string;
    isRead: boolean;
}