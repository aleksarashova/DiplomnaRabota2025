import React from "react";

import Header from "../../sections/header/Header";
import LoginForm from "../../forms/login/LoginForm";
import Footer from "../../sections/footer/Footer";

const LoginPage = () => {
    return (
        <div className="form-page">
            <Header isLoggedIn={false} isAdmin={false} isProfilePage={false} isHomePage={false}/>
            <LoginForm />
            <Footer />
        </div>
    );
}

export default LoginPage;