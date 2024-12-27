import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import {addRecipeSchema, getRecipeSchema} from "../validationSchemas/RecipeValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import {makeRecipe, getAllRecipes, getRecipe, getAllApprovedRecipes} from "../controllers/RecipeController";


const router: Router = express.Router();

router.get("/get-all", getAllRecipes);
router.get("/get-all-approved", getAllApprovedRecipes);
router.post("/add-recipe", validateRequest(addRecipeSchema), checkAuthentication, makeRecipe);
router.get("/get-recipe-data", validateRequest(getRecipeSchema), checkAuthentication, getRecipe);

export default router;