import {User} from "./types";

export const getAllUsers = async (accessToken: string): Promise<User[]> => {
    const response = await fetch(`http://localhost:8000/api/users/get-all`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get users.");
    }

    return data.users;
}

export const updateUserRole = async (accessToken: string, userId: string, newRole: string)=> {
    const response = await fetch(`http://localhost:8000/api/users/update-role`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId, newRole })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update user role.");
    }

    return data;
}
