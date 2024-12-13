import { Express } from 'express';
import userRoutes from "./routes/UserRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import recipeRoutes from "./routes/RecipeRoutes";

const routes = (app: Express) => {
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/recipes', recipeRoutes);
};

export default routes;
