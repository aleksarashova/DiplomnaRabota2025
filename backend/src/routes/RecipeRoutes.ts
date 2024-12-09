import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import { addRecipeSchema } from "../validationSchemas/RecipeValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import { makeRecipe } from "../controllers/RecipeController";


const router: Router = express.Router();

router.post("/add-recipe", validateRequest(addRecipeSchema), checkAuthentication, makeRecipe);

export default router;