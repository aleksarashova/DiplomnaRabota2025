import { AddCommentDTO } from "../DTOs/CommentDTOs";
import Comment, { CommentInterface} from "../models/Comment";
import { findUserById } from "./UserService";

import {HydratedDocument } from "mongoose";
import {findRecipeById} from "./RecipeService";

export const addComment = async(commentData: AddCommentDTO) => {
    try {
        const author = await findUserById(commentData.user_id);
        if(!author) {
            throw new Error("User not found when trying to add a comment.");
        }
        const recipe = await findRecipeById(commentData.recipe_id);
        if(!recipe) {
            throw new Error("Recipe not found when trying to add a comment.");
        }

        const date = new Date();

        const comment: CommentInterface = {
            author: author._id,
            date: date,
            content: commentData.content,
            recipe: recipe._id,
            is_approved: false,
        }

        const newComment: HydratedDocument<CommentInterface> = new Comment(comment);
        await newComment.save();

        recipe.comments.push(newComment._id);
        await recipe.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding comment.");
    }
}