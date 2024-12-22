import React, { useState } from "react";
import "./common-info.css";

import { Link } from "react-router-dom";

import FoodImage from "../../../images/altImage.png";

import { FaHeart, FaComment, FaRegComment, FaHourglassHalf, FaRegCalendarAlt } from "react-icons/fa";
import { VscHeartFilled } from "react-icons/vsc";
import { PiForkKnifeFill } from "react-icons/pi";
import { MdOutlineMenuBook } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { ImStarFull } from "react-icons/im";

type CommonRecipeInfoProps = {
    onCommentClick: () => void;
}

const CommonRecipeInfo = ({ onCommentClick } : CommonRecipeInfoProps) => {

    //sus zaqvka do bazata proverqvame dali mu e lubima receptata i dali q e laiknal
    const [isFavourite, setIsFavourite] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleAddFavourites = () => {
        setIsFavourite(prevState => !prevState);
    }

    const handleLikeRecipe = () => {
        setIsLiked(prevState => !prevState);
    }

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
                    <div><FaHeart /> 256</div>
                    <div><FaComment /> 42</div>
                </div>
                <div className="recipeTitleSingle">Recipe Title Example</div>
                <div className="recipeAuthorSingle">
                    <Link to="/profile" className="profileLink">
                        <CgProfile className="profileIcon" /> Aleksa Rashova
                    </Link>
                </div>
                <div className="recipeDateOfPostingSingle"><FaRegCalendarAlt /> 03-12-2024</div>
                <div className="recipeCategorySingle"><MdOutlineMenuBook /> category</div>
                <div className="recipeTimeSingle"><FaHourglassHalf /> 1 hour</div>
                <div className="recipeServingsSingle"><PiForkKnifeFill /> 6 servings</div>
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