import { Response } from "express";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import { AddCommentDTO } from "../DTOs/CommentDTOs";
import { addComment } from "../services/CommentService";

export const comment = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { content } = req.body;

        const newCommentData: AddCommentDTO = {
            user_id: userId,
            content: content,
        }

        await addComment(newCommentData);
        res.status(200).json({ message: "Comment added successfully." });
    } catch (error) {
        console.error("Error during adding comment:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}