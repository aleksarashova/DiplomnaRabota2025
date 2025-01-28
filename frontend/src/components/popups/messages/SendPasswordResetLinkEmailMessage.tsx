import React from 'react';
import "../common.css";
import "./messages.css";

type sendPasswordResetEmailSuccessfulMessageProps = {
    handleCloseMessage: () => void
}

const SendResetPasswordEmailSuccessfulMessage = ({handleCloseMessage} :sendPasswordResetEmailSuccessfulMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    We've sent a reset password link to your email. It may take a few minutes.
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">OK</button>
            </div>
        </div>
    );
}

export default SendResetPasswordEmailSuccessfulMessage;