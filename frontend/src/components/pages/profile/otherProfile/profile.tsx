import React, {useEffect, useRef, useState} from 'react';
import "./profile.css";

import { FaRegStar } from "react-icons/fa6";

import RecipesList from '../../../sections/recipes-home/RecipesList';

import Footer from "../../../sections/footer/Footer";
import Header from "../../../sections/header/Header";
import {validateJWT} from "../../authCheck";
import {useNavigate, useParams} from "react-router-dom";
import {getOtherUserDataRequest, rateUserRequest} from "./requests";
import {OtherUserData, RateUserData, Rating} from "./types";
import altImage from "../../../images/altImage.png";
import {FaStar} from "react-icons/fa";

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [userData, setUserData] = useState<OtherUserData | null>(null);
    const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [userRating, setUserRating] = useState<number | null>(null);
    const ratingSectionRef = useRef<HTMLDivElement | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const navigateTo = useNavigate();

    const { username } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            window.scrollTo(0, 0);

            const token = sessionStorage.getItem("accessToken");
            const { isValid, role } = validateJWT(token);

            if (!isValid) {
                navigateTo("/login");
                return;
            }

            setIsLoggedIn(true);

            if (role === "admin") {
                setIsAdmin(true);
            }

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
            setLoading(false);
        };

        fetchData();
    }, [isOwnProfile]);

    const getOtherUserData = async () => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await getOtherUserDataRequest(token!, username || "");
            console.log('Backend Response:', data);
            setUserData(data.user);
            setIsOwnProfile(data.user.isOwnProfile);
            setAverageRating(data.user.averageRating);
            setUserRating(data.user.currentUserRating);
        } catch (error) {
            console.error('Error fetching user data:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleRating = async (selectedRating: number) => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        const rateData: RateUserData =  {
            userBeingRated: username || "",
            rating: selectedRating,
        }

        try {
            await rateUserRequest(token!, rateData);
            window.location.reload();
        } catch (error) {
            console.error('Error rating the author:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleScrollToRating = () => {
        ratingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (!isLoggedIn) {
        return null;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const userImagePath = userData?.image ? `http://localhost:8000${userData.image}` : altImage;
    console.log(userImagePath);

    const name = userData?.first_name + " " + userData?.last_name;
    const usernameFull = "@" + userData?.username;

    return (
        <div className="profileWrapper">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false}/>
            <div className="commonProfileInfo">
                <div className="photo-rating-wrapper">
                    <img src={userImagePath} alt="Profile Photo" className="profilePhoto"/>
                    <div className="rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                                {averageRating >= star ? (
                                    <FaStar onClick={handleScrollToRating} className="star-form-filled-smaller"/>
                                ) : (
                                    <FaRegStar onClick={handleScrollToRating} className="star-form-smaller"/>
                                )}
                            </span>
                        ))}
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
                <RecipesList recipesOf={username}/>
            </div>
            { !isOwnProfile && (
                <div className="rateThisAuthor">
                    <div className="rateThisAuthorTitle">
                        {userRating !== null ? (
                            <div>YOU HAVE RATED THIS AUTHOR</div>
                        ) : (
                            <div>RATE THIS AUTHOR</div>
                        )}
                    </div>
                    <div ref={ratingSectionRef}  className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} onClick={() => handleRating(star)}>
                                {userRating && userRating >= star ? (
                                    <FaStar className="star-form-filled"/>
                                ) : (
                                    <FaRegStar className="star-form"/>
                                )}
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
