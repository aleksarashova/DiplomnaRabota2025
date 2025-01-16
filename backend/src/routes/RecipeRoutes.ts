import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import {addRecipeSchema, getRecipeSchema} from "../validationSchemas/RecipeValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import {
    makeRecipe,
    getAllRecipes,
    getRecipe,
    getAllApprovedRecipes,
    getNumberOfPendingRecipes, getAllUnapprovedRecipes, rejectRecipe, approveRecipe
} from "../controllers/RecipeController";

import {uploadRecipeImage} from "../middlewares/UploadsMiddleware";


const router: Router = express.Router();

router.get("/get-all-approved", getAllApprovedRecipes);
router.get("/get-all-unapproved", checkAuthentication, getAllUnapprovedRecipes);
router.post("/add-recipe", uploadRecipeImage.single("image"), validateRequest(addRecipeSchema), checkAuthentication, makeRecipe);
router.get("/get-recipe-data", validateRequest(getRecipeSchema), checkAuthentication, getRecipe);
router.get("/number-of-unapproved", checkAuthentication, getNumberOfPendingRecipes);
router.post("/approve", checkAuthentication, approveRecipe);
router.post("/reject", checkAuthentication, rejectRecipe);

export default router;