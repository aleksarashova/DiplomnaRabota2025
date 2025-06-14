import {HydratedDocument, Types} from "mongoose";
import User, {UserInterface} from "../models/User";

import bcrypt from 'bcryptjs';
import {
    GetAllUsersDTO,
    OtherUserProfileDTO,
    RegisterUserDTO,
    UpdateUserDTO,
    UserProfileDTO, UserRatingDTO
} from "../DTOs/UserDTOs";
import {findRecipeById} from "./RecipeService";
import path from "path";
import {deleteFile} from "./FileService";
import Recipe, {RecipeInterface} from "../models/Recipe";
import Comment, {CommentInterface} from "../models/Comment";
import {findKey, validatePasswordResetKey} from "./EmailService";
import Notification, {NotificationInterface} from "../models/Notification";
import {GetNotificationDTO} from "../DTOs/NotificationDTOs";
import {PasswordResetKeyInterface} from "../models/PasswordReset";
import {createNotification} from "./NotificationService";
import {checkIdFormat, checkEmailFormat} from "../shared/utils";
import {RatingInterface} from "../shared/interfaces";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error hashing password: ", error);
        throw new Error("Unknown error while hashing the password.");
    }
}

export const checkForRightPassword = async(password: string, real_password_hash: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, real_password_hash);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error checking for right password: ", error);
        throw new Error("Unknown error while checking the password.");
    }
}

export const createUser = async (userData: RegisterUserDTO): Promise<void> => {
    try {
        const passwordHash: string = await hashPassword(userData.password);

        const user: UserInterface = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
            password_hash: passwordHash,
            bio: "",
            role: "user",
            is_verified: false,
            recipes: [],
            favourites: [],
            liked: [],
            image: userData.image,
            ratings: [],
        };

        const newUser: HydratedDocument<UserInterface> = new User(user);
        await newUser.save();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error creating user with email: ", userData.email, error);
        throw new Error("Unknown error while creating user.");
    }
}

export const deleteUser = async (id: string): Promise<void> => {
    try {
        checkIdFormat(id);

        const user: HydratedDocument<UserInterface> | null = await User.findById(id);
        if (!user) {
            throw new Error("User not found");
        }

        await Recipe.deleteMany({ author: id });

        await Comment.deleteMany({ author: id });

        await Notification.deleteMany({
            $or: [{for_user: id}, {from_user: id}]
        });

        await User.updateMany(
            { "ratings.raterId": id },
            { $pull: { ratings: { raterId: id } } }
        );

        if(user.image) {
            await deleteFile(user.image);
        }
        await user.deleteOne();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error deleting user: ", error);
        throw new Error("Unknown error while deleting user.");
    }
}

export const findUserById = async(id: string): Promise<HydratedDocument<UserInterface> | null> => {
    try {
        checkIdFormat(id);

        return await User.findOne({_id: id});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error finding user by id: ", error);
        throw new Error("Unknown error while searching for a user by id.");
    }
}

export const findUserByEmail = async(email: string): Promise<HydratedDocument<UserInterface> | null> => {
    try {
        checkEmailFormat(email);

        return await User.findOne({email: email});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error finding user by email: ", error);
        throw new Error("Unknown error while searching for a user by email.");
    }
}

export const findUserByUsername = async(username: string): Promise<HydratedDocument<UserInterface> | null> => {
    try {
        return await User.findOne({username: username});
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error finding user by username: ", error);
        throw new Error("Unknown error while searching for a user by username.");
    }
}

export const updateUserVerified = async(email: string): Promise<void> => {
    try {
        checkEmailFormat(email);

        const user: HydratedDocument<UserInterface> | null = await findUserByEmail(email);
        if(!user) {
            throw new Error("Could not find user while trying to update it to verified.");
        }

        user.is_verified = true;
        await user.save();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error updating user to be verified: ", error);
        throw new Error("Unknown error while updating the user to verified.");
    }
}

export const updateUserProfile = async(updatedUserData: UpdateUserDTO): Promise<void> => {
    try {
        if (!updatedUserData.user_id) {
            throw new Error("User ID is required.");
        }
        if (!updatedUserData.field || !updatedUserData.value) {
            if(updatedUserData.field != "bio") {
                throw new Error("Both field and value are required for updating the profile.");
            } else {
                updatedUserData.value = "";
            }
        }

        checkIdFormat(updatedUserData.user_id);

        const user: HydratedDocument<UserInterface> | null = await findUserById(updatedUserData.user_id);
        if(!user) {
            throw new Error("Could not find user while trying to update his profile.");
        }

        switch(updatedUserData.field) {
            case "username":
                user.username = updatedUserData.value;
                break;
            case "password":
                user.password_hash = await hashPassword(updatedUserData.value);
                break;
            case "bio":
                user.bio = updatedUserData.value;
                break;
            default:
                throw new Error("Invalid field name is provided for teh profile update.");
        }

        await user.save();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error updating user profile: ", error);
        throw new Error("Unknown error while updating the user to logged out.");
    }
}

