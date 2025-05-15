import { LoginFormData } from "./types";

export const loginUser = async (formData: LoginFormData) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0
                ? data.errors[0]
                : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}