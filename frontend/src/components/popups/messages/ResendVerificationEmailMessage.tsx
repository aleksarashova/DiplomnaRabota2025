import React from 'react';
import "../common.css";
import "./messages.css";

type resendEmailSuccessfulMessageProps = {
    handleCloseMessage: () => void
}

const ResendVerificationEmailSuccessfulMessage = ({handleCloseMessage} : resendEmailSuccessfulMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    We've sent a new code to your email. It may take a few minutes.
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">OK</button>
            </div>
        </div>
    );
}

export default ResendVerificationEmailSuccessfulMessage;