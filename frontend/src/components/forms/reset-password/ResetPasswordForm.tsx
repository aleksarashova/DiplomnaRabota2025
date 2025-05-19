import React, {FormEvent, useRef, useState} from "react";
import "./reset-password.css";
import "../form.css";
import {FaEye, FaEyeSlash, FaLock} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { resetUserPassword } from "./requests";
import { ResetPasswordFormData } from "./types";

const ResetPasswordForm = () => {
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigateTo = useNavigate();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const password = passwordRef.current?.value || "";
        const confirmPassword = confirmPasswordRef.current?.value || "";

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const resetKey = urlParams.get("key");

        console.log(resetKey);

        if (!resetKey) {
            setErrorMessage("Invalid or missing reset key.");
            return;
        }

        const formData: ResetPasswordFormData = {
            password: password,
            reset_password_key: resetKey,
        };

        console.log("Form Data Submitted:", formData);

        try {
            await resetUserPassword(formData);
            navigateTo("/login");
            return;
        } catch (error) {
            console.error("Error:", error);

            if (error instanceof Error) {
                handleInvalidInput(error.message);
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    const changePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    const changeConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    }

    return (
        <div className="form-page">
            <div className="form-wrapper" id="formWrapperResetPassword">
                <div className="form-content" id="formContentResetPassword">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title" id="formTitleResetPassword">Reset Password</h1>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="New password"
                                className="form-input"
                                required
                                ref={passwordRef}
                            />
                            <div onClick={changePasswordVisibility}>
                                {isPasswordVisible ? <FaEye className="eye-icon"/> : <FaEyeSlash className="eye-icon"/>}
                            </div>
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input
                                type={isConfirmPasswordVisible ? "text" : "password"}
                                placeholder="Repeat new password"
                                className="form-input"
                                required
                                ref={confirmPasswordRef}
                            />
                            <div onClick={changeConfirmPasswordVisibility}>
                                {isConfirmPasswordVisible ? <FaEye className="eye-icon"/> : <FaEyeSlash className="eye-icon"/>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="form-button"
                            id="formButtonResetPassword"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;