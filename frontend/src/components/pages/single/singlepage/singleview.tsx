import React, { useEffect, useRef, useState } from "react";
import "./single.css";

import Header from "../../../sections/header/Header";
import Footer from "../../../sections/footer/Footer";
import CommonRecipeInfo from "../common/commoninfo";
import MoreRecipeInfo from "../moreInfo/moreinfo";
import CommentsSection from "../comments/commentsSection";
import { validateJWT } from "../../authCheck";
import {useNavigate, useParams} from "react-router-dom";
import {RecipeData} from "./types";
import {getRecipeDataRequest} from "./requests";


const SingleView = () => {
    const commentsSectionRef = useRef<HTMLDivElement | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [recipeData, setRecipeData] = useState<RecipeData | null>(null);

    const navigateTo = useNavigate();

    const { recipeId } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const { isValid, role } = validateJWT(token);
            setIsLoggedIn(!!isValid);
            setIsAdmin(role === "admin");

            if (!isValid) {
                navigateTo("/login");
            }

            if (isValid) {
                try {
                    await getRecipeData();
                } catch (error) {
                    console.error("Error fetching recipe data:", error);
                }
            } else {
                navigateTo("/login");
            }
        };

        fetchData();
    }, []);

    const getRecipeData = async () => {
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        if (!recipeId) {
            console.error('No recipeId found in URL.');
            return;
        }

        try {
            const data = await getRecipeDataRequest(token!, recipeId);
            console.log('Backend Response:', data);
            setRecipeData(data.recipe);
        } catch (error) {
            console.error('Error getting recipe data:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    if (!isLoggedIn) {
        return null;
    }

    const handleScrollToComments = () => {
        commentsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <div className="singleViewPage">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false} />
            <CommonRecipeInfo
                recipeData={recipeData}
                onCommentClick={handleScrollToComments}
            />
            <MoreRecipeInfo
                recipeData={recipeData}
            />
            <div ref={commentsSectionRef} className="commentsSectionScroll">
                <CommentsSection
                    recipeData={recipeData}
                />
            </div>
            <Footer />
        </div>
    );
}

export default SingleView;