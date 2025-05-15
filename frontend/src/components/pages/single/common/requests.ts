export const getIsRecipeFavourite = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/get-is-recipe-favourite?recipeId=${recipeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data.isFavourite;
    } catch (error) {
        console.error("Error during checking if a recipe is favourite:", error);
        throw error;
    }
}

export const getIsRecipeLiked = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/get-is-recipe-liked?recipeId=${recipeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data.isLiked;
    } catch (error) {
        console.error("Error during checking if a recipe is liked:", error);
        throw error;
    }
}


export const addRecipeToFavourites = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/add-recipe-to-favourites`, {
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
        const response = await fetch(`${process.env.BASE_URL}users/remove-recipe-from-favourites`, {
            method: "DELETE",
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

export const addRecipeToLiked = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/add-recipe-to-liked`, {
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
        console.error("Error during adding a recipe to liked:", error);
        throw error;
    }
}

export const removeRecipeFromLiked = async (recipeId: string, accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/remove-recipe-from-liked`, {
            method: "DELETE",
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
        console.error("Error during removing a recipe from liked:", error);
        throw error;
    }
}