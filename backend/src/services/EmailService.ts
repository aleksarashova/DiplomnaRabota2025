import { HydratedDocument } from "mongoose";

import VerificationCode, { VerificationCodeInterface } from "../models/Verification";
import PasswordResetKey, {PasswordResetKeyInterface} from "../models/PasswordReset";

import nodemailer from "nodemailer";

export const findCode = async(code: number) => {
    try {
        return await VerificationCode.findOne({code: code});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the verification code in the database.");
    }
}

export const findKey = async(key: string) => {
    try {
        return await PasswordResetKey.findOne({key: key});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the reset password key in the database.");
    }
}

export const findEmailInVerificationCodes = async(email: string) => {
    try {
        return await VerificationCode.findOne({email: email});
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the email in the database for verification codes.");
    }
}

export const findEmailInPasswordResetKeys = async(email: string) => {
    try {
        return await PasswordResetKey.findOne({email: email});
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the email in the database for password reset keys.");
    }
}

export const deleteRecordInVerificationCodes = async(email: string) => {
    try {
        await VerificationCode.findOneAndDelete({email: email});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting email and code from the database for verification codes.");
    }
}

export const deleteRecordInPasswordResetKeys = async(email: string) => {
    try {
        await PasswordResetKey.findOneAndDelete({email: email});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting email and key from the database for reset password keys.");
    }
}

export const saveRecordInVerificationCodes = async (email: string, code: number) => {
    try {
        const row: VerificationCodeInterface = {
            email: email,
            code: code,
            expire: new Date(Date.now() + 5 * 60 * 1000),
        }

        const newRow: HydratedDocument<VerificationCodeInterface> = new VerificationCode(row);
        await newRow.save();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while trying to save the email and code in the database for verification codes.");
    }
}

export const saveRecordInPasswordResetKeys = async (email: string, key: string) => {
    try {
        const row: PasswordResetKeyInterface = {
            email: email,
            key: key,
            expire: new Date(Date.now() + 5 * 60 * 1000),
        }

        const newRow: HydratedDocument<PasswordResetKeyInterface> = new PasswordResetKey(row);
        await newRow.save();
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while trying to save the email and key in the database for reset password keys.");
    }
}

export const generateVerificationCode = async (): Promise<number> => {
    const min = 100000;
    const max = 999999;

    for (let i = 0; i < 5; i++) {
        const code = Math.floor(Math.random() * (max - min + 1)) + min;
        const existingCode = await findCode(code);
        if (!existingCode) return code;
    }

    throw new Error("Failed to generate a unique verification code after multiple attempts.");
}

export const generatePasswordResetKey = async (): Promise<string> => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const keyLength = 32;

    for (let i = 0; i < 5; i++) {
        let key = "";
        for (let j = 0; j < keyLength; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            key += characters[randomIndex];
        }

        const existingKey = await findKey(key);
        if (!existingKey) return key;
    }

    throw new Error("Failed to generate a unique password reset key after multiple attempts.");
}

const getSMTPConfig = (email: string) => {
    const domain = email.split("@")[1];
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
    }
}

export const sendVerificationEmail = async (email: string) => {
    try {
        const existingRecord = await findEmailInVerificationCodes(email);
        if (existingRecord) {
            await deleteRecordInVerificationCodes(email);
        }

        const verificationCode = await generateVerificationCode();
        await saveRecordInVerificationCodes(email, verificationCode);

        const smtpConfig = getSMTPConfig(email);

        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verification Code",
            text: `Your verification code is: ${verificationCode}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent successfully.");
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while trying to send the email with the code.");
    }
}

export const sendPasswordResetEmail = async (email: string) => {
    try {
        const existingRecord = await findEmailInPasswordResetKeys(email);
        if (existingRecord) {
            await deleteRecordInPasswordResetKeys(email);
        }

        const passwordResetKey = await generatePasswordResetKey();
        await saveRecordInPasswordResetKeys(email, passwordResetKey);

        const passwordResetLink = `http://localhost:3000/reset-password?key=${passwordResetKey}`;

        const smtpConfig = getSMTPConfig(email);

        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Link",
            text: `Reset your password here: ${passwordResetLink}`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully.");
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while trying to send the email with the key.");
    }
}

export const validateVerificationCode = async(email: string, code: number): Promise<boolean> => {
    try {
        const existingRecord = await findEmailInVerificationCodes(email);
        if (!existingRecord) {
            throw new Error("Expired verification code.");
        }

        if (existingRecord.code != code) {
            throw new Error("Invalid verification code.");
        }

        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Unknown error while validating the verification code.");
    }
}

export const validatePasswordResetKey = async(key: string): Promise<boolean> => {
    try {
        const existingRecord = await findKey(key);
        if (!existingRecord) {
            throw new Error("Expired password reset key.");
        }

        return true;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Unknown error while validating the password reset key.");
    }
}
