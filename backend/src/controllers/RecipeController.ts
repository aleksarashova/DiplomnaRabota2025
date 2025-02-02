import { Request, Response } from "express";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import {
    addRecipe,
    getAllApprovedRecipesData,
    getAllRecipesData, getAllUnapprovedRecipesData,
    getNumberOfUnapprovedRecipes,
    getRecipeData, updateRecipeApproved, updateRecipeRejected
} from "../services/RecipeService";
import {GetExtendedRecipeDTO} from "../DTOs/RecipeDTOs";

export const getAllApprovedRecipes = async (req: Request, res: Response) => {
    try {
        const category = typeof req.query.category === "string" ? req.query.category : undefined;
        const searchText = typeof req.query.searchText === "string" ? req.query.searchText : undefined;
        const recipesOf = typeof req.query.recipesOf === "string" ? req.query.recipesOf: undefined;
        const likedBy = typeof req.query.likedBy === "string" ? req.query.likedBy: undefined;
        const favouritesOf = typeof req.query.favouritesOf === "string" ? req.query.favouritesOf: undefined;


        const recipes = await getAllApprovedRecipesData({ category, searchText, recipesOf, likedBy, favouritesOf });
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

export const getAllUnapprovedRecipes = async (req: Request, res: Response) => {
    try {
        const recipes = await getAllUnapprovedRecipesData();
        res.status(200).json({ recipes });
    } catch (error) {
        console.error("Error during trying to get all unapproved recipes:", error);

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

export const approveRecipe = async (req: ExtendedRequest, res: Response) => {
    try {
        const {recipeId} = req.body;

        await updateRecipeApproved(recipeId);
        res.status(200).json("Successfully approved recipe.");
    } catch (error) {
        console.error("Error during approving recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const rejectRecipe = async (req: ExtendedRequest, res: Response) => {
    try {
        const {recipeId} = req.body;

        await updateRecipeRejected(recipeId);
        res.status(200).json("Successfully rejected recipe.");
    } catch (error) {
        console.error("Error during rejecting recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}