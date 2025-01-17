import React from 'react';
import "../common.css";
import "./errors.css";

type notAdminErrorProps = {
    handleCloseError: () => void;
    errorContent : string;
}

const NotAdminError = ({handleCloseError, errorContent} : notAdminErrorProps) => {
    return (
        <div className="popupOverlayBackgroundHidden">
            <div className="errorMessageBox">
                <div className="error">
                    ERROR
                </div>
                <div className="errorContent">
                    {errorContent}
                </div>
                <button onClick={handleCloseError} className="errorCloseButtonWidest">RETURN TO HOME</button>
            </div>
        </div>
    );
}

export default NotAdminError;