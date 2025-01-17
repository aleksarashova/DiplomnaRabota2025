import React, { useEffect, useState } from "react";
import "../home/homepage.css";

import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import Sidebar from "../../bars/sidebar/Sidebar";
import RecipesList from "../../sections/recipes-home/RecipesList";
import {validateJWT} from "../authCheck";


const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (isValid) {
            setIsLoggedIn(true);
        }

        if (role === "admin") {
            setIsAdmin(true);
        }
    }, []);

    return (
        <div className="homepage-body">
            <Sidebar setSelectedCategory={setSelectedCategory}/>
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={true} setSearchText={setSearchText}/>
            <div className="content">
                <RecipesList selectedCategory={selectedCategory} searchText={searchText}/>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;