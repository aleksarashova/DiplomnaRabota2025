import { Request, Response, NextFunction } from "express";

import {findUserByEmail, findUserByUsername} from "../services/UserService";

export const checkUniquenessRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | any> => {
    try {
        const { email, username } = req.body;

        const existingEmail = await findUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already in use. Try another one." });
        }

        const existingUsername = await findUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already in use. Try another one." });
        }

        next();
    } catch (error) {
        console.error("Error during uniqueness check:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}