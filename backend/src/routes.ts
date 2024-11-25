import { Express } from 'express';
import userRoutes from "./routes/UserRoutes";

const routes = (app: Express) => {
    app.use('/api/users', userRoutes);
};

export default routes;
