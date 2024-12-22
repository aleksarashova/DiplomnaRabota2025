export interface Recipe {
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