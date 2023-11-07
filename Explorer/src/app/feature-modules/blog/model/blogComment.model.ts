export interface BlogComment {
    id?: number;
    blogPostId?: number;
    userId: number;
    username?: string;
    creationTime: Date;
    modificationTime?: Date;
    text: string;
}