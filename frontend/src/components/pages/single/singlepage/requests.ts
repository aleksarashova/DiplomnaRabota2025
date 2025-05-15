export const getRecipeDataRequest = async (accessToken: string, recipeId: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}recipes/get-recipe-data?recipeId=${recipeId}`, {
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

        return data;
    } catch (error) {
        console.error("Error during getting recipe data:", error);
        throw error;
    }
}