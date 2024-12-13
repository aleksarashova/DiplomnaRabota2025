import {HydratedDocument, Types} from "mongoose";
import Recipe, {RecipeInterface} from "../models/Recipe";

import { AddRecipeDTO, GetRecipeDTO } from "../DTOs/RecipeDTOs";
import { getCategoryIdByName } from "./CategoryService";

export const addRecipe = async (recipeData: AddRecipeDTO, userId: string) => {
    try {
        const categoryId = await getCategoryIdByName(recipeData.category);

        const recipe: RecipeInterface = {
            title: recipeData.title,
            category: categoryId,
            author: new Types.ObjectId(userId),
            date: new Date(),
            is_approved: false,
            time_for_cooking: recipeData.time_for_cooking,
            servings: recipeData.servings,
            products: recipeData.products,
            preparation_steps: recipeData.preparation_steps,
            likes: 0,
            comments: [],
            image: "image"
        };

        const newRecipe: HydratedDocument<RecipeInterface> = new Recipe(recipe);
        await newRecipe.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding recipe.");
    }
}

export const getAllRecipesData = async (): Promise<GetRecipeDTO[]> => {
    try {
        const recipesRaw = await Recipe.find()
            .populate("author", "username")
            .populate("category", "name");

        const recipes: GetRecipeDTO[] = recipesRaw.map(recipe => ({
            id: recipe._id.toString(),
            title: recipe.title,
            author: (recipe.author as any)?.username || "Unknown",
            date: recipe.date.toISOString().split("T")[0],
            category: (recipe.category as any)?.name || "Uncategorized",
            likes: recipe.likes,
            comments: recipe.comments.length,
            image: recipe.image || undefined,
        }));

        return recipes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting all recipes.");
    }
}