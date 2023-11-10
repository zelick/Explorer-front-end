import { BlogRating } from "./blog-rating.model";
import { BlogComment } from "./blog-comment.model";

export interface BlogPost {
    id?: number;
    userId?: number;
    title: string;
    description: string;
    creationDate: Date;
    imageUrls: string[] | null;
    status: BlogPostStatus;
    username?: string;
    ratings?: BlogRating[];
    comments?: BlogComment[];
}

export enum BlogPostStatus {
    Draft = 'DRAFT',
    Published = 'PUBLISHED',
    Closed = 'CLOSED',
    Active = 'ACTIVE',
    Famous = 'FAMOUS',
}