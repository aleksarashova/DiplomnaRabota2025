import React, { useState, useEffect } from 'react';
import "../common.css";
import "./errors.css";

import { useNavigate } from "react-router-dom";

type LoginErrorProps = {
    handleCloseError: () => void;
    errorContent: string;
};

const LoginError = ({ handleCloseError, errorContent }: LoginErrorProps) => {
    const navigateTo = useNavigate();
    const [buttonText, setButtonText] = useState("OK");
    const [buttonClass, setButtonClass] = useState("errorCloseButton");

    useEffect(() => {
        if (errorContent === "You should verify your account first.") {
            setButtonText("Verify");
            setButtonClass("errorCloseButtonWider");
        } else {
            setButtonText("OK");
            setButtonClass("errorCloseButton");
        }
    }, [errorContent]);

    const handleClose = () => {
        handleCloseError();
        if (buttonText === "Verify") {
            navigateTo("/send-verification-email");
        }
    };

    return (
        <div className="popupOverlay">
            <div className="errorMessageBox">
                <div className="error">ERROR</div>
                <div className="errorContent">{errorContent}</div>
                <button onClick={handleClose} className={buttonClass}>
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default LoginError;