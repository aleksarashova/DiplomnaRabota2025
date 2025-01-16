import {Comment} from "./types";

export const getAllUnapprovedComments = async (accessToken: string): Promise<Comment[]> => {
    const response = await fetch(`http://localhost:8000/api/comments/get-all-unapproved`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to get comments.");
    }

    return data.comments;
}

export const approveComment = async (accessToken: string, commentId: string) => {
    const response = await fetch(`http://localhost:8000/api/comments/approve`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({commentId}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to approve comment.");
    }
}

export const rejectComment = async (accessToken: string, commentId: string) => {
    const response = await fetch(`http://localhost:8000/api/comments/reject`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({commentId}),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to reject comment.");
    }
}