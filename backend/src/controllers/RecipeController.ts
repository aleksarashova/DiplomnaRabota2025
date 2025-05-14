import { Request, Response } from "express";
import {ExtendedRequest} from "../shared/interfaces";
import {
    addRecipe,
    getAllApprovedRecipesData,
    getAllUnapprovedRecipesData,
    getNumberOfUnapprovedRecipes,
    getRecipeData, updateRecipeApproved, deleteRejectedRecipe
} from "../services/RecipeService";
import {GetExtendedRecipeDTO, GetRecipeDTO} from "../DTOs/RecipeDTOs";
import {HydratedDocument} from "mongoose";
import {RecipeInterface} from "../models/Recipe";

export const getAllApprovedRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const category: string | undefined = typeof req.query.category === "string" ? req.query.category : undefined;
        const searchText: string | undefined = typeof req.query.searchText === "string" ? req.query.searchText : undefined;
        const recipesOf: string | undefined = typeof req.query.recipesOf === "string" ? req.query.recipesOf: undefined;
        const likedBy: string | undefined = typeof req.query.likedBy === "string" ? req.query.likedBy: undefined;
        const favouritesOf: string | undefined = typeof req.query.favouritesOf === "string" ? req.query.favouritesOf: undefined;


        const recipes: GetRecipeDTO[] = await getAllApprovedRecipesData({ category, searchText, recipesOf, likedBy, favouritesOf });
        res.status(200).json({ recipes });
    } catch (error: unknown) {
        console.error("Error during trying to get all approved recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const getAllUnapprovedRecipes = async (req: Request, res: Response): Promise<void> => {
    try {
        const recipes: GetRecipeDTO[] = await getAllUnapprovedRecipesData();
        res.status(200).json({ recipes });
    } catch (error: unknown) {
        console.error("Error during trying to get all unapproved recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const makeRecipe = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const imagePath: string | null = req.file?.path || null;

        const products = req.body.products ? JSON.parse(req.body.products) : [];
        const preparation_steps = req.body.preparation_steps ? JSON.parse(req.body.preparation_steps) : [];

        const newRecipeData = {
            ...req.body,
            image: imagePath,
            products,
            preparation_steps,
        };

        const newRecipe: HydratedDocument<RecipeInterface> = await addRecipe(newRecipeData, userId);
        res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
    } catch (error: unknown) {
        console.error("Error during making recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getRecipe = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const recipeId: string = req.query.recipeId as string;
        const recipeData: GetExtendedRecipeDTO = await getRecipeData(recipeId);
        res.status(200).json({ recipe: recipeData });
    } catch (error: unknown) {
        console.error("Error during getting recipe data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getNumberOfPendingRecipes = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const number: number = await getNumberOfUnapprovedRecipes();
        res.status(200).json(number);
    } catch (error: unknown) {
        console.error("Error during getting number of unpproved recipes:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const approveRecipe = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const {recipeId} = req.body;
        await updateRecipeApproved(recipeId);
        res.status(200).json("Successfully approved recipe.");
    } catch (error: unknown) {
        console.error("Error during approving recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const rejectRecipe = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const {recipeId} = req.body;
        await deleteRejectedRecipe(recipeId);
        res.status(200).json("Successfully rejected recipe.");
    } catch (error: unknown) {
        console.error("Error during rejecting recipe:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}