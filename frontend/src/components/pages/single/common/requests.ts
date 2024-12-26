export const addRecipeToFavourites = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/add-recipe-to-favourites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ recipeId }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during adding a recipe to favourites:", error);
        throw error;
    }
}

export const removeRecipeFromFavourites = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/remove-recipe-from-favourites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify( { recipeId } ),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during removing a recipe from favourites:", error);
        throw error;
    }
}