import React from "react";

import ResetPasswordForm from "../../forms/reset-password/ResetPasswordForm";
import Header from "../../sections/header/Header";
import Footer from "../../sections/footer/Footer";

const ResetPasswordPage = () => {
    return (
        <div className="form-page">
            <Header isLoggedIn={true} isProfilePage={false} isHomePage={false}/>
            <ResetPasswordForm />
            <Footer />
        </div>
    );
}

export default ResetPasswordPage;