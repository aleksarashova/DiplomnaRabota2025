import { HydratedDocument } from "mongoose";

import VerificationCode, { VerificationCodeInterface } from "../models/Verification";

import nodemailer from "nodemailer";

export const findCode = async(code: number) => {
    try {
        return await VerificationCode.findOne({code: code});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the code in the database.");
    }
}

export const findEmail = async(email: string) => {
    try {
        return await VerificationCode.findOne({email: email});
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for the email in the database.");
    }
}

export const deleteRecord = async(email: string) => {
    try {
        await VerificationCode.findOneAndDelete({email: email});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting email and code from the database.");
    }
}

export const saveRecord = async (email: string, code: number) => {
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
        throw new Error("Unknown error while trying to save the email and code in the database.");
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
        const existingRecord = await findEmail(email);
        if (existingRecord) {
            await deleteRecord(email);
        }

        const verificationCode = await generateVerificationCode();
        await saveRecord(email, verificationCode);

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

export const validateVerificationCode = async(email: string, code: number): Promise<boolean> => {
    try {
        const existingRecord = await findEmail(email);
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
