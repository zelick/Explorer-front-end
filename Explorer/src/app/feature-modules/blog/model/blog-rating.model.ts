export interface BlogRating {
    userId: number;
    rating: Rating;
}

export enum Rating {
    Upvote = 'Upvote',
    Downvote = 'Downvote'
}