import React, { useRef, useState, FormEvent } from "react";
import "../form.css";
import "../loading.css";

import { MdOutlineEmail } from "react-icons/md";

import EmailError from "../../popups/errors/EmailError";

import { useNavigate } from "react-router-dom";
import {SendResetPasswordEmailFormData} from "./types";
import {sendResetPasswordEmail} from "./requests";
import SendResetPasswordEmailSuccessfulMessage from "../../popups/messages/SendPasswordResetLinkEmailMessage";


const ForgotPasswordForm = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [visibilitySendEmailLinkSuccessMessage, setvisibilitySendEmailLinkSuccessMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visibilityEmailErrorPopup, setVisibilityEmailErrorPopup] = useState(false);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityEmailErrorPopup(true);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: SendResetPasswordEmailFormData = {
            email: emailRef.current?.value || "",
        }

        console.log("Form Data Submitted:", formData);

        setIsLoading(true);

        try {
            const data = await sendResetPasswordEmail(formData);

            console.log("Backend Response:", data);
            setvisibilitySendEmailLinkSuccessMessage(true);
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
    }

    const handleCloseSuccessfulResendMessage = () => {
        setvisibilitySendEmailLinkSuccessMessage(false);
        navigateTo('/login');
    }

    return (
        <div className="form-page">
            <div className="form-wrapper">
                <div className="form-content">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title-smaller">Email to send reset password link</h1>
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
                            disabled={isLoading}
                        >
                            Send link
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
            {visibilitySendEmailLinkSuccessMessage && (
                <SendResetPasswordEmailSuccessfulMessage handleCloseMessage={handleCloseSuccessfulResendMessage} />
            )}
            {visibilityEmailErrorPopup && (
                <EmailError handleCloseError={handleCloseEmailError} errorContent={errorMessage} />
            )}
        </div>
    );
}

export default ForgotPasswordForm;