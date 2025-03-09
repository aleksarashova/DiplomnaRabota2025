import React from 'react';
import "../common.css";
import "./messages.css";

type timerEndedMessageProps = {
    handleCloseMessage: () => void;
}

const TimerEndedMessage = ({handleCloseMessage} : timerEndedMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box" id="timerMessageBox">
                <div className="message-warning">
                    Your time is up!
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">Close</button>
            </div>
        </div>
    );
}

export default TimerEndedMessage;