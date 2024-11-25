import {HydratedDocument} from "mongoose";
import User, {UserInterface} from "../models/User";

import bcrypt from 'bcryptjs';
import {RegisterUserDTO} from "../DTOs/UserDTOs";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while hashing the password.");
    }
}

export const createUser = async (userData: RegisterUserDTO): Promise<void> => {
    try {
        const passwordHash: string = await hashPassword(userData.password);
        const role: string = userData.admin_code === process.env.ADMIN_CODE ? "admin" : "user";

        const user: UserInterface = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            username: userData.username,
            password_hash: passwordHash,
            role,
            bio: "",
            is_verified: false,
            is_logged_in: false,
            recipes: [],
            favourites: [],
            liked: [],
        };

        const newUser: HydratedDocument<UserInterface> = new User(user);
        await newUser.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while creating user.");
    }
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        await User.findByIdAndDelete({_id: id});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting user.");
    }
}