import { SendResetPasswordEmailFormData } from "./types";

export const sendResetPasswordEmail = async (formData: SendResetPasswordEmailFormData) => {
    try {
        const response = await fetch("http://localhost:8000/api/users/send-reset-password-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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
        console.error("Error during sending reset password email:", error);
        throw error;
    }
}
