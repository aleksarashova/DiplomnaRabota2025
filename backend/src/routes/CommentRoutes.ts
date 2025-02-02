import express, {Router} from "express";

import { validateRequest } from "../middlewares/RequestValidationMiddleware";
import { addCommentSchema } from "../validationSchemas/CommentValidation";
import { checkAuthentication } from "../middlewares/UserMiddleware";
import {
    approveComment,
    comment,
    getAllUnapprovedComments,
    getNumberOfPendingComments, rejectComment
} from "../controllers/CommentController";

const router: Router = express.Router();

router.get("/number-of-unapproved", checkAuthentication, getNumberOfPendingComments);
router.get("/get-all-unapproved", checkAuthentication, getAllUnapprovedComments);

router.post("/add-comment", validateRequest(addCommentSchema), checkAuthentication, comment);

router.patch("/approve", checkAuthentication, approveComment);

router.delete("/reject", checkAuthentication, rejectComment);

export default router;