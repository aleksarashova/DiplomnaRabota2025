import {HydratedDocument, Types} from "mongoose";
import Recipe, {RecipeInterface} from "../models/Recipe";
import Comment, {CommentInterface} from "../models/Comment";
import User, {UserInterface} from "../models/User";

import {AddRecipeDTO, GetExtendedRecipeDTO, GetRecipeDTO} from "../DTOs/RecipeDTOs";
import { getCategoryIdByName } from "./CategoryService";
import Category, {CategoryInterface} from "../models/Category";
import path from "path";
import {findCommentById} from "./CommentService";
import {GetCommentDTO} from "../DTOs/CommentDTOs";
import {createNotification} from "./NotificationService";
import {checkIdFormat} from "../shared/utils";
import {findUserById} from "./UserService";
import {FilterParams} from "../shared/interfaces";

export const addRecipe = async (recipeData: AddRecipeDTO, userId: string): Promise<HydratedDocument<RecipeInterface>> => {
    try {
        checkIdFormat(userId);

        const categoryId: Types.ObjectId = await getCategoryIdByName(recipeData.category);

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

        const author: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if(!author) {
            throw new Error("User not found when trying to add a recipe.");
        }

        const newRecipe: HydratedDocument<RecipeInterface> = new Recipe(recipe);
        await newRecipe.save();
        author.recipes.push(newRecipe._id);
        await author.save();

        return newRecipe;
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error creating recipe: ", error);
        throw new Error("Unknown error while adding recipe.");
    }
}

export const findRecipeById = async(id: string): Promise<HydratedDocument<RecipeInterface> | null> => {
    try {
        checkIdFormat(id);
        return await Recipe.findOne({_id: id});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error finding recipe in the database with ID: ", id, error);
        throw new Error("Unknown error while searching for a recipe by id.");
    }
}

