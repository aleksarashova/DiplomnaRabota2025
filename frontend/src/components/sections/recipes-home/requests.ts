import { Recipe } from "./types";

export const getAllApprovedRecipes = async (
    selectedCategory: string | null = null,
    searchText: string = "",
    author: string | null = null,
    likedByAuthor: string | null = null,
    favouritesOfAuthor: string | null = null,
): Promise<Recipe[]> => {
    const queryParams = new URLSearchParams();

    if (selectedCategory) {
        queryParams.append("category", selectedCategory);
    }

    if (searchText.trim() !== "") {
        queryParams.append("searchText", searchText);
    }

    if(author) {
        queryParams.append("recipesOf", author);
    }

    if(likedByAuthor) {
        queryParams.append("likedBy", likedByAuthor);
    }

    if(favouritesOfAuthor) {
        queryParams.append("favouritesOf", favouritesOfAuthor);
    }

    console.log(queryParams);

    const response = await fetch(`${process.env.BASE_URL}recipes/get-all-approved?${queryParams.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get recipes.");
    }

    return data.recipes;
}

