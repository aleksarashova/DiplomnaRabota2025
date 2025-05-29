import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
    createUser,
    deleteUser,
    findUserByUsername,
    updateUserProfile,
    getUserProfileData,
    updateUserVerified,
    addRecipeToFavouritesList,
    removeRecipeFromFavouritesList,
    checkIsRecipeFavourite,
    addRecipeToLikedList,
    removeRecipeFromLikedList,
    checkIsRecipeLiked,
    getOtherUserProfileData,
    updateProfilePicture,
    removeProfilePicture,
    changeUserRating,
    getAllUsersData,
    changeUserRole,
    getAverageRating,
    getUserRatings,
    resetUserPassword, getUserNotifications, deleteUserNotifications
} from "../services/UserService";
import {
    sendVerificationEmail,
    validateVerificationCode,
    deleteRecordInVerificationCodes,
    sendPasswordResetEmail, deleteRecordInPasswordResetKeys,
} from "../services/EmailService";
import {ExtendedRequest} from "../shared/interfaces";
import {GetAllUsersDTO, OtherUserProfileDTO, UpdateUserDTO, UserProfileDTO, UserRatingDTO} from "../DTOs/UserDTOs";
import {HydratedDocument} from "mongoose";
import {UserInterface} from "../models/User";
import {GetNotificationDTO} from "../DTOs/NotificationDTOs";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const imagePath: string | null = req.file?.path || null;

        const newUserData = {
            ...req.body,
            image: imagePath,
        };
        const newUser: void = await createUser(newUserData);

        const {email} = req.body;
        await sendVerificationEmail(email);

        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error: unknown) {
        console.error("Error during registration:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}


export const verify = async(req: Request, res: Response): Promise<void> => {
    try {
        const { email, code } = req.body;

        const shouldItBeVerified: boolean = await validateVerificationCode(email, code);
        if (!shouldItBeVerified) {
            res.status(402).json({ message: "Invalid verification code. It may be expired." });
            return;
        }

        await updateUserVerified(email);
        await deleteRecordInVerificationCodes(email);

        res.status(201).json({ message: "User verified successfully." });
    } catch (error: unknown) {
        console.error("Error during verification:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const resendVerificationEmail = async(req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        await sendVerificationEmail(email);
        res.status(201).json({ message: "Resent verification email successfully."});
    } catch (error: unknown) {
        console.error("Error during resending verification email:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const sendResetPasswordEmail = async(req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(email);
        res.status(201).json({ message: "Sent reset password email successfully."});
    } catch (error: unknown) {
        console.error("Error during sending reset password email:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const resetPassword = async(req: Request, res: Response): Promise<void> => {
    try {
        const {password, reset_password_key} = req.body;

        await resetUserPassword(password, reset_password_key);
        await deleteRecordInPasswordResetKeys(reset_password_key);

        console.log("Successfully reset password");
        res.status(201).json({message: "Password reset successfully."});
    } catch (error: unknown) {
        console.error("Error during reset password:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.body;
        const user: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if (user) {
            const accessToken: string = jwt.sign(
                {
                    userId: user._id,
                    username: user.username,
                    role: user.role,
                },
                process.env.JWT_SECRET!,
                {
                    expiresIn: process.env.JWT_EXP,
                }
            );

            res.status(200).json({
                message: "User logged in successfully.",
                accessToken,
            });
        } else {
            res.status(400).json({message: "No user is registered with this username. Please register first."});
            return;
        }
    } catch (error: unknown) {
        console.error("Error during login:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const updateProfile = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing" });
            return;
        }

        const { field, value } = req.body;

        const newUserData: UpdateUserDTO = {
            user_id: userId,
            field: field,
            value: value
        };

        await updateUserProfile(newUserData);
        res.status(200).json({ message: "User updated successfully." });
    } catch (error: unknown) {
        console.error("Error during updating profile:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const deleteProfile = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        await deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error: unknown) {
        console.error("Error during deleting profile:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getMyProfileData = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const userData: UserProfileDTO = await getUserProfileData(userId);
        res.status(200).json({ user: userData });
    } catch (error: unknown) {
        console.error("Error during getting profile data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getProfileData = async (req: ExtendedRequest, res: Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const username: string = req.query.username as string;

        const userData: OtherUserProfileDTO = await getOtherUserProfileData(username, userId);
        res.status(200).json({ user: userData });
    } catch (error: unknown) {
        console.error("Error during getting other user data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const addRecipeToFavourites = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await addRecipeToFavouritesList(recipeId, userId);
        res.status(200).json("Successfully added recipe in the user's favourites list.");
    } catch(error: unknown) {
        console.error("Error during adding recipe to favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const addRecipeToLiked = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await addRecipeToLikedList(recipeId, userId);
        res.status(200).json("Successfully added recipe in the user's liked list.");
    } catch(error: unknown) {
        console.error("Error during adding recipe to liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const removeRecipeFromFavourites = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await removeRecipeFromFavouritesList(recipeId, userId);
        res.status(200).json("Successfully removed recipe from the user's favourites list.");
    } catch(error: unknown) {
        console.error("Error during removing recipe from favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const removeRecipeFromLiked = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await removeRecipeFromLikedList(recipeId, userId);
        res.status(200).json("Successfully removed recipe from the user's liked list.");
    } catch(error: unknown) {
        console.error("Error during removing recipe from liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getIsRecipeFavourite = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const recipeId: string = req.query.recipeId as string;

        const isFavourite: boolean = await checkIsRecipeFavourite(recipeId, userId);
        res.status(200).json({isFavourite: isFavourite});
    } catch(error: unknown) {
        console.error("Error during checking is recipe in favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getIsRecipeLiked = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const recipeId: string = req.query.recipeId as string;

        const isLiked: boolean = await checkIsRecipeLiked(recipeId, userId);
        res.status(200).json({isLiked: isLiked});
    } catch(error: unknown) {
        console.error("Error during checking is recipe in liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const editProfilePicture = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const imagePath: string | null = req.file?.path || null;

        await updateProfilePicture(userId, imagePath);
        res.status(200).json("Profile picture updated successfully.");
    } catch(error: unknown) {
        console.error("Error during editing profile picture:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const deleteProfilePicture = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        await removeProfilePicture(userId);
        res.status(200).json("Profile picture deleted successfully.");
    } catch(error: unknown) {
        console.error("Error during deleting profile picture:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const rateUser = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const userId: string = req.userId as string;
        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const rateData = req.body;

        await changeUserRating(userId, rateData.userBeingRated, rateData.rating);
        res.status(200).json("User rated successfully.");
    } catch(error: unknown) {
        console.error("Error during rating author:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getAllUsers = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const users: GetAllUsersDTO[] = await getAllUsersData();
        res.status(200).json({users});
    } catch(error: unknown) {
        console.error("Error during getting all users:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const updateUserRole = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const {userId, newRole} = req.body;
        await changeUserRole(userId, newRole);
        res.status(200).json({ message: "User role updated successfully." });
    } catch(error: unknown) {
        console.error("Error during updating user role:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getOverallRating = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const username: string = req.query.username as string;

        const rating: number = await getAverageRating(username);
        res.status(200).json(rating);
    } catch(error: unknown) {
        console.error("Error during getting overall rating:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getRatings = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const username: string = req.query.username as string;

        const ratings: UserRatingDTO[] = await getUserRatings(username);
        res.status(200).json({ratings: ratings});
    } catch(error: unknown) {
        console.error("Error during getting overall rating:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getNotifications = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const username: string = req.query.username as string;

        const notifications: GetNotificationDTO[] = await getUserNotifications(username);
        res.status(200).json({notifications: notifications});
    } catch(error: unknown) {
        console.error("Error during getting user notifications:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const deleteNotifications = async(req: ExtendedRequest, res:Response): Promise<void> => {
    try {
        const {selectedNotificationIds} = req.body;

        await deleteUserNotifications(selectedNotificationIds);
        res.status(200).json("Successfully deleted noifications.");
    } catch(error: unknown) {
        console.error("Error during deleting user notifications:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}