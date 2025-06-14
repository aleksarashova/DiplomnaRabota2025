import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

import {findUserByEmail, findUserByUsername, checkForRightPassword} from "../services/UserService";
import {ExtendedRequest} from "../shared/interfaces";
import {HydratedDocument} from "mongoose";
import {UserInterface} from "../models/User";

export const checkUniquenessRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, username } = req.body;

        const existingEmail: HydratedDocument<UserInterface> | null = await findUserByEmail(email);
        if (existingEmail) {
            res.status(400).json({ message: "Email is already in use. Try another one." });
            return;
        }

        const existingUsername: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if (existingUsername) {
            res.status(400).json({ message: "Username is already in use. Try another one." });
            return;
        }

        next();
    } catch (error: unknown) {
        console.error("Error during checking uniqueness of user:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const checkUniquenessUsernameForEdit = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { field, value } = req.body;

        if(field === "username") {
            const existingUsername: HydratedDocument<UserInterface> | null = await findUserByUsername(value);
            if (existingUsername) {
                res.status(400).json({ message: "Username is already in use. Try another one." });
                return;
            }
        }

        next();
    } catch (error: unknown) {
        console.error("Error during checking uniqueness of username of user:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const checkCredentialsLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password } = req.body;

        const existingUser: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if (!existingUser) {
            res.status(400).json({ message: "No such user. Please register first." });
            return;
        }

        if(!existingUser.is_verified) {
            res.status(400).json({ message: "You should verify your account first." });
            return;
        }

        const isPasswordValid: boolean = await checkForRightPassword(password, existingUser.password_hash);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid password. Please try again." });
            return;
        }

        next();
    } catch (error: unknown) {
        console.error("Error during checking login credentials:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const checkAuthentication = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token: string | undefined = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({message: "No access token found."});
            return;
        }

        const real_access_token_secret: string | undefined = process.env.JWT_SECRET;
        if (real_access_token_secret) {
            const decoded: jwt.JwtPayload = jwt.verify(token, real_access_token_secret) as JwtPayload;

            if (!decoded || !decoded.userId) {
                res.status(401).json({message: "The user is not authenticated."});
                return;
            }

            req.userId = decoded.userId;
        }

        next();
    } catch (error: unknown) {
        console.error("Error during authentication check:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const checkEmailForSendingAVerificationCodeOrResetPasswordLink = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email } = req.body;
        const user: HydratedDocument<UserInterface> | null = await findUserByEmail(email);
        if(!user) {
            res.status(400).json({message: "There is no such user registered with this email."});
            return;
        }

        next();
    } catch (error: unknown) {
        console.error("Error during checking email for sending a verification code:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}
