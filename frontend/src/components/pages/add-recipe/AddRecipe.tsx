import React, {useEffect, useState} from "react";

import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import {useNavigate} from "react-router-dom";
import {validateJWT} from "../authCheck";
import AddRecipeForm from "../../forms/add-recipe/AddRecipe";

const AddRecipePage = () => {
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

    return (
        <div className="form-page">
            <Header isLoggedIn={isLoggedIn} isProfilePage={false} isHomePage={false}/>
            <AddRecipeForm />
            <Footer />
        </div>
    );
}

export default AddRecipePage;