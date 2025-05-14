import {Request, Response} from "express";
import {ExtendedRequest} from "../shared/interfaces";
import {AddCommentDTO, GetCommentShortDTO} from "../DTOs/CommentDTOs";
import {
    addComment,
    getAllUnapprovedCommentsData,
    getNumberOfUnapprovedComments,
    updateCommentApproved, deleteRejectedComment
} from "../services/CommentService";

export const comment = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { content, recipeId, parentCommentId } = req.body;
        console.log("gotten replyTo:", parentCommentId);

        const newCommentData: AddCommentDTO = {
            user_id: userId,
            content: content,
            recipe_id: recipeId,
            reply_to: parentCommentId
        }

        console.log(newCommentData);

        await addComment(newCommentData);
        res.status(200).json({ message: "Comment added successfully." });
    } catch (error: unknown) {
        console.error("Error during adding comment:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const getNumberOfPendingComments = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const number: number = await getNumberOfUnapprovedComments();
        res.status(200).json(number);
    } catch (error: unknown) {
        console.error("Error during getting number of unapproved comments:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getAllUnapprovedComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const comments: GetCommentShortDTO[] = await getAllUnapprovedCommentsData();
        res.status(200).json({ comments });
    } catch (error: unknown) {
        console.error("Error during trying to get all unapproved comments:", error);

        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

export const approveComment = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const {commentId} = req.body;
        await updateCommentApproved(commentId);
        res.status(200).json("Successfully approved comment.");
    } catch (error: unknown) {
        console.error("Error during approving comment:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const rejectComment = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const {commentId} = req.body;
        await deleteRejectedComment(commentId);
        res.status(200).json("Successfully rejected comment.");
    } catch (error: unknown) {
        console.error("Error during rejecting comment:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}