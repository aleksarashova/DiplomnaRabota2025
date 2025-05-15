export const registerUser = async (formData: FormData) => {
    try {
        const response = await fetch(`${process.env.BASE_URL}users/register`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.errors && data.errors.length > 0 ? data.errors[0] : data.message || "An unknown error occurred";
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
}
