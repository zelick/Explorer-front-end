import { User } from "src/app/infrastructure/auth/model/user.model";

export interface Notification{
    id: number;
    description: string;
    creationTime: Date;
    isRead: boolean;
    userId: number;
    user?: User;
    type: number;
    foreignId: number;
}