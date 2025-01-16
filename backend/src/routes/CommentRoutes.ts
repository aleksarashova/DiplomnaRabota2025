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

router.post("/add-comment", validateRequest(addCommentSchema), checkAuthentication, comment);
router.get("/number-of-unapproved", checkAuthentication, getNumberOfPendingComments);
router.get("/get-all-unapproved", checkAuthentication, getAllUnapprovedComments);
router.post("/approve", checkAuthentication, approveComment);
router.post("/reject", checkAuthentication, rejectComment);

export default router;