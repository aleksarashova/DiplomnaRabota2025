import {HydratedDocument, Types} from "mongoose";
import Category, { CategoryInterface } from "../models/Category";
import Recipe, {RecipeInterface} from "../models/Recipe";

export const createCategory = async (name : string): Promise<void> => {
    try {
        const category: HydratedDocument<CategoryInterface> = new Category({
            name: name,
        });

        await category.save();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error creating new category with name: ", name, error);
        throw new Error("Unknown error while adding category.");
    }
}

export const removeCategory = async (name: string): Promise<void> => {
    try {
        const deletedCategory: HydratedDocument<CategoryInterface> | null = await Category.findOneAndDelete({ name: name });
        if (!deletedCategory) {
            throw new Error("Category not found.");
        }

        const recipesToDelete: HydratedDocument<RecipeInterface>[] = await Recipe.find({ category: deletedCategory._id });
        if (recipesToDelete.length > 0) {
            await Recipe.deleteMany({ category: deletedCategory._id });
            console.log(`${recipesToDelete.length} recipes deleted because their category (${name}) was deleted.`);
        }

        console.log(`Category ${name} deleted successfully.`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error deleting new category with name: ", name, error);
        throw new Error("Unknown error while deleting category.");
    }
}

export const getAllCategoryNames = async (): Promise<string[]> => {
    try {
        const categories: HydratedDocument<CategoryInterface>[] = await Category.find({}, { name: 1, _id: 0 });
        const categoryNames: string[]= [];
        categories.map((category: HydratedDocument<CategoryInterface>): void => {
            categoryNames.push(category.name);
        })

        return categoryNames;
    } catch (error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting all category names: ", error);
        throw new Error("Unknown error while getting all category names.");
    }
}

export const getCategoryIdByName = async (name: string): Promise<Types.ObjectId> => {
    try {
        const category: HydratedDocument<CategoryInterface> | null = await Category.findOne({ name });
        if (!category) {
            throw new Error("Category not found.");
        }

        return category._id;
    } catch (error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting category id based on its name: ", name, error);
        throw new Error("Unknown error while getting category id by its name.");
    }
}

export const checkDoesCategoryExist = async (name : string): Promise<boolean> => {
    try {
        return await Category.findOne({ name }) != null;
    } catch (error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error checking if category exists based on its name: ", name, error);
        throw new Error("Unknown error while getting category by its name.");
    }
}
