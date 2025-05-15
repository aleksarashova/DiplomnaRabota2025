import { HydratedDocument } from "mongoose";

import VerificationCode, { VerificationCodeInterface } from "../models/Verification";
import PasswordResetKey, {PasswordResetKeyInterface} from "../models/PasswordReset";

import nodemailer from "nodemailer";
import {checkEmailFormat} from "../shared/utils";
import {MailOptionsInterface, SMTPInterface} from "../shared/interfaces";

import dotenv from 'dotenv';
dotenv.config();

export const findCode = async(code: number): Promise<HydratedDocument<VerificationCodeInterface> | null> => {
    try {
        return await VerificationCode.findOne({code: code});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error finding verification code: ", code, " in the database: ", error);
        throw new Error("Unknown error while searching for the verification code in the database.");
    }
}

export const findKey = async(key: string): Promise<HydratedDocument<PasswordResetKeyInterface> | null> => {
    try {
        return await PasswordResetKey.findOne({key: key});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error finding password reset key:  ", key, " in the database: ", error);
        throw new Error("Unknown error while searching for the reset password key in the database.");
    }
}

export const findEmailInVerificationCodes = async(email: string): Promise<HydratedDocument<VerificationCodeInterface> | null> => {
    try {
        checkEmailFormat(email);
        return await VerificationCode.findOne({email: email});
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error finding email:  ", email, " in the verification code records: ", error);
        throw new Error("Unknown error while searching for the email in the database for verification codes.");
    }
}

export const findEmailInPasswordResetKeys = async(email: string): Promise<HydratedDocument<PasswordResetKeyInterface> | null> => {
    try {
        checkEmailFormat(email);
        return await PasswordResetKey.findOne({email: email});
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error finding email:  ", email, " in the password reset keys records: ", error);
        throw new Error("Unknown error while searching for the email in the database for password reset keys.");
    }
}

export const deleteRecordInVerificationCodes = async(email: string): Promise<void> => {
    try {
        checkEmailFormat(email);
        await VerificationCode.findOneAndDelete({email: email});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error deleting record in the verification code records with this email:  ", email, error);
        throw new Error("Unknown error while deleting email and code from the database for verification codes.");
    }
}

export const deleteRecordInPasswordResetKeys = async(key: string): Promise<void> => {
    try {
        await PasswordResetKey.findOneAndDelete({key: key});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error deleting record in the password reset keys records with this key:  ", key, error);
        throw new Error("Unknown error while deleting email and key from the database for reset password keys.");
    }
}

export const saveRecordInVerificationCodes = async (email: string, code: number): Promise<void> => {
    try {
        checkEmailFormat(email);

        const row: VerificationCodeInterface = {
            email: email,
            code: code,
            expire: new Date(Date.now() + 5 * 60 * 1000),
        }

        const newRow: HydratedDocument<VerificationCodeInterface> = new VerificationCode(row);
        await newRow.save();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error creating record in verification codes with email and code:  ", email, code, error);
        throw new Error("Unknown error while trying to save the email and code in the database for verification codes.");
    }
}

export const saveRecordInPasswordResetKeys = async (email: string, key: string): Promise<void> => {
    try {
        checkEmailFormat(email);

        const row: PasswordResetKeyInterface = {
            email: email,
            key: key,
            expire: new Date(Date.now() + 5 * 60 * 1000),
        }

        const newRow: HydratedDocument<PasswordResetKeyInterface> = new PasswordResetKey(row);
        await newRow.save();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error creating record in password reset keys with email and key:  ", email, key, error);
        throw new Error("Unknown error while trying to save the email and key in the database for reset password keys.");
    }
}

export const generateVerificationCode = async (): Promise<number> => {
    const min = 100000;
    const max = 999999;

    for (let i: number = 0; i < 5; i++) {
        const code: number = Math.floor(Math.random() * (max - min + 1)) + min;
        const existingCode: HydratedDocument<VerificationCodeInterface> | null = await findCode(code);
        if (!existingCode) return code;
    }

    throw new Error("Failed to generate a unique verification code after multiple (5) attempts.");
}

export const generatePasswordResetKey = async (): Promise<string> => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const keyLength = 32;

    for (let i: number = 0; i < 5; i++) {
        let key: string = "";
        for (let j: number = 0; j < keyLength; j++) {
            const randomIndex: number = Math.floor(Math.random() * characters.length);
            key += characters[randomIndex];
        }

        const existingKey: HydratedDocument<PasswordResetKeyInterface> | null = await findKey(key);
        if (!existingKey) return key;
    }

    throw new Error("Failed to generate a unique password reset key after multiple (5) attempts.");
}

const getSMTPConfig = (email: string): SMTPInterface => {
    const domain: string = email.split("@")[1];
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);
    console.log(domain);

    return {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };
}

export const sendVerificationEmail = async (email: string): Promise<void> => {
    try {
        const existingRecord: HydratedDocument<VerificationCodeInterface> | null = await findEmailInVerificationCodes(email);
        if (existingRecord) {
            await deleteRecordInVerificationCodes(email);
        }

        const verificationCode: number = await generateVerificationCode();
        await saveRecordInVerificationCodes(email, verificationCode);

        const smtpConfig: SMTPInterface = getSMTPConfig(email);

        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions: MailOptionsInterface = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verification Code",
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error sending verification email to user with email: ", email, error);
        throw new Error("Unknown error while trying to send the email with the code.");
    }
}

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
    try {
        const existingRecord: HydratedDocument<PasswordResetKeyInterface> | null = await findEmailInPasswordResetKeys(email);
        if (existingRecord) {
            await deleteRecordInPasswordResetKeys(email);
        }

        const passwordResetKey: string = await generatePasswordResetKey();
        await saveRecordInPasswordResetKeys(email, passwordResetKey);

        const passwordResetLink: string = `${process.env.BASE_URL}/reset-password?key=${passwordResetKey}`;

        const smtpConfig: SMTPInterface = getSMTPConfig(email);

        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions: MailOptionsInterface = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Link",
            text: `Reset your password here: ${passwordResetLink}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully.");
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error sending reset password email to user with email: ", email, error);
        throw new Error("Unknown error while trying to send the email with the key.");
    }
}

export const validateVerificationCode = async(email: string, code: number): Promise<boolean> => {
    try {
        const existingRecord: HydratedDocument<VerificationCodeInterface> | null = await findEmailInVerificationCodes(email);
        if (!existingRecord) {
            throw new Error("Expired verification code.");
        }

        if (existingRecord.code != code) {
            throw new Error("Invalid verification code.");
        }

        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        console.log("Error validating verification code: ", code, " for user with email: ", email,  error);
        throw new Error("Unknown error while validating the verification code.");
    }
}

export const validatePasswordResetKey = async(key: string): Promise<boolean> => {
    try {
        const existingRecord: HydratedDocument<PasswordResetKeyInterface> | null = await findKey(key);
        if (!existingRecord) {
            throw new Error("Expired password reset key.");
        }

        return true;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error;
        }
        console.log("Error validatiing password reset key: ", key, error);
        throw new Error("Unknown error while validating the password reset key.");
    }
}
