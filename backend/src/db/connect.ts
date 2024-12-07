import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongo_url : string | "" = process.env.MONGO_URL || "";

const connectToDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect(mongo_url);
        console.log("Successfully connected to database");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export default connectToDatabase;
