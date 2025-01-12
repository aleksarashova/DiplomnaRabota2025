export const getAllCategories = async (accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/categories/get-all", {
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
        console.error("Error during getting categories:", error);
        throw error;
    }
}

export const addRecipe = async (formData: FormData, accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/recipes/add-recipe", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during adding a recipe:", error);
        throw error;
    }
}
