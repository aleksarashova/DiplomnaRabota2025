import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {createUser, findUserByUsername, updateUserLoggedIn} from "../services/UserService";

export const register = async (req: Request, res: Response): Promise<void | any> => {
    try {
        const newUser = await createUser(req.body);

        //const {email} = req.body;
        //await sendVerificationEmail(email);

        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void | any> => {
    const { username } = req.body;
    try {
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