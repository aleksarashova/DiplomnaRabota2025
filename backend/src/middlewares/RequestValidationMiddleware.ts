import { Request, Response, NextFunction } from "express";
import { AnyObjectSchema } from "yup";

export const validateRequest = (schema: AnyObjectSchema) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await schema.validate(req.body, { abortEarly: false });

        next();
    } catch (error) {
        const validationErrors = (error as any).inner.map((e: any) => ({
            field: e.path,
            message: e.message
        }));

        const formattedErrors = validationErrors.map((e: any) => e.message);
        res.status(400).json({ errors: formattedErrors });
    }
}