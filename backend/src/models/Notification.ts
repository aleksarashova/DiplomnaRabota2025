import {Schema, Types, Model, model} from "mongoose";

export interface NotificationInterface {
    for_user: Types.ObjectId;
    from_user?: Types.ObjectId;
    content: string;
    date: Date;
    related_comment_id?: Types.ObjectId;
}

type NotificationModel = Model<NotificationInterface>;

const NotificationSchema: Schema = new Schema<NotificationInterface, NotificationModel>({
    for_user: { type: Schema.Types.ObjectId, ref: "User" },
    from_user: { type: Schema.Types.ObjectId, ref: "User", required: false},
    content: { type: String },
    date: { type: Date },
    related_comment_id: { type: Schema.Types.ObjectId, ref: "Comment", required: false },
}, {collection: 'notifications', timestamps: true});

const Notification: NotificationModel = model<NotificationInterface, NotificationModel>('Notification', NotificationSchema);

export default Notification;

