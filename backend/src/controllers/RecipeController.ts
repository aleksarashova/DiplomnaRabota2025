import { Request, Response } from "express";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import {addRecipe, getAllApprovedRecipesData, getAllRecipesData, getRecipeData} from "../services/RecipeService";
import {GetExtendedRecipeDTO} from "../DTOs/RecipeDTOs";

export const getAllRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await getAllRecipesData();
        res.status(200).json({ recipes: recipes });
    } catch (error) {
        console.error("Error during trying to get all recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const getAllApprovedRecipes = async (req: Request, res: Response) => {
    try {
        const category = typeof req.query.category === "string" ? req.query.category : undefined;
        const searchText = typeof req.query.searchText === "string" ? req.query.searchText : undefined;

        const recipes = await getAllApprovedRecipesData({ category, searchText });
        res.status(200).json({ recipes });
    } catch (error) {
        console.error("Error during trying to get all approved recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const makeRecipe = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const imagePath = req.file?.path || null;

        const newRecipeData = {
            ...req.body,
            image: imagePath, 
        };

        const newRecipe = await addRecipe(newRecipeData, userId);
        res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
    } catch (error) {
        console.error("Error during making recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getRecipe = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const recipeId = req.query.recipeId as string;

        const recipeData: GetExtendedRecipeDTO = await getRecipeData(recipeId);
        res.status(200).json({ recipe: recipeData });
    } catch (error) {
        console.error("Error during getting recipe data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}