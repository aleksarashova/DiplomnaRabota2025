export const addComment = async (content: string, accessToken: string, recipeId: string):Promise<string> => {
    try {
        const response = await fetch("http://localhost:8000/api/comments/add-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({content, recipeId}),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data.message;
    } catch (error) {
        console.error("Error during adding comment:", error);
        throw error;
    }
}