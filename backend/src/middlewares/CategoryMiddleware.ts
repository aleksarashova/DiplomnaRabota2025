import {NextFunction, Request, Response} from "express";
import {findCategoryByName} from "../services/CategoryService";

export const checkUniquenessCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {category} = req.body;

        const existingCategory = await findCategoryByName(category);
        if (existingCategory) {
            res.status(400).json({ message: "Category already exists." });
            return;
        }

        next();
    } catch (error) {
        console.error("Error during checking uniqueness of category:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}