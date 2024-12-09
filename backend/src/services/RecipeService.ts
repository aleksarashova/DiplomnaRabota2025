import {HydratedDocument, Types} from "mongoose";
import Recipe, {RecipeInterface} from "../models/Recipe";

import { AddRecipeDTO } from "../DTOs/RecipeDTOs";
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