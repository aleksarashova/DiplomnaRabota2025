import React from 'react';
import "../common.css";
import "./messages.css";

type addCommentMessageProps = {
    handleCloseMessage: () => void;
}

const AddCommentMessage = ({handleCloseMessage} : addCommentMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    The administrator has successfully received your comment. It must be reviewed and approved or rejected. If approved, it will be published.
                </div>
                <div className="message-warning">Comments with inappropriate content will not be uploaded.</div>
                <button onClick={handleCloseMessage} className="messageCloseButton">Close</button>
            </div>
        </div>
    );
}

export default AddCommentMessage;