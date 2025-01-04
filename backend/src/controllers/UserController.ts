import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
    createUser,
    deleteUser,
    findUserByUsername,
    updateUserLoggedIn,
    updateUserProfile,
    getUserProfileData,
    updateUserVerified,
    addRecipeToFavouritesList,
    removeRecipeFromFavouritesList,
    checkIsRecipeFavourite,
    addRecipeToLikedList, removeRecipeFromLikedList, checkIsRecipeLiked, getOtherUserProfileData
} from "../services/UserService";
import { sendVerificationEmail, validateVerificationCode, deleteRecord } from "../services/EmailService";
import { ExtendedRequest } from "../middlewares/UserMiddleware";
import {OtherUserProfileDTO, UpdateUserDTO, UserProfileDTO} from "../DTOs/UserDTOs";

export const register = async (req: Request, res: Response) => {
    try {
        const imagePath = req.file?.path || null;

        const newUserData = {
            ...req.body,
            image: imagePath,
        };
        const newUser = await createUser(newUserData);

        const {email} = req.body;
        // await sendVerificationEmail(email);

        res.status(201).json({ message: "User registered successfully.", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}


export const verify = async(req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        const shouldItBeVerified = await validateVerificationCode(email, code);

        if (!shouldItBeVerified) {
            res.status(402).json({ message: "Invalid verification code. It may be expired." });
            return;
        }

        await updateUserVerified(email);
        await deleteRecord(email);

        res.status(201).json({ message: "User verified successfully." });
    } catch (error) {
        console.error("Error during verification:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const resendEmail = async(req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await sendVerificationEmail(email);

        res.status(201).json({ message: "Resent email successfully."});
    } catch (error) {
        console.error("Error during resending email:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        const user = await findUserByUsername(username);
        if (user) {
            const accessToken = jwt.sign(
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

            const refreshToken = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET!,
                {
                    expiresIn: process.env.JWT_REFRESH_EXP,
                }
            );

            await updateUserLoggedIn(username);

            res.status(200).json({
                message: "User logged in successfully.",
                accessToken,
                refreshToken,
            });
        } else {
            res.status(400).json({message: "No user is registered with this username. Please register first."});
            return;
        }
    } catch (error) {
        console.error("Error during login:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const updateProfile = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

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
    } catch (error) {
        console.error("Error during updating profile:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const deleteProfile = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        await deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error during deleting profile:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getMyProfileData = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const userData: UserProfileDTO = await getUserProfileData(userId);
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Error during getting profile data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getProfileData = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const username = req.query.username as string;

        const userData: OtherUserProfileDTO = await getOtherUserProfileData(username);
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error("Error during getting other user data:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const addRecipeToFavourites = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await addRecipeToFavouritesList(recipeId, userId);
        res.status(200).json("Successfully added recipe in the user's favourites list.");
    } catch(error) {
        console.error("Error during adding recipe to favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const addRecipeToLiked = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await addRecipeToLikedList(recipeId, userId);
        res.status(200).json("Successfully added recipe in the user's liked list.");
    } catch(error) {
        console.error("Error during adding recipe to liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const removeRecipeFromFavourites = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await removeRecipeFromFavouritesList(recipeId, userId);
        res.status(200).json("Successfully removed recipe from the user's favourites list.");
    } catch(error) {
        console.error("Error during removing recipe from favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const removeRecipeFromLiked = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const { recipeId } = req.body;

        await removeRecipeFromLikedList(recipeId, userId);
        res.status(200).json("Successfully removed recipe from the user's liked list.");
    } catch(error) {
        console.error("Error during removing recipe from liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getIsRecipeFavourite = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const recipeId = req.query.recipeId as string;

        const isFavourite = await checkIsRecipeFavourite(recipeId, userId);
        res.status(200).json({isFavourite: isFavourite});
    } catch(error) {
        console.error("Error during checking is recipe in favourites:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}

export const getIsRecipeLiked = async(req: ExtendedRequest, res:Response) => {
    try {
        const userId = req.userId as string;

        if (!userId) {
            res.status(400).json({ message: "User ID is missing." });
            return;
        }

        const recipeId = req.query.recipeId as string;

        const isLiked = await checkIsRecipeLiked(recipeId, userId);
        res.status(200).json({isLiked: isLiked});
    } catch(error) {
        console.error("Error during checking is recipe in liked:", error);

        if (error instanceof Error) {
            res.status(400).json({message: error.message});
        } else {
            res.status(500).json({message: "Internal server error."});
        }
    }
}