export const getUserProfileData = async (id: string): Promise<UserProfileDTO> => {
    try {
        checkIdFormat(id);

        const user: UserInterface | null = await findUserById(id);
        if (!user) {
            throw new Error('User not found');
        }

        const imageName: string | undefined = user.image ? path.basename(user.image) : undefined;
        const imagePath: string | undefined = imageName ? `/uploads/profile/${imageName}` : undefined;

        const userData: UserProfileDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            password_placeholder: "********",
            bio: user.bio,
            image: imagePath,
        };

        return userData;
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error getting user profile data: ", error);
        throw new Error("Unknown error while getting the user profile data.");
    }
}

export const getOtherUserProfileData = async (username: string, userId: string): Promise<OtherUserProfileDTO> => {
    try {
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if (!user) {
            throw new Error('User not found');
        }

        const profileUserId: string = user._id.toString();
        let isOwnProfile = false;
        if (profileUserId === userId) {
            console.log("User is opening their own profile.");
            isOwnProfile = true;
        }

        const ratings: RatingInterface[] | [] = user.ratings || [];

        const userRating: number | null = ratings.find((ratingObject) => ratingObject.raterId.toString() === userId)?.rating || null;

        const averageRating: number = await getAverageRating(user.username);

        const imageName: string | undefined = user.image ? path.basename(user.image) : undefined;
        const imagePath: string | undefined = imageName ? `/uploads/profile/${imageName}` : undefined;

        const userData: OtherUserProfileDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            bio: user.bio,
            image: imagePath,
            isOwnProfile: isOwnProfile,
            currentUserRating: userRating,
            averageRating: averageRating,
        };

        return userData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error getting other user profile data: ", error);
        throw new Error("Unknown error while getting the other user profile data.");
    }
}

export const addRecipeToFavouritesList = async (recipeId: string, userId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if (!recipe) {
            throw new Error("Recipe not found.");
        }

        if(user.favourites.includes(recipe._id!)) {
            throw new Error("Recipe already in favourites of this user.")
        }

        user.favourites.push(recipe._id!);
        await user.save();

        const notificationContent: string = user.username + " added " + recipe.title.toLocaleUpperCase() + " to favourites";
        await createNotification(recipe.author, user._id, notificationContent, null);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error adding recipe to favourites list of user with ID: ", userId, error);
        throw new Error("Unknown error while adding recipe to favourites list.");
    }
}

export const addRecipeToLikedList = async (recipeId: string, userId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if (!recipe) {
            throw new Error("Recipe not found.");
        }

        if(user.liked.includes(recipe._id!)) {
            throw new Error("Recipe already in liked of this user.")
        }

        user.liked.push(recipe._id!);
        await user.save();

        recipe.likes += 1;
        await recipe.save();

        const notificationContent: string = user.username + " liked " + recipe.title.toLocaleUpperCase() + "";
        await createNotification(recipe.author, user._id, notificationContent, null);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error adding recipe to liked list of user with ID: ", userId, error);
        throw new Error("Unknown error while adding recipe to liked list.");
    }
}

export const removeRecipeFromFavouritesList = async (recipeId: string, userId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        if(!user.favourites.includes(recipe._id!)) {
            throw new Error("Recipe is not in favourites of this user.")
        }

        await User.updateOne(
            { _id: user._id },
            { $pull: { favourites: recipe._id } }
        );
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error removing recipe from favourites list of user with ID: ", userId, error);
        throw new Error("Unknown error while removing recipe from favourites list.");
    }
}

export const removeRecipeFromLikedList = async (recipeId: string, userId: string): Promise<void> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        if(!user.liked.includes(recipe._id!)) {
            throw new Error("Recipe is not in liked of this user.")
        }

        await User.updateOne(
            { _id: user._id },
            { $pull: { liked: recipe._id } }
        );

        recipe.likes -= 1;
        await recipe.save();
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error removing recipe from liked list of user with ID: ", userId, error);
        throw new Error("Unknown error while removing recipe from favourites list.");
    }
}

export const checkIsRecipeFavourite = async (recipeId: string, userId: string): Promise<boolean> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        return user.favourites.includes(recipe._id!);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error checking is recipe with ID: ", recipeId, " favourite of user with ID: ", userId, error);
        throw new Error("Unknown error while checking is recipe favourite.");
    }
}

