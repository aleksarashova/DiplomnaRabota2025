import React, { useEffect, useState } from "react";
import "../home/homepage.css";

import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import Sidebar from "../../bars/sidebar/Sidebar";
import RecipesList from "../../sections/recipes-home/RecipesList";

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

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const isValid = validateJWT(token);
        setIsLoggedIn(isValid);
    }, []);

    return (
        <div className="homepage-body">
            <Sidebar setSelectedCategory={setSelectedCategory}/>
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={true} setSearchText={setSearchText}/>
            <div className="content">
                <RecipesList selectedCategory={selectedCategory} searchText={searchText}/>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;