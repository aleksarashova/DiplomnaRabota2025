import React from 'react';
import "../common.css";
import "./messages.css";

type recipeSuccessfulMessageProps = {
    handleCloseMessage: () => void
}

const RecipeSuccessfulSuccessfulMessage = ({handleCloseMessage} : recipeSuccessfulMessageProps) => {
    return (
        <div className="popupOverlay">
            <div className="message-box">
                <div className="message-success">
                    The administrator has successfully received your recipe. It must be reviewed and approved or rejected. If approved, it will be published.
                </div>
                <button onClick={handleCloseMessage} className="messageCloseButton">OK</button>
            </div>
        </div>
    );
}

export default RecipeSuccessfulSuccessfulMessage;