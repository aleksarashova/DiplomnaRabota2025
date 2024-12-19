import React, { useRef, FormEvent, useState } from "react";
import "../form.css";
import "./register.css";
import "../loading.css";

import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "./requests";
import { RegisterFormData } from "./types";

import RegisterError from "../../popups/errors/RegisterError";
import RegisterSuccessfulMessage from "../../popups/messages/RegisterSuccessfulMessage";

import { FaUser, FaLock, FaUserSecret } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline, MdEmail } from "react-icons/md";

const RegisterForm = () => {
    const [visibilityRegisterErrorPopup, setVisibilityRegisterErrorPopup] = useState(false);
    const [visibilitySuccessfulRegisterPopup, setVisibilitySuccessfulRegisterPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const adminCodeRef = useRef<HTMLInputElement>(null);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityRegisterErrorPopup(true);
    }

    const handleCloseRegisterError = () => {
        setVisibilityRegisterErrorPopup(false);
    }

    const handleCloseSuccessfulRegisterMessage = () => {
        setVisibilitySuccessfulRegisterPopup(false);

        const email = emailRef.current?.value;
        if (email) {
            navigateTo(`/verify-profile/${encodeURIComponent(email)}`);
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: RegisterFormData = {
            first_name: firstNameRef.current?.value || "",
            last_name: lastNameRef.current?.value || "",
            email: emailRef.current?.value || "",
            username: usernameRef.current?.value || "",
            password: passwordRef.current?.value || "",
            admin_code: adminCodeRef.current?.value || "",
        };

        console.log("Form Data Submitted:", formData);

        setIsLoading(true);

        try {
            const data = await registerUser(formData);

            console.log("Backend Response:", data);
            setVisibilitySuccessfulRegisterPopup(true);
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error) {
                handleInvalidInput(error.message);
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="form-page">
            <div className="form-wrapper" id="register-wrapper">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title">Sign up</h1>
                        <div className="form-input-box">
                            <div className="form-icon">
                                <MdOutlineDriveFileRenameOutline />
                            </div>
                            <input
                                ref={firstNameRef}
                                type="text"
                                placeholder="First name"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <MdOutlineDriveFileRenameOutline />
                            </div>
                            <input
                                ref={lastNameRef}
                                type="text"
                                placeholder="Last name"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <MdEmail />
                            </div>
                            <input
                                ref={emailRef}
                                type="email"
                                placeholder="Email"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <FaUser />
                            </div>
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Username"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <FaLock />
                            </div>
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Password"
                                className="form-input"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <FaUserSecret />
                            </div>
                            <input
                                ref={adminCodeRef}
                                type="text"
                                placeholder="Admin code (optional)"
                                className="form-input"
                                disabled={isLoading}
                            />
                        </div>

                        <button type="submit" className="form-button" disabled={isLoading}>
                            Register
                        </button>

                        <div className="forward">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="form-link">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                    {isLoading && (
                        <div className="loadingOverlay">
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {visibilityRegisterErrorPopup && (
                <RegisterError handleCloseError={handleCloseRegisterError} errorContent={errorMessage} />
            )}
            {visibilitySuccessfulRegisterPopup && (
                <RegisterSuccessfulMessage handleCloseMessage={handleCloseSuccessfulRegisterMessage} />
            )}
        </div>
    );
};

export default RegisterForm;