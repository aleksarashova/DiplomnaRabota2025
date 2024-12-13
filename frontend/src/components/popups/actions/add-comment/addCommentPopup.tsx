import React, { useState } from 'react';
import "../../common.css";
import "./add-comment-popup.css";

interface AddCommentPopupProps {
    handleCancelAddComment: () => void;
    handleAddComment: (content: string) => void;
}

export const AddCommentPopup = ({ handleCancelAddComment, handleAddComment }: AddCommentPopupProps) => {
    const [content, setContent] = useState("");

    const handleSubmitComment = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddComment(content);
    };

    return (
        <div className="popupOverlay">
            <div className="addCommentPopup">
                <div className="popupTitle">Add your comment</div>
                <form className="popupContent" onSubmit={handleSubmitComment}>
                    <textarea
                        className="comment-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="popupButtons" id="buttonsAddComment">
                        <button onClick={handleCancelAddComment} type="button" className="cancelAddCommentButton">Cancel</button>
                        <button type="submit" className="confirmAddCommentButton">Add Comment</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
