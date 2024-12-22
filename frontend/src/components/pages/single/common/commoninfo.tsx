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

type CommonRecipeInfoProps = {
    recipeData: RecipeData | null;
    onCommentClick: () => void;
};

const CommonRecipeInfo = ({ recipeData, onCommentClick }: CommonRecipeInfoProps) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const navigateTo = useNavigate();

    const handleAddFavourites = () => {
        setIsFavourite((prevState) => !prevState);
    };

    const handleLikeRecipe = () => {
        setIsLiked((prevState) => !prevState);
    };

    return (
        <div className="commonInfoImageWrapper">
            <div className="commonInfoSingle">
                <button className="saveToFavourites" onClick={handleAddFavourites}>
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
                    <button className="leaveLike" onClick={handleLikeRecipe}>
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
            <img src={FoodImage} alt="No photo" className="recipeImageSingle" />
        </div>
    );
}

export default CommonRecipeInfo;