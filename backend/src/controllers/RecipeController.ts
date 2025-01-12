import { Request, Response } from "express";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import {
    addRecipe,
    getAllApprovedRecipesData,
    getAllRecipesData,
    getNumberOfUnapprovedRecipes,
    getRecipeData
} from "../services/RecipeService";
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
        const username = typeof req.query.username === "string" ? req.query.username : undefined;


        const recipes = await getAllApprovedRecipesData({ category, searchText, username });
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

        const products = req.body.products ? JSON.parse(req.body.products) : [];
        const preparation_steps = req.body.preparation_steps ? JSON.parse(req.body.preparation_steps) : [];

        const newRecipeData = {
            ...req.body,
            image: imagePath,
            products,
            preparation_steps,
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

export const getNumberOfPendingRecipes = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const number = await getNumberOfUnapprovedRecipes();
        res.status(200).json(number);
    } catch (error) {
        console.error("Error during getting number of unpproved recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}