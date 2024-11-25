import express, { Express } from 'express';
import dotenv from 'dotenv';
import connectToDatabase from './db/connect';
import routes from './routes';

dotenv.config();

const app: Express = express();
const port: string | number = process.env.PORT || 7000;

app.use(express.json());

connectToDatabase()
    .then(() => {
        console.log("Connected to the database successfully");
    })
    .catch((error) => {
        console.error("Database connection error", error);
        process.exit(1);
    });

routes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Backend API here");
});
