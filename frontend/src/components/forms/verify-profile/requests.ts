import { VerifyProfileFormData } from "./types";

export const verifyProfile = async (formData: VerifyProfileFormData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}users/verify-profile`, {
            method: "PATCH",
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
        console.error("Error during verifying profile:", error);
        throw error;
    }
}
