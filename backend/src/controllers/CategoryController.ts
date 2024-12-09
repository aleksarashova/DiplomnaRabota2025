import { Request, Response } from "express";

import { getAllCategoryNames } from "../services/CategoryService";

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