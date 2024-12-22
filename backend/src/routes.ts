import { Express } from 'express';
import userRoutes from "./routes/UserRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import recipeRoutes from "./routes/RecipeRoutes";
import commentRoutes from "./routes/CommentRoutes";

const routes = (app: Express) => {
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/comments', commentRoutes);
};

export default routes;
