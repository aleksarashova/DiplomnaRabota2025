import mongoose from "mongoose";

export const checkIdFormat = (id: string):  void => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid mongoose ID format.");
        }
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error during checking id format for ID: ", id);
        throw new Error("Unknown error while checking id format.");
    }
}

export const checkEmailFormat = (email: string): void => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");
        }
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error during checking email format for email: ", email);
        throw new Error("Unknown error while checking email format.");
    }
}
