import React from "react";

import Header from "../../sections/header/Header";
import ForgotPasswordForm from "../../forms/forgot-password/ForgotPasswordForm";
import Footer from "../../sections/footer/Footer";

const ForgotPasswordPage = () => {
    return (
        <div className="form-page">
            <Header isLoggedIn={false} isAdmin={false} isProfilePage={false} isHomePage={false}/>
            <ForgotPasswordForm />
            <Footer />
        </div>
    );
}

export default ForgotPasswordPage;