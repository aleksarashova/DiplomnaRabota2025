import {UserNotification} from "./types";

export const getAllNotifications = async (accessToken: string, username: string): Promise<UserNotification[]> => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/get-notifications?username=${username}`, {
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

        return data.notifications;
    } catch (error) {
        console.error("Error during getting user notifications:", error);
        throw error;
    }
}

export const deleteNotifications = async (accessToken: string, username: string, selectedNotificationIds: string[]): Promise<UserNotification[]> => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/delete-notifications`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ username, selectedNotificationIds }),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data.notifications;
    } catch (error) {
        console.error("Error during deleting user notifications:", error);
        throw error;
    }
}