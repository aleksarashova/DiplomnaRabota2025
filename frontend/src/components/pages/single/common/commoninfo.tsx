import React, {useEffect, useState} from "react";
import "./common-info.css";

import {Link, useNavigate, useParams} from "react-router-dom";

import FoodImage from "../../../images/altImage.png";

import { FaHeart, FaComment, FaRegComment, FaHourglassHalf, FaRegCalendarAlt } from "react-icons/fa";
import { VscHeartFilled } from "react-icons/vsc";
import { PiForkKnifeFill } from "react-icons/pi";
import { MdOutlineMenuBook } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { ImStarFull } from "react-icons/im";

import {RecipeData} from "../singlepage/types";
import {
    addRecipeToFavourites, addRecipeToLiked,
    getIsRecipeFavourite,
    getIsRecipeLiked,
    removeRecipeFromFavourites,
    removeRecipeFromLiked
} from "./requests";

type CommonRecipeInfoProps = {
    recipeData: RecipeData | null;
    onCommentClick: () => void;
};

const CommonRecipeInfo = ({ recipeData, onCommentClick }: CommonRecipeInfoProps) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const navigateTo = useNavigate();

    const { recipeId } = useParams();

    const getIsRecipeFavouriteAndLiked = async() => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        if(!recipeId) {
            console.error("No recipe found.");
            navigateTo("/");
            return;
        }

        try {
            const isFavouriteRecipe = await getIsRecipeFavourite(recipeId, accessToken);
            const isLikedRecipe = await getIsRecipeLiked(recipeId, accessToken);
            setIsFavourite(isFavouriteRecipe);
            setIsLiked(isLikedRecipe);
        } catch (error) {
            console.error("Failed to check favourite status:", error);
        }
    }

    const handleAddOrRemoveFavourites = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        if(!recipeId) {
            console.error("No recipe found.");
            navigateTo("/");
            return;
        }

        setIsFavourite((prevState) => !prevState);

        try {
            if (!isFavourite) {
                await addRecipeToFavourites(recipeId, accessToken);
            } else {
                await removeRecipeFromFavourites(recipeId, accessToken);
            }
        } catch (error) {
            console.error("Failed to update favourites:", error);
            setIsFavourite((prevState) => !prevState);
        }
    }

    const handleAddOrRemoveLiked = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        if(!recipeId) {
            console.error("No recipe found.");
            navigateTo("/");
            return;
        }

        setIsLiked((prevState) => !prevState);

        try {
            if (!isLiked) {
                await addRecipeToLiked(recipeId, accessToken);
            } else {
                await removeRecipeFromLiked(recipeId, accessToken);
            }

            window.location.reload();
        } catch (error) {
            console.error("Failed to update liked:", error);
            setIsFavourite((prevState) => !prevState);
        }
    }

    useEffect(() => {
        getIsRecipeFavouriteAndLiked();
    }, []);

    const recipeImagePath = recipeData?.image ? `http://localhost:8000${recipeData.image}` : FoodImage;
    console.log(recipeImagePath);

    return (
        <div className="commonInfoImageWrapper">
            <div className="commonInfoSingle">
                <button className="saveToFavourites" onClick={handleAddOrRemoveFavourites}>
                    {isFavourite ? (
                        <ImStarFull className="favouritesIconFull" />
                    ) : (
                        <ImStarFull className="favouritesIconEmpty" />
                    )}
                </button>
                <div className="likes-comments-single">
                    <div><FaHeart /> {recipeData?.likes}</div>
                    <div><FaComment /> {recipeData?.comments?.length}</div>
                </div>
                <div className="recipeTitleSingle">{recipeData?.title}</div>
                <div className="recipeAuthorSingle">
                    <Link to="/profile" className="profileLink">
                        <CgProfile className="profileIcon" />
                        {recipeData?.author}
                    </Link>
                </div>
                <div className="recipeDateOfPostingSingle"><MdOutlineMenuBook />{recipeData?.date}</div>
                <div className="recipeCategorySingle"><MdOutlineMenuBook />{recipeData?.category}</div>
                <div className="recipeTimeSingle"><FaHourglassHalf />{recipeData?.time_for_cooking}</div>
                <div className="recipeServingsSingle"><PiForkKnifeFill />{recipeData?.servings}</div>
                <div className="leave-like-comment">
                    <button className="leaveLike" onClick={handleAddOrRemoveLiked}>
                        {isLiked ? (
                            <VscHeartFilled className="likeIconFull" />
                        ) : (
                            <VscHeartFilled className="likeIconEmpty" />
                        )}
                    </button>
                    <button className="leaveComment" onClick={onCommentClick}>
                        <FaRegComment className="commentIcon" />
                    </button>
                </div>
            </div>
            <img src={recipeImagePath} alt="No photo" className="recipeImageSingle" />
        </div>
    );
}

export default CommonRecipeInfo;