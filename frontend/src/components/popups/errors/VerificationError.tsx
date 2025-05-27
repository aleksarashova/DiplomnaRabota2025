import React, { useState, useEffect, FormEvent } from 'react';
import "../common.css";
import "./errors.css";

import { useParams} from "react-router-dom";

import ResendEmailSuccessfulMessage from "../messages/ResendVerificationEmailMessage";
import {sendVerificationEmail} from "../../forms/send-verification-email/requests";
import {SendVerificationEmailFormData} from "../../forms/send-verification-email/types";
import EmailError from "./EmailError";

type verificationErrorProps = {
    handleCloseError: () => void;
    errorContent: string;
}

const VerificationError = ({ handleCloseError, errorContent }: verificationErrorProps) => {
    const [visibilityResendEmailCodeButton, setVisibilityResendEmailCodeButton] = useState(false);
    const [visibilityResendEmailCodeSuccessMessage, setVisibilityResendEmailCodeSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { email } = useParams();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visibilityEmailErrorPopup, setVisibilityEmailErrorPopup] = useState(false);

    useEffect(() => {
        if (errorContent === "Expired verification code.") {
            setVisibilityResendEmailCodeButton(true);
        } else {
            setVisibilityResendEmailCodeButton(false);
        }
    }, [errorContent]);

    const handleCloseSuccessfulResendMessage = () => {
        setVisibilityResendEmailCodeSuccessMessage(false);
        handleCloseError();
    }

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityEmailErrorPopup(true);
    }

    const handleCloseEmailError = () => {
        setVisibilityEmailErrorPopup(false);
    }

    const handleResendEmail = async (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const formData: SendVerificationEmailFormData = {
            email: email || "",
        };

        console.log("Form Data Submitted:", formData);

        setIsLoading(true);

        try {
            const data = await sendVerificationEmail(formData);

            console.log("Backend Response:", data);
            setVisibilityResendEmailCodeSuccessMessage(true);
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
        <div className="popupOverlay">
            <div className="errorMessageBox">
                <div className="error">
                    ERROR
                </div>
                <div className="errorContent">
                    {errorContent}
                </div>
                <button onClick={handleCloseError} className="errorCloseButton" disabled={isLoading}>OK</button>
                {visibilityResendEmailCodeButton && (
                    <button onClick={handleResendEmail} className="resendEmailButton" disabled={isLoading}>Resend code</button>
                )}
            </div>
            {isLoading && (
                <div className="loadingOverlay">
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                    </div>
                </div>
            )}
            {visibilityResendEmailCodeSuccessMessage && (
                <ResendEmailSuccessfulMessage
                    handleCloseMessage={handleCloseSuccessfulResendMessage}
                />
            )}
            {visibilityEmailErrorPopup && (
                <EmailError
                    handleCloseError={handleCloseEmailError}
                    errorContent={errorMessage} />
            )}
        </div>
    );
}

export default VerificationError;