import {EditAcc} from "./types";

export const getUserDataRequest = async (accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/my-profile-data", {
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
        console.error("Error during getting profile data:", error);
        throw error;
    }
}

export const deleteAccountRequest = async (accessToken: string) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/delete-profile", {
            method: "POST",
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
        console.error("Error during deleting acc:", error);
        throw error;
    }
}

export const editAccountRequest = async (accessToken: string, formData: EditAcc) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/update-profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during deleting acc:", error);
        throw error;
    }
}