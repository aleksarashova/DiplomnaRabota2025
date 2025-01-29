import React, {FormEvent, useState} from "react";
import "./reset-password.css";
import "../form.css";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { resetUserPassword } from "./requests";
import { ResetPasswordFormData } from "./types";

const ResetPasswordForm = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [visibilityResetPasswordErrorPopup, setVisibilityResetPasswordErrorPopup] = useState(false);
    const navigate = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityResetPasswordErrorPopup(true);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const resetKey = urlParams.get("token");

        if (!resetKey) {
            setErrorMessage("Invalid or missing reset token.");
            return;
        }

        const formData: ResetPasswordFormData = {
            password: password,
            reset_password_key: resetKey,
        };

        try {
            await resetUserPassword(formData);
            navigate("/login");
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error) {
                handleInvalidInput(error.message);
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    return (
        <div className="form-page">
            <div className="form-wrapper" id="formWrapperResetPassword">
                <div className="form-content" id="formContentResetPassword">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title" id="formTitleResetPassword">Reset Password</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock /></div>
                            <input
                                type="password"
                                placeholder="New password"
                                className="form-input"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock /></div>
                            <input
                                type="password"
                                placeholder="Repeat new password"
                                className="form-input"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="form-button"
                            id="formButtonResetPassword"
                        >
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;