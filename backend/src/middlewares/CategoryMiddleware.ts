import {NextFunction, Request, Response} from "express";
import {checkDoesCategoryExist} from "../services/CategoryService";

export const checkUniquenessCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const {category} = req.body;

        if (await checkDoesCategoryExist(category)) {
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