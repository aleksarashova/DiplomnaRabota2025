import { UserInterface } from "../models/User";

export interface RegisterUserDTO {
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    password: string;
    admin_code?: string;
}

export interface UpdateUserDTO {
    user_id: string;
    field: keyof RegisterUserDTO | keyof UserInterface;
    value: string;
}