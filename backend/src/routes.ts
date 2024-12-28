import express, { Express } from 'express';
import userRoutes from "./routes/UserRoutes";
import categoryRoutes from "./routes/CategoryRoutes";
import recipeRoutes from "./routes/RecipeRoutes";
import commentRoutes from "./routes/CommentRoutes";
import path from "path";

const routes = (app: Express) => {
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/recipes', recipeRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
        setHeaders: (res, path) => {
            res.setHeader('Cache-Control', 'no-store');
        }
    }));

};

export default routes;
