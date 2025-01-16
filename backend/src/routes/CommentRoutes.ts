import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import { addCommentSchema } from "../validationSchemas/CommentValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import {comment, getAllUnapprovedComments, getNumberOfPendingComments} from "../controllers/CommentController";

const router: Router = express.Router();

router.post("/add-comment", validateRequest(addCommentSchema), checkAuthentication, comment);
router.get("/number-of-unapproved", checkAuthentication, getNumberOfPendingComments);
router.get("/get-all-unapproved", checkAuthentication, getAllUnapprovedComments);

export default router;