export const checkIsRecipeLiked = async (recipeId: string, userId: string): Promise<boolean> => {
    try {
        checkIdFormat(recipeId);
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const recipe: HydratedDocument<RecipeInterface> | null = await findRecipeById(recipeId);
        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        return user.liked.includes(recipe._id!);
    } catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.error("Error checking is recipe with ID: ", recipeId, " liked by user with ID: ", userId, error);
        throw new Error("Unknown error while checking is recipe liked.");
    }
}

export const updateProfilePicture = async(userId: string, imagePath: string | null): Promise<void> => {
    try {
        checkIdFormat(userId);

        if (!imagePath) {
            throw new Error("Image path is missing.");
        }

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const oldImagePath: string = user.image;
        user.image = imagePath;
        await user.save();

        await deleteFile(oldImagePath);
    }  catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error updating profile picture of user with ID: ", userId, error);
        throw new Error("Unknown error while updating profile picture.");
    }
}

export const removeProfilePicture = async(userId: string): Promise<void> => {
    try {
        checkIdFormat(userId);

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        const oldImagePath: string = user.image;
        user.image = "";
        await user.save();

        await deleteFile(oldImagePath);
    }  catch(error: unknown) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error deleting profile picture of user with ID: ", userId, error);
        throw new Error("Unknown error while updating profile picture.");
    }
}

export const changeUserRating = async (userIdOfRater: string, usernameOfUserBeingRated: string, rating: number): Promise<void> => {
    try {
        checkIdFormat(userIdOfRater);

        const userBeingRated: HydratedDocument<UserInterface> | null = await findUserByUsername(usernameOfUserBeingRated);
        if (!userBeingRated) {
            throw new Error('User not found.');
        }

        const existingRating: RatingInterface | undefined = (userBeingRated.ratings || []).find(
            (r: RatingInterface): boolean => r.raterId.toString() === userIdOfRater
        );
        if (existingRating) {
            existingRating.rating = rating;
            console.log(`Updated rating from user ${userIdOfRater} to ${rating}`);
        } else {
            const raterObjectId: Types.ObjectId = new Types.ObjectId(userIdOfRater);
            userBeingRated.ratings.push({ raterId: raterObjectId, rating });
            console.log(`Added new rating from user ${userIdOfRater} with rating ${rating}`);
        }

        await userBeingRated.save();

        const rater: HydratedDocument<UserInterface> | null = await findUserById(userIdOfRater);
        if(!rater) {
            throw new Error('User not found.');
        }

        const notificationContent: string = rater.username + " rated you with " + rating + " stars";
        await createNotification(userBeingRated._id, rater._id, notificationContent, null);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error changing user rating for user: ", usernameOfUserBeingRated, " with rating: ", rating, error);
        throw new Error("Unknown error while updating rating.");
    }
}

export const changeUserRole = async (userId: string, newRole: string): Promise<void> => {
    try {
        checkIdFormat(userId);

        if(newRole !== "admin" && newRole !== "user") {
            throw new Error("Invalid user role.");
        }

        const user: HydratedDocument<UserInterface> | null = await findUserById(userId);
        if(!user) {
            throw new Error('User not found.');
        }

        user.role = newRole;
        await user.save();

        const notificationContent: string = "With the next login your role will be changed to: " + newRole;
        await createNotification(user._id, null, notificationContent, null);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error changing user role for user with ID: ", userId, " with role: ", newRole, error);
        throw new Error("Unknown error while changing user role.");
    }
}

export const resetUserPassword = async(password: string, key: string): Promise<void> => {
    try {
        const isValidKey: boolean = await validatePasswordResetKey(key);
        if(!isValidKey) {
            throw new Error("Expired password key.");
        }

        const recordInPasswordResetKeys: HydratedDocument<PasswordResetKeyInterface> | null = await findKey(key);
        if(!recordInPasswordResetKeys) {
            throw new Error("No record with this key in the database.");
        }
        const userEmail: string = recordInPasswordResetKeys.email;
        const newHashedPassword: string = await hashPassword(password);

        const user: HydratedDocument<UserInterface> | null = await findUserByEmail(userEmail);
        if(!user) {
            throw new Error("User not found.");
        }

        user.password_hash = newHashedPassword;

        await user.save();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error resetting user password: ", error);
        throw new Error("Unknown error while resetting user's password.");
    }
}

