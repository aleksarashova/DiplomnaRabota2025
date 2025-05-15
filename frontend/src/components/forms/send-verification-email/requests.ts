import { SendVerificationEmailFormData } from "./types";

export const sendVerificationEmail = async (formData: SendVerificationEmailFormData) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}resend-verification-email`, {
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
        console.error("Error during resending verification email:", error);
        throw error;
    }
}
