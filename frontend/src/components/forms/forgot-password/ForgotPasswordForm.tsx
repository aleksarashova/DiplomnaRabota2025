import React from "react";
import "../form.css";

import {MdEmail} from "react-icons/md";

const ForgotPasswordForm = () => {
    return (
        <div className="form-page">
            <div className="form-wrapper" id="formWrapperForgotPassword">
                <div className="form-content" id="formContentForgotPassword">
                    <form action="">
                        <h1 className="form-title" id="formTitleForgotPassword">Forgot password</h1>
                        <div className="form-input-box">
                            <div className="form-icon"><MdEmail/></div>
                            <input type="text" placeholder="Email" className="form-input"/>
                        </div>
                        <button type="submit" className="form-button" id="formButtonForgotPassword">Send email</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordForm;