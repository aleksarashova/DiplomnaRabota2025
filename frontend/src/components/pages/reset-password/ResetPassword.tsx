import React, {useEffect, useState} from "react";

import ResetPasswordForm from "../../forms/reset-password/ResetPasswordForm";
import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";
import {validateJWT} from "../authCheck";
import {useNavigate} from "react-router-dom";

const ResetPasswordPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const navigateTo = useNavigate();

    useEffect(() => {
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

    }, []);

    return (
        <div className="form-page">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false}/>
            <ResetPasswordForm />
            <Footer />
        </div>
    );
}

export default ResetPasswordPage;