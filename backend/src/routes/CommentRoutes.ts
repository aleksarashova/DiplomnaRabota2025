import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import { addCommentSchema } from "../validationSchemas/CommentValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import { comment } from "../controllers/CommentController";

const router: Router = express.Router();

router.post("/add-comment", validateRequest(addCommentSchema), checkAuthentication, comment);

export default router;