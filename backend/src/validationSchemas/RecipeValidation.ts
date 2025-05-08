import * as Yup from "yup";
import { getAllCategoryNames } from "../services/CategoryService";

import {Types} from "mongoose";

const { ObjectId } = Types;


export const addRecipeSchema = Yup.object().shape({
    title: Yup.string()
        .required("Recipe title is required.")
        .min(3, "Recipe title is too short.")
        .max(100, "Recipe title is too long.")
        .test(
            "not-blank",
            "Recipe title cannot consist only of spaces or new lines.",
            (value) => !!value && value.trim().length > 0
        ),

    category: Yup.string()
        .required("Recipe category is required.")
        .test(
            "is-valid-category",
            "Invalid recipe category.",
            async (value) => {
                const categoryNames = await getAllCategoryNames();
                return categoryNames.includes(value || "");
            }
        ),

    time_for_cooking: Yup.string()
        .required("Time for cooking is required.")
        .matches(
            /^\d+\s*(minutes|min|hours|hrs)$/i,
            "Time must be in the format 'X minutes' or 'X hours'."
        ),

    servings: Yup.number()
        .typeError("Servings must be a number.")
        .required("Servings are required.")
        .min(1, "Servings must be at least 1.")
        .max(100, "Servings must not exceed 100."),

    products: Yup.mixed()
        .transform((value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return [];
                }
            }
            return value;
        })
        .required("Products are required.")
        .test(
            "is-array",
            "Products must be an array.",
            (value) => Array.isArray(value)
        )
        .test(
            "valid-products",
            "Each product must have a name and a valid quantity (tsp,tbs,tbsp,cup,cups,ml,l,g,kg,oz).",
            (value) => {
                if (!Array.isArray(value)) return false;
                const quantityRegex = /^\d+(\.\d+)?(\s?(tsp|tbs|tbsp|cup|cups|ml|l|g|kg|oz))?$/i;
                return value.every((product) => {
                    if (typeof product !== "string") return false;

                    const parts = product.match(/^(.+)\s\((.+)\)$/);
                    if (!parts || parts.length !== 3) return false;

                    const quantity = parts[2].trim();
                    return quantityRegex.test(quantity);
                });
            }
        ),

    preparation_steps: Yup.mixed()
        .transform((value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return [];
                }
            }
            return value;
        })
        .required("Preparation steps are required.")
        .test(
            "is-array",
            "Preparation steps must be an array.",
            (value) => Array.isArray(value)
        ),
})

export const getRecipeSchema = Yup.object().shape({
    recipeId: Yup.string()
        .required("Recipe id is required.")
        .max(100, "Recipe title is too long.")
        .test(
            "is-objectid",
            "Recipe id is not valid.",
            (value) => ObjectId.isValid(value)
        ),
})