import {HydratedDocument, Types} from "mongoose";
import Recipe, {RecipeInterface} from "../models/Recipe";
import Comment from "../models/Comment";
import User from "../models/User";

import {AddRecipeDTO, GetExtendedRecipeDTO, GetRecipeDTO} from "../DTOs/RecipeDTOs";
import { getCategoryIdByName } from "./CategoryService";
import Category from "../models/Category";
import {findUserById} from "./UserService";
import path from "path";

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
            image: recipeData.image,
        };

        const author = await findUserById(userId);

        if(!author) {
            throw new Error("User not found when trying to add a recipe.");
        }

        const newRecipe: HydratedDocument<RecipeInterface> = new Recipe(recipe);
        await newRecipe.save();
        author.recipes.push(newRecipe._id);
        await author.save();
        return newRecipe;
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding recipe.");
    }
}

export const getAllRecipesData = async (): Promise<GetRecipeDTO[]> => {
    try {
        const recipesRaw = await Recipe.find({ is_approved: true })
            .populate("author", "username")
            .populate("category", "name");

        const recipes: GetRecipeDTO[] = [];

        for (const recipe of recipesRaw) {
            const comments = await Comment.find({
                '_id': { $in: recipe.comments },
            });

            const approvedComments = comments.filter(comment => comment.is_approved);

            recipes.push({
                id: recipe._id.toString(),
                title: recipe.title,
                author: (recipe.author as any)?.username || "Unknown",
                is_approved: recipe.is_approved,
                date: recipe.date.toISOString().split("T")[0],
                category: (recipe.category as any)?.name || "Uncategorized",
                likes: recipe.likes,
                comments: approvedComments.length,
                image: recipe.image || undefined,
            });
        }

        return recipes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting all recipes.");
    }
}

interface FilterParams {
    category?: string;
    searchText?: string;
    username?: string;
}

export const getAllApprovedRecipesData = async (filterParams: FilterParams): Promise<GetRecipeDTO[]> => {
    const { category, searchText, username } = filterParams;

    try {
        const queryConditions: any = { is_approved: true };

        if (category) {
            const categoryDoc = await Category.findOne({ name: category });
            if (!categoryDoc) {
                throw new Error(`Category "${category}" not found.`);
            }
            queryConditions.category = categoryDoc._id;
        }

        if (searchText) {
            queryConditions.title = { $regex: searchText, $options: "i" };
        }

        if (username) {
            const user = await User.findOne({username});
            if (!user) {
                throw new Error(`User "${username}" not found.`);
            }
            queryConditions.author = user._id;
        }

        const recipesRaw = await Recipe.find(queryConditions)
            .populate("author", "username")
            .populate("category", "name");

        const recipes: GetRecipeDTO[] = [];

        for (const recipe of recipesRaw) {
            const comments = await Comment.find({
                _id: { $in: recipe.comments },
            });

            const approvedComments = comments.filter(comment => comment.is_approved);

            const imageName = recipe.image ? path.basename(recipe.image) : undefined;
            const imagePath = imageName ? `/uploads/recipes/${imageName}` : undefined;

            recipes.push({
                id: recipe._id.toString(),
                title: recipe.title,
                author: (recipe.author as any)?.username || "Unknown",
                is_approved: recipe.is_approved,
                date: recipe.date.toISOString().split("T")[0],
                category: (recipe.category as any)?.name || "Uncategorized",
                likes: recipe.likes,
                comments: approvedComments.length,
                image: imagePath,
            });
        }

        return recipes;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting all approved recipes.");
    }
}

export const findRecipeById = async(id: string) => {
    try {
        return await Recipe.findOne({_id: id});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for a recipe by id.");
    }
}

export const getRecipeData = async (id: string): Promise<GetExtendedRecipeDTO> => {
    try {
        const recipe = await Recipe.findById(id)
            .select('title author date category likes comments image time_for_cooking servings products preparation_steps');

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const author = await User.findById(recipe.author).select('username');

        if (!author) {
            throw new Error('Author not found');
        }

        const category = await Category.findById(recipe.category).select('name');

        if (!category) {
            throw new Error('Category not found');
        }

        const comments = await Comment.find({
            '_id': { $in: recipe.comments },
        });

        const commentsWithAuthors = await Promise.all(
            comments
                .filter(comment => comment.is_approved)
                .map(async (comment) => {
                    const commentAuthor = await User.findById(comment.author).select('username');

                    const now = new Date();
                    const commentDate = new Date(comment.date);

                    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

                    let timeAgo = "";

                    if (diffInSeconds < 60) {
                        timeAgo = `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
                    } else if (diffInSeconds < 3600) {
                        const diffInMinutes = Math.floor(diffInSeconds / 60);
                        timeAgo = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
                    } else if (diffInSeconds < 86400) {
                        const diffInHours = Math.floor(diffInSeconds / 3600);
                        timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                    } else if (diffInSeconds < 2592000) {
                        const diffInDays = Math.floor(diffInSeconds / 86400);
                        timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                    } else if (diffInSeconds < 31536000) {
                        const diffInMonths = Math.floor(diffInSeconds / 2592000);
                        timeAgo = `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
                    } else {
                        const diffInYears = Math.floor(diffInSeconds / 31536000);
                        timeAgo = `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
                    }

                    return {
                        content: comment.content,
                        author: {
                            id: comment.author.toString(),
                            username: commentAuthor ? commentAuthor.username : 'Unknown',
                        },
                        date: timeAgo,
                        is_approved: comment.is_approved,
                    };
                })
        );

        const imageName = recipe.image ? path.basename(recipe.image) : undefined;
        const imagePath = imageName ? `/uploads/recipes/${imageName}` : undefined;

        const recipeData: GetExtendedRecipeDTO = {
            id: recipe.id,
            title: recipe.title,
            author: author.username,
            date: recipe.date.toISOString().split('T')[0],
            category: category.name,
            likes: recipe.likes,
            comments_number: commentsWithAuthors.length,
            image: imagePath,
            time_for_cooking: recipe.time_for_cooking,
            servings: recipe.servings,
            products: recipe.products,
            preparation_steps: recipe.preparation_steps,
            comments: commentsWithAuthors,
        };

        return recipeData;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting the recipe data.");
    }
}