import * as Yup from "yup";
import { getAllCategoryNames } from "../services/CategoryService";

import {Types} from "mongoose";

const { ObjectId } = Types;

export const addRecipeSchema = Yup.object().shape({
    title: Yup.string()
        .required("Recipe title is required.")
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
            /^\d+\s*(minutes|hours)$/i,
            "Time for cooking must be in the format 'X minutes' or 'X hours'."
        ),
    servings: Yup.number()
        .required("Servings are required.")
        .min(1, "Servings must be at least 1.")
        .max(100, "Servings must not exceed 100."),
    products: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string()
                    .required("Product name is required.")
                    .test("not-blank", "Product name cannot consist only of spaces or be empty.", (value) => !!value && value.trim().length > 0),
                quantity: Yup.string()
                    .required("Product quantity is required.")
                    .test("not-blank", "Quantity cannot consist only of spaces or be empty.", (value) => !!value && value.trim().length > 0),
            })
        )
        .min(1, "At least one product is required.")
        .required("Products are required."),
    preparation_steps: Yup.array()
        .of(
            Yup.string()
                .required("Each preparation step must be a valid string.")
                .test(
                    "not-blank",
                    "Preparation step cannot consist only of spaces or be empty.",
                    (value) => !!value && value.trim().length > 0
                )
        )
        .min(1, "At least one preparation step is required.")
        .required("Preparation steps are required."),
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