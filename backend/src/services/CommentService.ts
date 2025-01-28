import {AddCommentDTO, GetCommentShortDTO} from "../DTOs/CommentDTOs";
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

export const getNumberOfUnapprovedComments = async() => {
    try {
        return await Comment.countDocuments({ is_approved: false });
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting number of unapproved comments.");
    }
}

export const getAllUnapprovedCommentsData = async (): Promise<GetCommentShortDTO[]> => {
    try {
        const commentsRaw = await Comment.find({ is_approved: false })

        const comments: GetCommentShortDTO[] = [];

        for(const comment of commentsRaw) {
            const commentAuthor = await findUserById(comment.author.toString());
            comments.push({
               id: comment._id.toString(),
               author: commentAuthor!.username,
               content: comment.content,
            });
        }


        return comments;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting all unapproved comments.");
    }
}

export const findCommentById = async(id: string) => {
    try {
        return await Comment.findOne({_id: id});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for a comment by id.");
    }
}

export const updateCommentApproved = async(commentId: string) => {
    try {
        const comment = await findCommentById(commentId);

        if (!comment) {
            throw new Error(`Comment with ID "${commentId}" not found.`);
        }

        comment.is_approved = true;
        await comment.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while approving comment.");
    }
}

export const updateCommentRejected = async(commentId: string) => {
    try {
        const comment = await findCommentById(commentId);

        if (!comment) {
            throw new Error(`Comment with ID "${commentId}" not found.`);
        }

        await Comment.deleteOne({ _id: commentId });
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while rejecting comment.");
    }
}