export const deleteUserNotifications = async (notificationIds: string[]): Promise<void> => {
    try {
        notificationIds.map((notificationId: string) => {
            checkIdFormat(notificationId);
        })

        await Notification.deleteMany({ _id: { $in: notificationIds } });
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error deleting user notification: ", error);
        throw new Error("Unknown error while deleting user notifications.");
    }
}

export const getAllUsersData = async (): Promise<GetAllUsersDTO[]> => {
    try {
        const users: HydratedDocument<UserInterface>[] = await User.find({});

        const usersData: GetAllUsersDTO[] = users.map((user: HydratedDocument<UserInterface>) => {
            const imageName: string | undefined = user.image ? path.basename(user.image) : undefined;
            const imagePath: string | undefined = imageName ? `/uploads/profile/${imageName}` : undefined;

            return {
                id: user._id.toString(),
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                image: imagePath || "",
                role: user.role,
            };
        });

        return usersData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting all users from the database: ", error);
        throw new Error("Unknown error while getting all users data.");
    }
}

export const getAverageRating = async (username: string): Promise<number> => {
    try {
        const user: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if(!user) {
            throw new Error("User not found.");
        }

        const ratings: RatingInterface[] = user.ratings || [];

        let averageRating: number = 0;
        let finalRating: number = 0;
        if (ratings.length > 0) {
            const totalRating: number = ratings.reduce((sum: number, ratingObj: RatingInterface) => sum + ratingObj.rating, 0);
            averageRating = totalRating / ratings.length;
            const roundedRating: number = Math.round(averageRating);

            finalRating = Math.min(Math.max(roundedRating, 1), 5);
        }

        return finalRating;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting user rating for user: ", username, error);
        throw new Error("Unknown error while getting overall rating.");
    }
}

export const getUserRatings = async (username: string): Promise<UserRatingDTO[]> => {
    try {
        const user: HydratedDocument<UserInterface> | null = await findUserByUsername(username);
        if (!user) {
            throw new Error("User not found.");
        }

        const rawRatings: RatingInterface[] = user.ratings || [];

        const ratings: UserRatingDTO[] = [];
        for (const rawRating of rawRatings) {
            const raterId: string = rawRating.raterId.toString();
            const raterUser: HydratedDocument<UserInterface> | null = await findUserById(raterId);
            if(!raterUser) {
                throw new Error("Rater is not found as user in the database.");
            }
            const raterName: string = raterUser ? raterUser.username : "Unknown";

            ratings.push({
                rater: raterName,
                rating: rawRating.rating,
            });
        }

        return ratings;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting user ratings for user: ", username, error);
        throw new Error("Unknown error while getting user ratings.");
    }
}

export const getUserNotifications = async (username: string): Promise<GetNotificationDTO[]> => {
    try {
        const user: HydratedDocument<UserInterface> | null = await findUserByUsername(username);

        if (!user) {
            throw new Error("User not found.");
        }

        const rawNotifications: HydratedDocument<NotificationInterface>[] = await Notification
            .find({ for_user: user._id })
            .sort({ createdAt: -1 });

        const notifications: GetNotificationDTO[] = [];
        for (const rawNotification of rawNotifications) {
            let shouldInclude: boolean = true;

            if (rawNotification.related_comment_id) {
                const relatedComment:HydratedDocument<CommentInterface> | null = await Comment.findById(rawNotification.related_comment_id);

                if (!relatedComment || !relatedComment.is_approved) {
                    shouldInclude = false;
                }
            }

            if(shouldInclude) {
                const now: Date = new Date();
                const notificationDate: Date = new Date(rawNotification.date);
                const diffInSeconds: number = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

                let timeAgo: string = "";

                if (diffInSeconds < 60) {
                    timeAgo = `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;
                } else if (diffInSeconds < 3600) {
                    const diffInMinutes: number = Math.floor(diffInSeconds / 60);
                    timeAgo = `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
                } else if (diffInSeconds < 86400) {
                    const diffInHours: number = Math.floor(diffInSeconds / 3600);
                    timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
                } else if (diffInSeconds < 2592000) {
                    const diffInDays: number = Math.floor(diffInSeconds / 86400);
                    timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                } else if (diffInSeconds < 31536000) {
                    const diffInMonths: number = Math.floor(diffInSeconds / 2592000);
                    timeAgo = `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
                } else {
                    const diffInYears: number = Math.floor(diffInSeconds / 31536000);
                    timeAgo = `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
                }

                notifications.push({
                    id: rawNotification._id.toString(),
                    content: rawNotification.content,
                    date: timeAgo,
                });
            }
        }

        return notifications;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        console.log("Error getting user notifications for user: ", username, error);
        throw new Error("Unknown error while getting user notifications.");
    }
}





