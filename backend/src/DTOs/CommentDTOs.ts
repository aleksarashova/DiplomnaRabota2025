export interface AddCommentDTO {
    user_id: string;
    content: string;
    recipe_id: string;
    reply_to: string;
}

export interface GetCommentDTO {
    content: string;
    author: {
        id: string;
        username: string;
    };
    date: string;
    is_approved: boolean;
    reply_to: string;
}

export interface GetCommentShortDTO {
    id: string;
    author: string;
    content: string;
}