import {Request} from "express";
import {Types} from "mongoose";

export interface ExtendedRequest extends Request {
    userId?: string
}

export interface SMTPInterface {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string | undefined;
        pass: string | undefined;
    };
}

export interface MailOptionsInterface {
    from: string | undefined;
    to: string;
    subject: string;
    text: string;
}

export interface FilterParams {
    category?: string;
    searchText?: string;
    recipesOf?: string;
    likedBy?: string;
    favouritesOf?: string;
}

export interface RatingInterface {
    raterId: Types.ObjectId;
    rating: number;
}