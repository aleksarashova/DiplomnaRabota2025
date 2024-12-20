import React, {useEffect, useRef, useState} from "react";
import "./single.css";

import Header from "../../../sections/header/Header";
import Footer from "../../../sections/footer/Footer";

import CommonRecipeInfo from "../common/commoninfo";
import MoreRecipeInfo from "../moreInfo/moreinfo";
import CommentsSection from "../comments/commentsSection";

const decodeBase64URL = (base64URL: string) => {
    const base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    return atob(base64 + padding);
}

const validateJWT = (token: string | null): boolean => {
    console.log(token)
    if (!token) {
        console.log("No access token.");
        return false;
    }

    try {
        const payload = JSON.parse(decodeBase64URL(token.split(".")[1]));
        return payload.exp * 1000 > Date.now();
    } catch (error) {
        console.error("Failed to validate JWT:", error);
        return false;
    }
}

const SingleView = () => {
    const commentsSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToComments = () => {
        if (commentsSectionRef.current) {
            commentsSectionRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const isValid = validateJWT(token);
        setIsLoggedIn(isValid);
    }, []);

    return (
        <div className="singleViewPage">
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={false}/>
            <CommonRecipeInfo onCommentClick={handleScrollToComments} />
            <MoreRecipeInfo />
            <div ref={commentsSectionRef} className="commentsSectionScroll">
                <CommentsSection />
            </div>
            <Footer />
        </div>
    );
}

export default SingleView;
