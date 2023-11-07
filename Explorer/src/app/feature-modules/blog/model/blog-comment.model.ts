export interface BlogComment {
    userId: number;
    username?: string;
    creationTime: Date;
    modificationTime?: Date;
    text: string;
}