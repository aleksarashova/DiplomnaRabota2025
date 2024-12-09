import { Response } from "express";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import { addRecipe } from "../services/RecipeService";

export const makeRecipe = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const newRecipe = await addRecipe(req.body, userId);
        res.status(201).json({ message: "Recipe created successfully", user: newRecipe });
    } catch (error) {
        console.error("Error during making recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}