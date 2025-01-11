import { UserInterface } from "../models/User";
import {Types} from "mongoose";

export interface RegisterUserDTO {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    admin_code?: string;
    image: string;
}

export interface UpdateUserDTO {
    user_id: string;
    field: keyof RegisterUserDTO | keyof UserInterface;
    value: string;
}

export interface UserProfileDTO {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password_placeholder: string;
    bio: string;
    image?: string;
}

export interface Rating {
    raterId: Types.ObjectId;
    rating: number;
}

export interface OtherUserProfileDTO {
    first_name: string;
    last_name: string;
    username: string;
    bio: string;
    image?: string;
    isOwnProfile: boolean;
    ratings: Rating[];
    averageRating: number;
}