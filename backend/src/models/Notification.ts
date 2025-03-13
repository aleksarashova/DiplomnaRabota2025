import {Schema, Types, Model, model} from "mongoose";

export interface NotificationInterface {
    for_user: Types.ObjectId;
    content: string;
}

type NotificationModel = Model<NotificationInterface>;

const NotificationSchema: Schema = new Schema<NotificationInterface, NotificationModel>({
    for_user: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
}, {collection: 'notifications'});

const Notification: NotificationModel = model<NotificationInterface, NotificationModel>('Notification', NotificationSchema);

export default Notification;

