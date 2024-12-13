import React from "react";
import "../form.css";

import { FaLock } from "react-icons/fa";

const ResetPasswordForm = () => {
    return (
        <div className="form-page">
            <div className="form-wrapper" id="formWrapperResetPassword">
                <div className="form-content" id="formContentResetPassword">
                    <form action="">
                        <h1 className="form-title" id="formTitleResetPassword">Reset password</h1>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input type="text" placeholder="New password" className="form-input" required/>
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input type="text" placeholder="Repeat new password" className="form-input" required/>
                        </div>
                        <button type="submit" className="form-button" id="formButtonResetPassword">Reset password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;