export enum Role {
    Administrator = 0,
    Author = 1,
    Tourist = 2
}

export interface Account {
    id: number;
    username: string;
    role: Role;
    isActive: boolean;
    email: string;
}