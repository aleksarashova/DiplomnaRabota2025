import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import {addRecipeSchema, getRecipeSchema} from "../validationSchemas/RecipeValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import {
    makeRecipe,
    getAllRecipes,
    getRecipe,
    getAllApprovedRecipes,
    getNumberOfPendingRecipes
} from "../controllers/RecipeController";

import {uploadRecipeImage} from "../middlewares/UploadsMiddleware";


const router: Router = express.Router();

router.get("/get-all", getAllRecipes);
router.get("/get-all-approved", getAllApprovedRecipes);
router.post("/add-recipe", uploadRecipeImage.single("image"), validateRequest(addRecipeSchema), checkAuthentication, makeRecipe);
router.get("/get-recipe-data", validateRequest(getRecipeSchema), checkAuthentication, getRecipe);
router.get("/number-of-unapproved", checkAuthentication, getNumberOfPendingRecipes);

export default router;