import {HydratedDocument, Types} from "mongoose";
import Notification, {NotificationInterface} from "../models/Notification";

export const createNotification = async (
    for_user: Types.ObjectId,
    from_user: Types.ObjectId | null,
    content: string,
    isCommentApproved: boolean | null
): Promise<void> => {
    try {
        const now: Date = new Date();

        const notification: Partial<NotificationInterface> = {
            for_user,
            content,
            date: now,
        };

        if (from_user) {
            notification.from_user = from_user;
        }

        if (typeof isCommentApproved === "boolean") {
            notification.is_comment_approved = isCommentApproved;
        }

        const newNotification: HydratedDocument<NotificationInterface> = new Notification(notification);
        await newNotification.save();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error creating new notification: ", error);
        throw new Error("Unknown error while creating a notification.");
    }
}

export const updateNotificationWhenCommentIsApproved = async(
    commentContent: string,
    fromUserId: Types.ObjectId
): Promise<void> => {
    try {
        await Notification.updateOne(
            {
                from_user: fromUserId,
                content: { $regex: commentContent, $options: "i" },
                is_comment_approved: { $exists: true }
            },
            { $set: { is_comment_approved: true } }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error updatiing notification when comment is approved: ", error);
        throw new Error("Unknown error while updating a notfication.");
    }
}