import React, { useState, useEffect, FormEvent } from 'react';
import "../common.css";
import "./errors.css";

import { useParams, useNavigate } from "react-router-dom";

import ResendEmailSuccessfulMessage from "../messages/ResendVerificationEmailMessage";

type verificationErrorProps = {
    handleCloseError: () => void;
    errorContent: string;
}

const VerificationError = ({ handleCloseError, errorContent }: verificationErrorProps) => {
    const [visibilityResendEmailCodeButton, setVisibilityResendEmailCodeButton] = useState(false);
    const [visibilityResendEmailCodeSuccessMessage, setVisibilityResendEmailCodeSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { email } = useParams();

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

    const handleResendEmail = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        console.log(email);

        const formData = {
            email: email,
        };

        console.log("Form Data Submitted:", formData);

        setIsLoading(true);

        fetch("http://localhost:8000/api/users/resend-verification-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (response) => {
                const data = await response.json();
                return data;
            })
            .then((data) => {
                console.log("Backend Response:", data);
                setVisibilityResendEmailCodeSuccessMessage(true);
            })
            .catch((error) => {
                console.error("Error:", error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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
        </div>
    );
};

export default VerificationError;