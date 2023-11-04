export interface BlogPost {
    id?: number;
    userId?: number;
    title: string;
    description: string;
    creationDate: Date;
    imageUrls: string[] | null;
    status: BlogPostStatus;
    username?: string;
    userFirstName?: string;
    userLastName?: string;
}

export enum BlogPostStatus {
    Draft = 'DRAFT',
    Published = 'PUBLISHED',
    Closed = 'CLOSED',
    Active = 'ACTIVE',
    Famous = 'FAMOUS',
}