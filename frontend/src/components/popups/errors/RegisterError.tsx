import React from 'react';
import "../common.css";
import "./errors.css";

type registerErrorProps = {
    handleCloseError: () => void;
    errorContent : string;
}

const RegisterError = ({handleCloseError, errorContent} : registerErrorProps) => {
    return (
        <div className="popupOverlay">
            <div className="errorMessageBox">
                <div className="error">
                    ERROR
                </div>
                <div className="errorContent">
                    {errorContent}
                </div>
                <button onClick={handleCloseError} className="errorCloseButton">OK</button>
            </div>
        </div>
    );
}

export default RegisterError;