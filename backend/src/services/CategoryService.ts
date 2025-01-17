import { HydratedDocument, Types } from "mongoose";
import Category, { CategoryInterface } from "../models/Category";
import Recipe from "../models/Recipe";

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

export const removeCategory = async (name: string) => {
    try {
        const deletedCategory = await Category.findOneAndDelete({ name: name });

        if (!deletedCategory) {
            throw new Error("Category not found.");
        }

        const recipesToDelete = await Recipe.find({ category: deletedCategory._id });

        if (recipesToDelete.length > 0) {
            await Recipe.deleteMany({ category: deletedCategory._id });
            console.log(`${recipesToDelete.length} recipes deleted.`);
        }

        console.log(`Category ${name} deleted successfully.`);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting category.");
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
        throw new Error("Unknown error while getting category id by its name.");
    }
}

export const findCategoryByName = async (name : string) => {
    try {
        const category: HydratedDocument<CategoryInterface> | null = await Category.findOne({ name });
        return category;
    } catch (error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting category by its name.");
    }
}

export default createCategory;
