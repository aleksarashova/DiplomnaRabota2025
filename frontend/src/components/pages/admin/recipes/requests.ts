import {Recipe} from "../../../sections/recipes-home/types";

export const getAllUnapprovedRecipes = async (accessToken: string): Promise<Recipe[]> => {
    const response = await fetch(`http://localhost:8000/api/recipes/get-all-unapproved`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get recipes.");
    }

    return data.recipes;
}

export const approveRecipe = async (accessToken: string, recipeId: string) => {
    const response = await fetch(`http://localhost:8000/api/recipes/approve`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({recipeId}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to approve recipe.");
    }
}

export const rejectRecipe = async (accessToken: string, recipeId: string) => {
    const response = await fetch(`http://localhost:8000/api/recipes/reject`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({recipeId}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to reject recipe.");
    }
}