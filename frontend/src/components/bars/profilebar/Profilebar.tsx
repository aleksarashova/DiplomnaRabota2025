import React from "react";
import "./profilebar.css";

import { MdRemoveRedEye } from "react-icons/md";

interface ProfileBarProps {
    setShowMyRecipes: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMyLiked: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMyFavourites: React.Dispatch<React.SetStateAction<boolean>>;
    setShowMyRatings: React.Dispatch<React.SetStateAction<boolean>>;
}

const Profilebar: React.FC<ProfileBarProps> = ({
       setShowMyRecipes,
       setShowMyLiked,
       setShowMyFavourites,
       setShowMyRatings,
   }) => {
    return (
        <div className="profilebar">
            <p className="profilebar-title">MY BOARD</p>
            <div className="profile-view-sections">
                <div
                    onClick={() => setShowMyRecipes(true)}
                    className="view-section"
                >
                    <p className="profile-option">MY RECIPES</p>
                    <p className="show-profile-section">
                        <MdRemoveRedEye className="eye-icon" />
                        show
                    </p>
                </div>
                <div
                    onClick={() => setShowMyLiked(true)}
                    className="view-section"
                >
                    <p className="profile-option">LIKED BY ME</p>
                    <p className="show-profile-section">
                        <MdRemoveRedEye className="eye-icon" />
                        show
                    </p>
                </div>
                <div
                    onClick={() => setShowMyFavourites(true)}
                    className="view-section"
                >
                    <p className="profile-option">MY FAVOURITE RECIPES</p>
                    <p className="show-profile-section">
                        <MdRemoveRedEye className="eye-icon" />
                        show
                    </p>
                </div>
                <div
                    onClick={() => setShowMyRatings(true)}
                    className="view-section"
                >
                    <p className="profile-option">MY RATINGS</p>
                    <p className="show-profile-section">
                        <MdRemoveRedEye className="eye-icon" />
                        show
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profilebar;