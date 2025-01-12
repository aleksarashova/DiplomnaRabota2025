import { Request, Response } from "express";

import createCategory, {getAllCategoryNames, removeCategory} from "../services/CategoryService";

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categoryNames = await getAllCategoryNames();
        res.status(200).json({ categories: categoryNames });
    } catch (error) {
        console.error("Error during trying to get all categories:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const addNewCategory = async (req: Request, res: Response) => {
    try {
        const {category} = req.body;
        await createCategory(category);
        res.status(200).json("Successfully added new category.");
    } catch (error) {
        console.error("Error during trying to add new category:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const {category} = req.body;
        await removeCategory(category);
        res.status(200).json("Successfully deleted category.");
    } catch (error) {
        console.error("Error during trying to delete category:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}