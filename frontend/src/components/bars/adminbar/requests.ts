export const getNumberOfPendingRecipes = async (accessToken: string): Promise<number> => {
    const response = await fetch(`http://localhost:8000/api/recipes/number-of-unapproved`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        const errorMessage =
            data.errors?.length > 0
                ? data.errors[0]
                : data.message || "An unknown error occurred";
        throw new Error(errorMessage);
    }

    return data;
}

export const getNumberOfPendingComments = async (accessToken: string): Promise<number> => {
    const response = await fetch(`http://localhost:8000/api/comments/number-of-unapproved`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();

    if (!response.ok) {
        const errorMessage =
            data.errors?.length > 0
                ? data.errors[0]
                : data.message || "An unknown error occurred";
        throw new Error(errorMessage);
    }

    return data;
}