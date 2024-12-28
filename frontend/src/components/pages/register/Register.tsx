import React from "react";

import Header from "../../sections/header/Header";
import RegisterForm from "../../forms/register/RegisterForm";
import Footer from "../../sections/footer/Footer";

const RegisterPage = () => {
    return (
        <div className="form-page">
            <Header isLoggedIn={false} isProfilePage={false} isHomePage={false}/>
            <RegisterForm />
            <Footer />
        </div>
    );
}

export default RegisterPage;