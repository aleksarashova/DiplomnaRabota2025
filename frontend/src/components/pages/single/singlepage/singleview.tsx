import React, { useEffect, useRef, useState } from "react";
import "./single.css";
import Header from "../../../sections/header/Header";
import Footer from "../../../sections/footer/Footer";
import CommonRecipeInfo from "../common/commoninfo";
import MoreRecipeInfo from "../moreInfo/moreinfo";
import CommentsSection from "../comments/commentsSection";
import { validateJWT } from "../../authCheck";
import { useNavigate } from "react-router-dom";

const SingleView = () => {
    const commentsSectionRef = useRef<HTMLDivElement | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const isValid = token && validateJWT(token);
        setIsLoggedIn(!!isValid);

        if (!isValid) {
            navigateTo("/login");
        }
    }, []);

    if (!isLoggedIn) {
        return null;
    }

    const handleScrollToComments = () => {
        commentsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="singleViewPage">
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={false} />
            <CommonRecipeInfo onCommentClick={handleScrollToComments} />
            <MoreRecipeInfo />
            <div ref={commentsSectionRef} className="commentsSectionScroll">
                <CommentsSection />
            </div>
            <Footer />
        </div>
    );
};

export default SingleView;