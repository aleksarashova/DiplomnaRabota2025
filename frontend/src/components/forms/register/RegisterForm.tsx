import React, { useRef, FormEvent, useState } from "react";
import "../form.css";
import "./register.css";
import "../loading.css";

import { useNavigate, Link } from "react-router-dom";

import { registerUser } from "./requests";

import RegisterError from "../../popups/errors/RegisterError";
import RegisterSuccessfulMessage from "../../popups/messages/RegisterSuccessfulMessage";

import { FaUser, FaLock, FaUserSecret } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline, MdEmail } from "react-icons/md";

import altImage from "../../images/altImage.png";

const RegisterForm = () => {
    const [visibilityRegisterErrorPopup, setVisibilityRegisterErrorPopup] = useState(false);
    const [visibilitySuccessfulRegisterPopup, setVisibilitySuccessfulRegisterPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>(altImage);
    const [showOptions, setShowOptions] = useState(false);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            setShowOptions(false);
        }
    }

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewImage(altImage);
        setShowOptions(false);
    }

    const handleImageClick = () => {
        if (image) {
            setShowOptions((prev) => !prev);
        } else {
            document.getElementById("fileInput")?.click();
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("first_name", firstNameRef.current?.value || "");
        formData.append("last_name", lastNameRef.current?.value || "");
        formData.append("email", emailRef.current?.value || "");
        formData.append("username", usernameRef.current?.value || "");
        formData.append("password", passwordRef.current?.value || "");
        formData.append("admin_code", adminCodeRef.current?.value || "");

        console.log("Form Data Submitted:", formData);
        console.log("FormData contents:");
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

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
                        <div className="profile-picture-container" onClick={handleImageClick}>
                            <img
                                src={previewImage}
                                alt="Profile Picture"
                                className="profile-picture"
                            />
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/jpg"
                                style={{display: "none"}}
                            />
                            {showOptions && image && (
                                <div className="image-options">
                                    <button
                                        type="button"
                                        className="change-button"
                                        onClick={() => document.getElementById("fileInput")?.click()}
                                    >
                                        Change
                                    </button>
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={handleRemoveImage}
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-input-box">
                            <div className="form-icon">
                                <MdOutlineDriveFileRenameOutline/>
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
                                <MdOutlineDriveFileRenameOutline/>
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
                                <MdEmail/>
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
                                <FaUser/>
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
                                <FaLock/>
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
                                <FaUserSecret/>
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
                <RegisterError
                    handleCloseError={handleCloseRegisterError}
                    errorContent={errorMessage}
                />
            )}
            {visibilitySuccessfulRegisterPopup && (
                <RegisterSuccessfulMessage
                    handleCloseMessage={handleCloseSuccessfulRegisterMessage}
                />
            )}
        </div>
    );
};

export default RegisterForm;