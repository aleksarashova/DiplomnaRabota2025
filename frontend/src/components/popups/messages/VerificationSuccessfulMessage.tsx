import React from 'react';
import "../common.css";
import "./messages.css";

type verificationSuccessfulMessageProps = {
    handleCloseMessage: () => void
}

const VerificationSuccessfulMessage = ({handleCloseMessage} : verificationSuccessfulMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    You successfully verified your profile!
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">OK</button>
            </div>
        </div>
    );
}

export default VerificationSuccessfulMessage;