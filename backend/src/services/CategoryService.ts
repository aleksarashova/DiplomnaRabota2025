import { HydratedDocument, Types } from "mongoose";
import Category, { CategoryInterface } from "../models/Category";

const createCategory = async (name : string) => {
    try {
        const category: HydratedDocument<CategoryInterface> = new Category({
            name: name,
        });

        await category.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding category.");
    }
}

export const getAllCategoryNames = async () => {
    try {
        const categories = await Category.find({}, { name: 1, _id: 0 }); 
        return categories.map((category) => category.name);
    } catch (error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting all category names.");
    }
}

export const getCategoryIdByName = async (name: string) => {
    try {
        const category: HydratedDocument<CategoryInterface> | null = await Category.findOne({ name });

        if (!category) {
            throw new Error("Category not found.");
        }

        return category._id;
    } catch (error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting category by its name.");
    }
}

export default createCategory;
