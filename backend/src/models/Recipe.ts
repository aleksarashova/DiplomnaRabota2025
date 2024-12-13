import {Schema, Types, Model, model} from "mongoose";

export interface RecipeInterface {
    title: string;
    category: Types.ObjectId;
    author: Types.ObjectId;
    date: Date;
    is_approved: boolean;
    time_for_cooking: string;
    servings: number;
    products: string[];
    preparation_steps: string[];
    likes: number;
    comments: Types.ObjectId[];
    image: string;
}

type RecipeModel = Model<RecipeInterface>;

const RecipeSchema: Schema = new Schema<RecipeInterface, RecipeModel>({
    title: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date },
    is_approved: { type: Boolean },
    time_for_cooking: { type: String },
    servings: { type: Number },
    products: { type: [String] },
    preparation_steps: { type: [String] },
    likes: { type: Number },
    comments: { type: [Schema.Types.ObjectId], ref: "Comment" },
    image: { type: String }
}, {collection: 'recipes'});

const Recipe: RecipeModel = model<RecipeInterface, RecipeModel>('Recipe', RecipeSchema);

export default Recipe;

