export const getNumberOfPendingRecipes = async (accessToken: string): Promise<number> => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}recipes/number-of-unapproved`, {
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

    if (typeof data === "object" && "number" in data) {
        return data.number;
    }

    if (typeof data === "number") {
        return data;
    }

    throw new Error("Unexpected response format.");
}

export const getNumberOfPendingComments = async (accessToken: string): Promise<number> => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}comments/number-of-unapproved`, {
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

    if (typeof data === "object" && "number" in data) {
        return data.number;
    }

    if (typeof data === "number") {
        return data;
    }

    throw new Error("Unexpected response format.");
}

export const getAllCategoriesForAdmin = async (accessToken: string): Promise<string[]> => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}categories/get-all`, {
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

    return data.categories;
}

export const addCategory = async(category: string, accessToken: string) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}categories/add-new`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({category}),
    });
    const data = await response.json();

    if (!response.ok) {
        const errorMessage =
            data.errors?.length > 0
                ? data.errors[0]
                : data.message || "An unknown error occurred";
        throw new Error(errorMessage);
    }

    return data.categories;
}

export const deleteCategory = async(category: string, accessToken: string) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}categories/delete-category`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({category}),
    });
    const data = await response.json();

    if (!response.ok) {
        const errorMessage =
            data.errors?.length > 0
                ? data.errors[0]
                : data.message || "An unknown error occurred";
        throw new Error(errorMessage);
    }

    return data.categories;
}