export type RecipeData = {
    title: string;
    category: string;
    author: string;
    date: string;
    is_approved: boolean;
    time_for_cooking: string;
    servings: number;
    products: string[];
    preparation_steps: string[];
    likes: number;
    comments: {
        content: string;
        author: {
            id: string;
            username: string;
        };
        date: string;
        is_approved: boolean;
    }[];
    image: string;
}
