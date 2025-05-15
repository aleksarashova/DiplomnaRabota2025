export const getAllCategories = async (): Promise<string[]> => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}categories/get-all-sidebar`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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
