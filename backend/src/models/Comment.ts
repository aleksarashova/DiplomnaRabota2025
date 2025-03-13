import {Schema, Types, Model, model} from "mongoose";

export interface CommentInterface {
    author: Types.ObjectId;
    date: Date;
    content: string;
    is_approved: boolean;
    reply_to: Types.ObjectId | null;
}

type CommentModel = Model<CommentInterface>;

const CommentSchema: Schema = new Schema<CommentInterface, CommentModel>({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    content: { type: String },
    is_approved: { type: Boolean },
    reply_to: {type: Schema.Types.ObjectId, ref: "Comment", default: null }
}, {collection: 'comments'});

const Comment: CommentModel = model<CommentInterface, CommentModel>('Comment', CommentSchema);

export default Comment;

