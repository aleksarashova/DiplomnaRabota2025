import React, { FormEvent, useRef, useState } from "react";
import "../form.css";
import "./login.css";

import {FaUser, FaLock, FaEye, FaEyeSlash} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import { LoginFormData } from "./types";

import LoginError from "../../popups/errors/LoginError";
import { loginUser } from "./requests";

import * as Tone from "tone";

const LoginForm = () => {
    const [visibilityLoginErrorPopup, setVisibilityLoginErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityLoginErrorPopup(true);
    };

    const handleCloseLoginError = () => {
        setVisibilityLoginErrorPopup(false);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const formData: LoginFormData = {
            username: usernameRef.current?.value || "",
            password: passwordRef.current?.value || "",
        };

        console.log("Form Data Submitted:", formData);

        try {
            const data = await loginUser(formData);

            console.log("Backend Response:", data);

            sessionStorage.setItem("accessToken", data.accessToken);

            navigateTo("/");
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

    return (
        <div className="form-page">
            <div className="form-wrapper" id="login-wrapper">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title">Sign in</h1>
                        <div className="form-input-box">
                            <div className="form-icon"><FaUser/></div>
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Username"
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-input-box">
                            <div className="form-icon"><FaLock/></div>
                            <input
                                ref={passwordRef}
                                type={isPasswordVisible ? "text" : "password"}
                                placeholder="Password"
                                className="form-input"
                                required
                            />
                            <div onClick={changePasswordVisibility}>
                                {isPasswordVisible ? <FaEye className="eye-icon"/> : <FaEyeSlash className="eye-icon"/>}
                            </div>
                        </div>
                        <div className="forgot-password">
                            <Link to="/forgot-password" className="form-link">Forgot password?</Link>
                        </div>
                        <button type="submit" className="form-button">Login</button>
                        <div className="forward">
                            <p>Don't have an account? <Link to="/register" className="form-link">Register</Link></p>
                        </div>
                    </form>
                </div>
            </div>
            {visibilityLoginErrorPopup && (
                <LoginError
                    handleCloseError={handleCloseLoginError}
                    errorContent={errorMessage}
                />
            )}
        </div>
    );
}

export default LoginForm;