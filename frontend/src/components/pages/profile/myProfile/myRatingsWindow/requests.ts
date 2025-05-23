import {UserRating} from "./types";

export const getOverallRating = async (accessToken: string, username: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/get-overall-rating?username=${username}`, {
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
        console.error("Error during getting user overall rating:", error);
        throw error;
    }
}

export const getAllRatings = async (accessToken: string, username: string): Promise<UserRating[]> => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/get-ratings?username=${username}`, {
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

        return data.ratings;
    } catch (error) {
        console.error("Error during getting user ratings:", error);
        throw error;
    }
}