export interface Recipe {
    id: string;
    title: string;
    author: string;
    date: string;
    category: string;
    likes: number;
    comments: number;
    image?: string;
}