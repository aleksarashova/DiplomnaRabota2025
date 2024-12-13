import React from 'react';
import "../common.css";
import "./messages.css";

type registerSuccessfulMessageProps = {
    handleCloseMessage: () => void
}

const RegisterSuccessfulMessage = ({handleCloseMessage} : registerSuccessfulMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    Register successful! We will send an email with a verification code. It may take a few minutes.
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">OK</button>
            </div>
        </div>
    );
}

export default RegisterSuccessfulMessage;