import {Schema, Model, model} from "mongoose";

export interface UserInterface {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password_hash: string;
    bio: string;
    role: string;
    is_verified: boolean;
    is_logged_in: boolean;
    recipes: Schema.Types.ObjectId[];
    favourites: Schema.Types.ObjectId[];
    liked: Schema.Types.ObjectId[];
}

type UserModel = Model<UserInterface>;

const UserSchema: Schema = new Schema<UserInterface, UserModel>({
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String },
    email: { type: String },
    password_hash: { type: String },
    bio: { type: String },
    role: { type: String },
    is_verified: { type: Boolean },
    is_logged_in: { type: Boolean },
    recipes: { type: [Schema.Types.ObjectId], ref: "Recipe" },
    favourites: { type: [Schema.Types.ObjectId], ref: "Recipe" },
    liked: { type: [Schema.Types.ObjectId], ref: "Recipe" }
}, {collection: 'users'});

const User: UserModel = model<UserInterface, UserModel>('User', UserSchema);

export default User;

