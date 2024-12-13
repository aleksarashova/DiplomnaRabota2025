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
    date: string;
    category: string;
    likes: number;
    comments: number;
    image?: string;
}