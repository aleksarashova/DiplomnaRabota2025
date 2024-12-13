import { Recipe } from "./types";

export const getAllRecipes = async (): Promise<Recipe[]> => {
    const response = await fetch("http://localhost:8000/api/recipes/get-all", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
    }

    return data.recipes;
}
