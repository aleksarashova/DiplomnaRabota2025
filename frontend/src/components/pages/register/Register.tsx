import React from "react";

import Header from "../../sections/header/Header";
import RegisterForm from "../../forms/register/RegisterForm";

const RegisterPage = () => {
    return (
        <div className="form-page">
            <Header isLoggedIn={false} isProfilePage={false} isHomePage={false}/>
            <RegisterForm />
            <RegisterForm />
        </div>
    );
}

export default RegisterPage;