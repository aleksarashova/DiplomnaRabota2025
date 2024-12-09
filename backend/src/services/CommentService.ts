import { AddCommentDTO } from "../DTOs/CommentDTOs";
import Comment, { CommentInterface} from "../models/Comment";
import { findUserById } from "./UserService";

import {HydratedDocument } from "mongoose";

export const addComment = async(commentData: AddCommentDTO) => {
    try {
        const author = await findUserById(commentData.user_id);
        if(!author) {
            throw new Error("User not found when trying to add a comment.");
        }
        const date = new Date();

        const comment: CommentInterface = {
            author: author._id,
            date: date,
            content: commentData.content,
            recipe: author._id,
            is_approved: false,
        }

        const newComment: HydratedDocument<CommentInterface> = new Comment(comment);
        await newComment.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding comment.");
    }
}