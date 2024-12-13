import React from 'react';
import "../home/homepage.css";

import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import Sidebar from "../../bars/sidebar/Sidebar";
import RecipesList from "../../sections/recipes-home/RecipesList";

const HomePage = () => {

    return (
        <div className="homepage-body">
            <Sidebar />
            <Header />
            <div className="content">
                <RecipesList />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
