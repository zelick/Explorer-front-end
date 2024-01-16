export interface SecureToken {
    id: number;
    userId: number;
    tokenData: string;
    expiryTime: Date;
    isAlreadyUsed: boolean;
}