import express, { Router } from "express";

import {login, register} from "../controllers/UserController";
import {validateRequest} from "../middlewares/RequestValidationMiddleware";
import {profileUpdateSchema, userLoginSchema, userRegisterSchema} from "../validationSchemas/UserValidation";
import {checkCredentialsLogin, checkUniquenessRegister} from "../middlewares/UserMiddleware";

const router: Router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), checkUniquenessRegister, register);
router.post("/login", validateRequest(userLoginSchema), checkCredentialsLogin, login);
router.post("/update-profile", validateRequest(profileUpdateSchema));
router.post("/delete-profile");

export default router;