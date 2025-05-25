import {HydratedDocument, Types} from "mongoose";
import Notification, {NotificationInterface} from "../models/Notification";

export const createNotification = async (
    for_user: Types.ObjectId,
    from_user: Types.ObjectId | null,
    content: string,
    relatedCommentId: Types.ObjectId | null
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

        if (relatedCommentId) {
            notification.related_comment_id = relatedCommentId;
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