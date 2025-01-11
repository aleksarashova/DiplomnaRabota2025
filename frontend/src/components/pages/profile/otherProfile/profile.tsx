import React, {useEffect, useState} from 'react';
import "./profile.css";

import { FaRegStar } from "react-icons/fa6";

import RecipesList from '../../../sections/recipes-home/RecipesList';


import Footer from "../../../sections/footer/Footer";
import Header from "../../../sections/header/Header";
import {validateJWT} from "../../authCheck";
import {useNavigate, useParams} from "react-router-dom";
import {getOtherUserDataRequest, rateUserRequest} from "./requests";
import {OtherUserData} from "./types";
import altImage from "../../../images/altImage.png";
import {FaStar} from "react-icons/fa";

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userData, setUserData] = useState<OtherUserData | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
    const [rating, setRating] = useState<number>(0);

    const navigateTo = useNavigate();

    const { username } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);
            setIsLoggedIn(!!isValid);

            if (isValid) {
                try {
                    await getOtherUserData();
                    if(isOwnProfile) {
                        navigateTo("/myProfile");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigateTo("/login");
            }
        };

        fetchData();
    }, [isOwnProfile]);

    const getOtherUserData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found.');
            navigateTo('/login');
            return;
        }

        try {
            const data = await getOtherUserDataRequest(accessToken, username || "");
            console.log('Backend Response:', data);
            setUserData(data.user);
            setIsOwnProfile(data.user.isOwnProfile);
        } catch (error) {
            console.error('Error fetching user data:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleRating = async (selectedRating: number) => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found.');
            navigateTo('/login');
            return;
        }

        try {
            // const data = await rateUserRequest(accessToken, selectedRating);
            setRating(selectedRating);
        } catch (error) {
            console.error('Error rating the author:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    if (!isLoggedIn) {
        return null;
    }

    const userImagePath = userData?.image ? `http://localhost:8000${userData.image}` : altImage;
    console.log(userImagePath);

    const name = userData?.first_name + " " + userData?.last_name;
    const usernameFull = "@" + userData?.username;

    return (
        <div className="profileWrapper">
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={false}/>
            <div className="commonProfileInfo">
                <div className="photo-rating-wrapper">
                    <img src={userImagePath} alt="Profile Photo" className="profilePhoto"/>
                    <div className="rating">
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                    </div>
                </div>
                <div className="profileNamesBio">
                    <div className="nameProfile">{name}</div>
                    <div className="usernameProfile">{usernameFull}</div>
                    <div className="profileBio">
                        <div className="bioTitle">BIO</div>
                        {userData?.bio}
                    </div>
                </div>
            </div>
            <div className="recipesSectionProfileTitle">
                RECIPES OF THIS AUTHOR:
            </div>
            <div className="recipes-list-profile">
                <RecipesList author={username}/>
            </div>
            { !isOwnProfile && (
                <div className="rateThisAuthor">
                    <div className="rateThisAuthorTitle">
                        RATE THIS AUTHOR
                    </div>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} onClick={() => handleRating(star)}>
                                {rating >= star ? <FaStar className="star-form-filled"/> : <FaRegStar className="star-form"/>}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <Footer/>
        </div>
    );
}

export default Profile;
