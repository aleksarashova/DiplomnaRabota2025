export interface AddRecipeFormData {
    title: string,
    category: string,
    time_for_cooking: string,
    servings: number,
    products: string[],
    preparation_steps: string[],
}