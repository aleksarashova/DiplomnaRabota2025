import { AnyObjectSchema } from "yup";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: AnyObjectSchema) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const data = req.method === "GET" ? req.query : req.body;

        await schema.validate(data, { abortEarly: false });

        next();
    } catch (error) {
        const validationErrors = (error as any).inner.map((e: any) => ({
            field: e.path,
            message: e.message,
        }));

        const formattedErrors = validationErrors.map((e: any) => e.message);
        res.status(400).json({ errors: formattedErrors });
    }
}
