import express, { Router } from "express";

import {
    login,
    register,
    updateProfile,
    deleteProfile,
    getMyProfileData,
    verify,
    resendVerificationEmail,
    addRecipeToFavourites,
    removeRecipeFromFavourites,
    getIsRecipeFavourite,
    addRecipeToLiked,
    removeRecipeFromLiked,
    getIsRecipeLiked,
    getProfileData,
    editProfilePicture,
    deleteProfilePicture,
    rateUser,
    getAllUsers, updateUserRole, getOverallRating, getRatings, sendResetPasswordEmail
} from "../controllers/UserController";
import {validateRequest} from "../middlewares/RequestValidationMiddleware";
import {profileUpdateSchema, userLoginSchema, userRegisterSchema} from "../validationSchemas/UserValidation";
import {
    checkAuthentication,
    checkCredentialsLogin,
    checkEmailForSendingAVerificationCodeOrResetPasswordLink,
    checkUniquenessRegister
} from "../middlewares/UserMiddleware";
import {uploadProfileImage} from "../middlewares/UploadsMiddleware";

const router: Router = express.Router();

router.post("/register", uploadProfileImage.single("image"), validateRequest(userRegisterSchema), checkUniquenessRegister, register);
router.post("/login", validateRequest(userLoginSchema), checkCredentialsLogin, login);
router.post("/update-profile", validateRequest(profileUpdateSchema), checkAuthentication, updateProfile);
router.post("/edit-profile-picture", uploadProfileImage.single("image"), checkAuthentication, editProfilePicture);
router.post("/delete-profile-picture", checkAuthentication, deleteProfilePicture);
router.post("/delete-profile", checkAuthentication, deleteProfile);
router.get("/my-profile-data", checkAuthentication, getMyProfileData);
router.post("/verify-profile", verify);
router.post("/resend-verification-email", checkEmailForSendingAVerificationCodeOrResetPasswordLink, resendVerificationEmail);
router.post("/send-reset-password-email", checkEmailForSendingAVerificationCodeOrResetPasswordLink, sendResetPasswordEmail);
router.get("/profile-data", checkAuthentication, getProfileData);
router.post("/add-recipe-to-favourites", checkAuthentication, addRecipeToFavourites);
router.post("/remove-recipe-from-favourites", checkAuthentication, removeRecipeFromFavourites);
router.get("/get-is-recipe-favourite", checkAuthentication, getIsRecipeFavourite);
router.post("/add-recipe-to-liked", checkAuthentication, addRecipeToLiked);
router.post("/remove-recipe-from-liked", checkAuthentication, removeRecipeFromLiked);
router.get("/get-is-recipe-liked", checkAuthentication, getIsRecipeLiked);
router.post("/rate-user", checkAuthentication, rateUser);
router.get("/get-all", checkAuthentication, getAllUsers);
router.post("/update-role", checkAuthentication, updateUserRole);
router.get("/get-overall-rating", checkAuthentication, getOverallRating);
router.get("/get-ratings", checkAuthentication, getRatings);

export default router;