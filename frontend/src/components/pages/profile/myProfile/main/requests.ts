import {EditAcc} from "./types";


export const getUserDataRequest = async (accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/my-profile-data`, {
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
        const response = await fetch(`${process.env.BASE_URL}users/delete-profile`, {
            method: "DELETE",
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
        const response = await fetch(`${process.env.BASE_URL}users/update-profile`, {
            method: "PATCH",
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

export const editProfilePictureRequest = async (accessToken: string, formData: FormData) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/edit-profile-picture`, {
            method: "PATCH",
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
        console.error("Error during updating profile picture:", error);
        throw error;
    }
}

export const deleteProfilePictureRequest = async (accessToken: string) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/delete-profile-picture`, {
            method: "DELETE",
            headers: {
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
        console.error("Error during deleting profile picture:", error);
        throw error;
    }
}
