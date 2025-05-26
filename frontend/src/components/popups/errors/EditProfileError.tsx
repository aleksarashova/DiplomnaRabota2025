import React from 'react';
import "../common.css";
import "./errors.css";

type editProfileErrorProps = {
    handleCloseError: () => void;
    errorContent : string;
}

const EditProfileError = ({handleCloseError, errorContent} : editProfileErrorProps) => {
    return (
        <div className="popupOverlayOverAnotherPopup">
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

export default EditProfileError;