import {HydratedDocument} from "mongoose";
import User, {UserInterface} from "../models/User";

import bcrypt from 'bcryptjs';
import {RegisterUserDTO, UpdateUserDTO, UserProfileDTO} from "../DTOs/UserDTOs";
import {RecipeInterface} from "../models/Recipe";
import {findRecipeById} from "./RecipeService";

export const hashPassword = async (password: string) => {
    try {
        const salt: string = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while hashing the password.");
    }
}

export const checkForRightPassword = async(password: string, real_password_hash: string) => {
    try {
        return await bcrypt.compare(password, real_password_hash);
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while checking the password.");
    }
}


export const createUser = async (userData: RegisterUserDTO) => {
    try {
        const passwordHash: string = await hashPassword(userData.password);
        const role: string = userData.admin_code === process.env.ADMIN_CODE ? "admin" : "user";

        const user: UserInterface = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            username: userData.username,
            password_hash: passwordHash,
            role,
            bio: "",
            is_verified: false,
            is_logged_in: false,
            recipes: [],
            favourites: [],
            liked: [],
        };

        const newUser: HydratedDocument<UserInterface> = new User(user);
        await newUser.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while creating user.");
    }
}

export const deleteUser = async (id: string) => {
    try {
        await User.findByIdAndDelete({_id: id});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while deleting user.");
    }
}

export const findUserById = async(id: string) => {
    try {
        return await User.findOne({_id: id});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for a user by id.");
    }
}

export const findUserByEmail = async(email: string) => {
    try {
        return await User.findOne({email: email});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for a user by email.");
    }
}

export const findUserByUsername = async(username: string) => {
    try {
        return await User.findOne({username: username});
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while searching for a user by username.");
    }
}

export const updateUserLoggedIn = async(username: string) => {
    try {
        const user = await findUserByUsername(username);
        if (user) {
            user.is_logged_in = true;
            await user.save();
        } else {
            throw new Error("Could not find user while trying to update it to logged in.");
        }
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while updating the user to logged in.");
    }
}

export const updateUserLoggedOut = async(id: string) => {
    try {
        const user = await findUserById(id);
        if (user) {
            user.is_logged_in = false;
            await user.save();
        } else {
            throw new Error("Could not find user while trying to update it to logged out.");
        }
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while updating the user to logged out.");
    }
}

export const updateUserVerified = async(email: string) => {
    try {
        const user = await findUserByEmail(email);
        if (user) {
            user.is_verified = true;
            await user.save();
        } else {
            throw new Error("Could not find user while trying to update it to verified.");
        }
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while updating the user to verified.");
    }
}

export const updateUserProfile = async(updatedUserData: UpdateUserDTO) => {
    try {
        if (!updatedUserData.user_id) {
            throw new Error("User ID is required.");
        }
        if (!updatedUserData.field || !updatedUserData.value) {
            throw new Error("Both field and value are required for updating the profile.");
        }

        const user = await findUserById(updatedUserData.user_id);
        if(!user) {
            throw new Error("Could not find user while trying to update his profile.");
        }

        switch(updatedUserData.field) {
            case "username":
                user.username = updatedUserData.value;
                break;
            case "email":
                user.email = updatedUserData.value;
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
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while updating the user to logged out.");
    }
}

export const getUserProfileData = async (id: string) => {
    try {
        const user: UserInterface | null = await findUserById(id);

        if (!user) {
            throw new Error('User not found');
        }

        const userData: UserProfileDTO = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            username: user.username,
            password_placeholder: "********",
            bio: user.bio,
        };

        return userData;
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while getting the user profile data.");
    }
}

export const addRecipeToFavouritesList = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        if(user.favourites.includes(recipe._id!)) {
            throw new Error("Recipe already in favourites of this user.")
        }

        user.favourites.push(recipe._id!);
        await user.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding recipe to favourites list.");
    }
}

export const addRecipeToLikedList = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        if(user.liked.includes(recipe._id!)) {
            throw new Error("Recipe already in liked of this user.")
        }

        user.liked.push(recipe._id!);
        await user.save();

        recipe.likes += 1;
        await recipe.save();
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while adding recipe to liked list.");
    }
}

export const removeRecipeFromFavouritesList = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

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
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while removing recipe from favourites list.");
    }
}

export const removeRecipeFromLikedList = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

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
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while removing recipe from favourites list.");
    }
}

export const checkIsRecipeFavourite = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        return user.favourites.includes(recipe._id!);
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while checking is recipe favourite.");
    }
}

export const checkIsRecipeLiked = async (recipeId: string, userId: string) => {
    try {
        const user = await findUserById(userId);

        if (!user) {
            throw new Error('User not found.');
        }

        const recipe = await findRecipeById(recipeId);

        if(!recipe) {
            throw new Error("Recipe not found.");
        }

        return user.liked.includes(recipe._id!);
    } catch(error) {
        if(error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Unknown error while checking is recipe liked.");
    }
}


