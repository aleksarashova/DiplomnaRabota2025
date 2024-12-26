import express, { Router } from "express";

import {
    login,
    register,
    updateProfile,
    deleteProfile,
    getMyProfileData,
    verify,
    resendEmail, addRecipeToFavourites, removeRecipeFromFavourites, getIsRecipeFavourite
} from "../controllers/UserController";
import {validateRequest} from "../middlewares/RequestValidationMiddleware";
import {profileUpdateSchema, userLoginSchema, userRegisterSchema} from "../validationSchemas/UserValidation";
import {
    checkAuthentication,
    checkCredentialsLogin,
    checkEmailForSendingAVerificationCode,
    checkUniquenessRegister
} from "../middlewares/UserMiddleware";

const router: Router = express.Router();

router.post("/register", validateRequest(userRegisterSchema), checkUniquenessRegister, register);
router.post("/login", validateRequest(userLoginSchema), checkCredentialsLogin, login);
router.post("/update-profile", validateRequest(profileUpdateSchema), checkAuthentication, updateProfile);
router.post("/delete-profile", checkAuthentication, deleteProfile);
router.get("/my-profile-data", checkAuthentication, getMyProfileData);
router.post("/verify-profile", verify);
router.post("/resend-verification-email", checkEmailForSendingAVerificationCode, resendEmail);
router.post("/add-recipe-to-favourites", checkAuthentication, addRecipeToFavourites);
router.post("/remove-recipe-from-favourites", checkAuthentication, removeRecipeFromFavourites);
router.get("/get-is-recipe-favourite", checkAuthentication, getIsRecipeFavourite);

export default router;