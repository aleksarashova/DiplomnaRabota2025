import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './db/connect';
import routes from './routes';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 7000;

console.log("Starting server...");

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use(express.json());

const initializeDatabase = async () => {
    try {
        await connectToDatabase();
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

initializeDatabase();

routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Backend API here");
});
