import express, { Router } from "express";

import { register } from "../controllers/UserController";
import {validateRequest} from "../middlewares/RequestValidationMiddleware";
import {userRegisterSchema} from "../validationSchemas/UserValidation";

const router: Router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), register);
router.post("/login");
router.post("/update-profile");
router.post("/delete-profile");

export default router;