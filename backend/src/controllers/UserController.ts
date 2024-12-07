import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
    createUser,
    deleteUser,
    findUserByUsername,
    updateUserLoggedIn,
    updateUserProfile,
    getUserProfileData,
    updateUserVerified
} from "../services/UserService";
import { sendVerificationEmail, validateVerificationCode, deleteRecord } from "../services/EmailService";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import { UpdateUserDTO, UserProfileDTO } from "../DTOs/UserDTOs";

export const register = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const newUser = await createUser(req.body);

        const {email} = req.body;
        await sendVerificationEmail(email);

        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const verify = async(req: Request, res: Response): Promise<void | any> => {
    try {
        const { email, code } = req.body;

        const shouldItBeVerified = await validateVerificationCode(email, code);

        if (!shouldItBeVerified) {
            return res.status(402).json({ message: "Invalid verification code. It may be expired." });
        }

        await updateUserVerified(email);
        await deleteRecord(email);

        return res.status(201).json({ message: "User verified successfully." });
    } catch (error) {
        console.error("Error during verification:", error);

        if (error instanceof Error) {
            return res.status(400).json({message: error.message});
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

export const resendEmail = async(req: Request, res: Response): Promise<void | any> => {
    try {
        const { email } = req.body;
        await sendVerificationEmail(email);

        return res.status(201).json({ message: "Resent email successfully."});
    } catch (error) {
        console.error("Error during resending email:", error);

        if (error instanceof Error) {
            return res.status(400).json({message: error.message});
        }

        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const { username } = req.body;
        const user = await findUserByUsername(username);
        if (user) {
            const accessToken = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: process.env.JWT_EXP,
                }
            );

            const refreshToken = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET!,
                {
                    expiresIn: process.env.JWT_REFRESH_EXP,
                }
            );

            await updateUserLoggedIn(username);

            res.status(200).json({
                message: "User logged in successfully.",
                accessToken,
                refreshToken,
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req: ExtendedRequest, res: Response): Promise<void | any> => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const { field, value } = req.body;

        const newUserData: UpdateUserDTO = {
            user_id: userId,
            field: field,
            value: value
        };

        await updateUserProfile(newUserData);
        res.status(200).json({ message: "User updated successfully." });
    } catch (error) {
        console.error("Error during updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteProfile = async (req: ExtendedRequest, res: Response): Promise<void | any> => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        await deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error during deleting profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyProfileData = async (req: ExtendedRequest, res: Response): Promise<void | any> => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        const userData: UserProfileDTO = await getUserProfileData(userId);
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Error during getting profile data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}