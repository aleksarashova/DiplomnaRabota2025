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
    getAllUsers, updateUserRole, getOverallRating, getRatings, sendResetPasswordEmail, resetPassword
} from "../controllers/UserController";
import {validateRequest} from "../middlewares/RequestValidationMiddleware";
import {
    profileUpdateSchema,
    userLoginSchema,
    userRegisterSchema,
    userResetPasswordSchema
} from "../validationSchemas/UserValidation";
import {
    checkAuthentication,
    checkCredentialsLogin,
    checkEmailForSendingAVerificationCodeOrResetPasswordLink,
    checkUniquenessRegister
} from "../middlewares/UserMiddleware";
import {uploadProfileImage} from "../middlewares/UploadsMiddleware";

const router: Router = express.Router();

router.get("/my-profile-data", checkAuthentication, getMyProfileData);
router.get("/profile-data", checkAuthentication, getProfileData);
router.get("/get-is-recipe-favourite", checkAuthentication, getIsRecipeFavourite);
router.get("/get-is-recipe-liked", checkAuthentication, getIsRecipeLiked);
router.get("/get-all", checkAuthentication, getAllUsers);
router.get("/get-overall-rating", checkAuthentication, getOverallRating);
router.get("/get-ratings", checkAuthentication, getRatings);

router.post("/register",
    uploadProfileImage.single("image"),
    validateRequest(userRegisterSchema),
    checkUniquenessRegister,
    register
);
router.post("/login", validateRequest(userLoginSchema), checkCredentialsLogin, login);
router.post("/resend-verification-email", checkEmailForSendingAVerificationCodeOrResetPasswordLink, resendVerificationEmail);
router.post("/send-reset-password-email", checkEmailForSendingAVerificationCodeOrResetPasswordLink, sendResetPasswordEmail);
router.post("/add-recipe-to-favourites", checkAuthentication, addRecipeToFavourites);
router.post("/add-recipe-to-liked", checkAuthentication, addRecipeToLiked);
router.post("/rate-user", checkAuthentication, rateUser);

router.patch("/update-profile", validateRequest(profileUpdateSchema), checkAuthentication, updateProfile);
router.patch("/edit-profile-picture", uploadProfileImage.single("image"), checkAuthentication, editProfilePicture);
router.patch("/verify-profile", verify);
router.patch("/reset-password", validateRequest(userResetPasswordSchema), resetPassword);
router.patch("/update-role", checkAuthentication, updateUserRole);

router.delete("/delete-profile-picture", checkAuthentication, deleteProfilePicture);
router.delete("/delete-profile", checkAuthentication, deleteProfile);
router.delete("/remove-recipe-from-favourites", checkAuthentication, removeRecipeFromFavourites);
router.delete("/remove-recipe-from-liked", checkAuthentication, removeRecipeFromLiked);

export default router;