import {Schema, Model, model} from "mongoose";

export interface CategoryInterface {
    name: string;
}

type CategoryModel = Model<CategoryInterface>;

const CategorySchema: Schema = new Schema<CategoryInterface, CategoryModel>({
    name: { type: String }
}, {collection: 'categories'});

const Category: CategoryModel = model<CategoryInterface, CategoryModel>('Category', CategorySchema);

export default Category;