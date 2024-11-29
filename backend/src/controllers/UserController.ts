import { Request, Response } from "express";

import {createUser} from "../services/UserService";

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