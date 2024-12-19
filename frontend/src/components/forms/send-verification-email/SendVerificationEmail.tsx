import React, { useRef, useState, FormEvent } from "react";
import "../form.css";
import "../loading.css";

import { MdOutlineEmail } from "react-icons/md";

import ResendEmailSuccessfulMessage from "../../popups/messages/ResendEmailMessage";
import EmailError from "../../popups/errors/EmailError";

import { useNavigate } from "react-router-dom";

import {SendVerificationEmailFormData} from "./types";
import {sendVerificationEmail} from "./requests";

const SendEmailForm = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visibilityResendEmailCodeSuccessMessage, setVisibilityResendEmailCodeSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visibilityEmailErrorPopup, setVisibilityEmailErrorPopup] = useState(false);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityEmailErrorPopup(true);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: SendVerificationEmailFormData = {
            email: emailRef.current?.value || "",
        }

        console.log("Form Data Submitted:", formData);

        setIsLoading(true);

        try {
            const data = await sendVerificationEmail(formData);

            console.log("Backend Response:", data);
            setVisibilityResendEmailCodeSuccessMessage(true);
        } catch(error) {
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

    const handleCloseEmailError = () => {
        setVisibilityEmailErrorPopup(false);
    };

    const handleCloseSuccessfulResendMessage = () => {
        setVisibilityResendEmailCodeSuccessMessage(false);
        const email = emailRef.current?.value;
        if (email) {
            navigateTo(`/verify-profile/${encodeURIComponent(email)}`);
        }
    };

    return (
        <div className="form-page">
            <div className="form-wrapper">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title-smaller">Email to send verification code</h1>
                        <div className="form-input-box">
                            <div className="form-icon">
                                <MdOutlineEmail />
                            </div>
                            <input
                                ref={emailRef}
                                type="text"
                                placeholder="Email"
                                className="form-input"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="form-button"
                            id="formButtonResetPassword"
                            disabled={isLoading}
                        >
                            Send code
                        </button>
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
            {visibilityResendEmailCodeSuccessMessage && (
                <ResendEmailSuccessfulMessage handleCloseMessage={handleCloseSuccessfulResendMessage} />
            )}
            {visibilityEmailErrorPopup && (
                <EmailError handleCloseError={handleCloseEmailError} errorContent={errorMessage} />
            )}
        </div>
    );
};

export default SendEmailForm;