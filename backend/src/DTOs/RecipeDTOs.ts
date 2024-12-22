import {GetCommentDTO} from "./CommentDTOs";

export interface AddRecipeDTO {
    title: string;
    category: string;
    time_for_cooking: string;
    servings: number;
    products: string[];
    preparation_steps: string[];
}

export interface GetRecipeDTO {
    id: string;
    title: string;
    author: string;
    is_approved: boolean;
    date: string;
    category: string;
    likes: number;
    comments: number;
    image?: string;
}

export interface GetExtendedRecipeDTO {
    id: string;
    title: string;
    author: string;
    date: string;
    category: string;
    likes: number;
    comments_number: number;
    image?: string;
    time_for_cooking: string;
    servings: number;
    products: string[];
    preparation_steps: string[];
    comments: GetCommentDTO[];
}