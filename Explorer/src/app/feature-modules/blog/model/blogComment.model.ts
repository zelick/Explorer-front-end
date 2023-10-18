export interface BlogComment {
    id?: number;
    blogPostId: number;
    userId: number;
    creationTime: string;
    modificationTime: string;
    text: string;
}