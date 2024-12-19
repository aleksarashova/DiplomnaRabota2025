import React, { useRef, useState, FormEvent } from "react";
import "../form.css";
import "./verify-profile.css";

import { CiBarcode } from "react-icons/ci";

import { useParams, useNavigate } from "react-router-dom";

import VerificationError from "../../popups/errors/VerificationError";
import VerificationSuccessfulMessage from "../../popups/messages/VerificationSuccessfulMessage";

import {VerifyProfileFormData} from "./types";
import {verifyProfile} from "./requests";

const VerifyProfileForm = () => {
    const { email } = useParams();

    const [visibilityVerifyErrorPopup, setVisibilityVerifyErrorPopup] = useState(false);
    const [visibilitySuccessfulVerificationPopup, setVisibilitySuccessfulVerificationPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const codeRef = useRef<HTMLInputElement>(null);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityVerifyErrorPopup(true);
    }

    const handleCloseVerifyError = () => {
        setVisibilityVerifyErrorPopup(false);
    }

    const handleCloseSuccessfulVerificationMessage = () => {
        setVisibilitySuccessfulVerificationPopup(false);
        navigateTo("/login");
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData: VerifyProfileFormData = {
            email: email || "",
            code: codeRef.current?.value || "",
        };

        console.log("Form Data Submitted:", formData);

        try {
            const data = await verifyProfile(formData);

            console.log("Backend Response:", data);
            setVisibilitySuccessfulVerificationPopup(true);
        } catch(error) {
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
            <div className="form-wrapper" id="formWrapperVerifyProfile">
                <div className="form-content" id="formContentVerifyProfile">
                    <form onSubmit={handleSubmit}>
                        <h1 className="form-title" id="formTitleVerifyProfile">Verify Profile</h1>
                        <div className="enterCodeMessage">Enter the code we've sent to <strong className="emailToSendCode">{email}</strong></div>
                        <div className="form-input-box">
                            <div className="form-icon"><CiBarcode /></div>
                            <input ref={codeRef} type="text" className="form-input" required/>
                        </div>
                        <button type="submit" className="form-button" id="formButtonVerifyProfile">
                            Verify profile
                        </button>
                    </form>
                </div>
            </div>
            {visibilityVerifyErrorPopup && (
                <VerificationError
                    handleCloseError={handleCloseVerifyError}
                    errorContent={errorMessage}
                />
            )}
            {visibilitySuccessfulVerificationPopup && (
                <VerificationSuccessfulMessage
                    handleCloseMessage={handleCloseSuccessfulVerificationMessage}
                />
            )}
        </div>
    );
}

export default VerifyProfileForm;