export const getAllApprovedRecipesData = async (filterParams: FilterParams): Promise<GetRecipeDTO[]> => {
    try {
        const { category, searchText, recipesOf, likedBy, favouritesOf } = filterParams;

        const queryConditions: any = { is_approved: true };

        if (category) {
            const categoryDoc: HydratedDocument<CategoryInterface> | null = await Category.findOne({ name: category });
            if (!categoryDoc) {
                throw new Error(`Category "${category}" not found.`);
            }
            queryConditions.category = categoryDoc._id;
        }

        if (searchText) {
            const author: HydratedDocument<UserInterface> | null = await User.findOne({ username: { $regex: searchText, $options: "i" } });

            queryConditions.$or = [
                { title: { $regex: searchText, $options: "i" } },
                { products: { $elemMatch: { $regex: searchText, $options: "i" } } }
            ];

            if (author) {
                queryConditions.$or.push({ author: author._id });
            }
        }


        if (recipesOf) {
            const user: HydratedDocument<UserInterface> | null = await User.findOne({ username: recipesOf });
            if (!user) {
                throw new Error(`User "${recipesOf}" not found.`);
            }
            queryConditions.author = user._id;
        }

        if (likedBy) {
            const user = await User.findOne({ username: likedBy });
            if (!user) {
                throw new Error(`User "${likedBy}" not found.`);
            }
            queryConditions._id = { $in: user.liked };
        }

        if (favouritesOf) {
            const user: HydratedDocument<UserInterface> | null = await User.findOne({ username: favouritesOf });
            if (!user) {
                throw new Error(`User "${favouritesOf}" not found.`);
            }
            queryConditions._id = { $in: user.favourites };
        }

        const recipesRaw: HydratedDocument<RecipeInterface>[] = await Recipe.find(queryConditions)
            .sort({ date: -1 })
            .populate("author", "username")
            .populate("category", "name");


        const recipes: GetRecipeDTO[] = [];

        for (const recipe of recipesRaw) {
            const comments: HydratedDocument<CommentInterface>[] = await Comment.find({
                _id: { $in: recipe.comments },
            });

            const approvedComments: HydratedDocument<CommentInterface>[] = comments.filter(comment => comment.is_approved);

            const imageName: string | undefined = recipe.image ? path.basename(recipe.image) : undefined;
            const imagePath: string | undefined = imageName ? `/uploads/recipes/${imageName}` : undefined;

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting all approved recipes: ", error);
        throw new Error("Unknown error while getting all approved recipes.");
    }
}

export const getAllUnapprovedRecipesData = async (): Promise<GetRecipeDTO[]> => {
    try {
        const recipesRaw: HydratedDocument<RecipeInterface>[] = await Recipe.find({ is_approved: false })
            .populate("author", "username")
            .populate("category", "name");

        const recipes: GetRecipeDTO[] = [];

        for (const recipe of recipesRaw) {
            const comments: HydratedDocument<CommentInterface>[] = await Comment.find({
                _id: { $in: recipe.comments },
            });

            const approvedComments: HydratedDocument<CommentInterface>[] = comments.filter(comment => comment.is_approved);

            const imageName: string | undefined = recipe.image ? path.basename(recipe.image) : undefined;
            const imagePath: string | undefined = imageName ? `/uploads/recipes/${imageName}` : undefined;

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
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting all unapproved recipes: ", error);
        throw new Error("Unknown error while getting all unapproved recipes.");
    }
}

export const getRecipeData = async (id: string): Promise<GetExtendedRecipeDTO> => {
    try {
        checkIdFormat(id);

        const recipe: HydratedDocument<RecipeInterface> | null = await Recipe.findById(id);
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const author: HydratedDocument<UserInterface> | null = await User.findById(recipe.author).select('username');
        if (!author) {
            throw new Error('Author not found');
        }

        const category: HydratedDocument<CategoryInterface> | null = await Category.findById(recipe.category).select('name');
        if (!category) {
            throw new Error('Category not found');
        }

        const comments: HydratedDocument<CommentInterface>[] = await Comment.find({
            '_id': { $in: recipe.comments },
        });

        const commentsWithAuthors: GetCommentDTO[] = await Promise.all(
            comments
                .filter(comment => comment.is_approved)
                .map(async (comment) => {
                    const commentAuthor: HydratedDocument<UserInterface> | null = await User.findById(comment.author).select('username');
                    const now: Date = new Date();
                    const commentDate: Date = new Date(comment.date);
                    const diffInSeconds: number = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

                    let timeAgo: string = "";

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

                    let parentCommentAuthorUsername: string = "";
                    if(comment.reply_to != null) {

                        const commentReplyTo: HydratedDocument<CommentInterface> | null = await findCommentById(comment.reply_to.toString());
                        if (!commentReplyTo) {
                            throw new Error('Parent comment not found.');
                        }

                        const parentCommentAuthorId: Types.ObjectId = commentReplyTo.author;
                        if (!commentAuthor) {
                            throw new Error('Parent comment author id not found.');
                        }

                        const parentCommentAuthor: HydratedDocument<UserInterface> | null = await findUserById(parentCommentAuthorId.toString());
                        if (!parentCommentAuthor) {
                            throw new Error('Parent comment author not found.');
                        }

                        parentCommentAuthorUsername = parentCommentAuthor.username;
                    }

                    return {
                        id: comment._id,
                        content: comment.content,
                        author: {
                            id: comment.author.toString(),
                            username: commentAuthor ? commentAuthor.username : 'Unknown',
                        },
                        date: timeAgo,
                        is_approved: comment.is_approved,
                        reply_to: parentCommentAuthorUsername,
                    };
                })
        );

        const imageName: string | undefined = recipe.image ? path.basename(recipe.image) : undefined;
        const imagePath: string | undefined = imageName ? `/uploads/recipes/${imageName}` : undefined;

        const recipeData: GetExtendedRecipeDTO = {
            id: recipe._id.toString(),
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
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting the whole data for a single recipe with ID: ", id, error);
        throw new Error("Unknown error while getting the recipe data.");
    }
}

export const getNumberOfUnapprovedRecipes = async(): Promise<number> => {
    try {
        return await Recipe.countDocuments({ is_approved: false });
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting the number of unapproved recipes: ", error);
        throw new Error("Unknown error while getting number of unapproved recipes.");
    }
}

export const updateRecipeApproved = async(recipeId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID "${recipeId}" not found.`);
        }

        recipe.is_approved = true;
        await recipe.save();

        const notificationContent: string = "Your recipe " + recipe.title.toLocaleUpperCase() + " has been approved";
        await createNotification(recipe.author, null, notificationContent, null);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error approving recipe with ID: ", recipeId, error);
        throw new Error("Unknown error while approving recipe.");
    }
}

export const deleteRejectedRecipe = async(recipeId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if (!recipe) {
            throw new Error(`Recipe with ID "${recipeId}" not found.`);
        }

        await Recipe.deleteOne({ _id: recipeId });
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error rejecting recipe with ID: ", recipeId, error);
        throw new Error("Unknown error while rejecting recipe.");
    }
}



