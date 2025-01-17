import React, {useEffect, useState} from "react";

import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import {useNavigate} from "react-router-dom";
import {validateJWT} from "../authCheck";
import AddRecipeForm from "../../forms/add-recipe/AddRecipe";

const AddRecipePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);
        setIsLoggedIn(!!isValid);
        setIsAdmin(role === "admin");

        if (!isValid) {
            navigateTo("/login");
        }
    }, []);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="form-page">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false}/>
            <AddRecipeForm />
            <Footer />
        </div>
    );
}

export default AddRecipePage;