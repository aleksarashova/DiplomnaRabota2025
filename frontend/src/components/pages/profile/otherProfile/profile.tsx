import React, {useEffect, useState} from 'react';
import "./profile.css";

import profileImage from "../../../images/altImage.png";

import { FaRegStar } from "react-icons/fa6";

import RecipesList from '../../../sections/recipes-home/RecipesList';


import Footer from "../../../sections/footer/Footer";
import Header from "../../../sections/header/Header";
import {validateJWT} from "../../authCheck";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const isValid = token && validateJWT(token);
        setIsLoggedIn(!!isValid);

        if (isValid) {
            //get the data of the particular user - tva mi ostava
        } else {
            navigateTo("/login");
        }
    }, []);


    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="profileWrapper">
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={false}/>
            <div className="commonProfileInfo">
                <div className="photo-rating-wrapper">
                    <img src={profileImage} alt="No photo" className="profilePhoto"/>
                    <div className="rating">
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                        <FaRegStar className="star-rating"/>
                    </div>
                </div>
                <div className="profileNamesBio">
                    <div className="nameProfile">Aleksa Rashova</div>
                    <div className="usernameProfile">@aleksarashova</div>
                    <div className="profileBio">
                        <div className="bioTitle">BIO</div>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ornare pretium sagittis. Donec
                        lacinia efficitur metus id auctor. Nullam vitae dictum eros. Etiam vehicula ex rhoncus velit
                        gravida, sit amet malesuada orci viverra. In sed nibh tincidunt, pellentesque massa et, dictum
                        elit. Nullam varius turpis sapien, ac lacinia velit feugiat nec
                    </div>
                </div>
            </div>
            <div className="recipesSectionProfileTitle">
                RECIPES OF THIS AUTHOR:
            </div>
            <div className="recipes-list-profile">
                <RecipesList selectedCategory={null}/>
                {/*must add a variable for the user id - if missed then show all recipes (for the homepage)*/}
            </div>
            <div className="rateThisAuthor">
                <div className="rateThisAuthorTitle">
                    RATE THIS AUTHOR
                </div>
                <div className="stars">
                    <FaRegStar className="star-form"/>
                    <FaRegStar className="star-form"/>
                    <FaRegStar className="star-form"/>
                    <FaRegStar className="star-form"/>
                    <FaRegStar className="star-form"/>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Profile;
