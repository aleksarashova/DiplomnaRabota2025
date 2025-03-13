import React, { useState } from 'react';
import "../../common.css";
import "./add-reply-to-comment-popup.css";

interface ReplyToCommentPopupProps {
    handleCancelAddComment: () => void;
    handleAddComment: (content: string, reply_to: string | null) => void;
    reply_to: string | null;
}

export const ReplyToCommentPopup = ({ handleCancelAddComment, handleAddComment, reply_to }: ReplyToCommentPopupProps) => {
    const [content, setContent] = useState("");

    const handleSubmitComment = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddComment(content, reply_to);
    };

    return (
        <div className="popupOverlay">
            <div className="addCommentPopup">
                <div className="popupTitle">Reply to comment</div>
                <form className="popupContent" onSubmit={handleSubmitComment}>
                    <textarea
                        className="comment-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="popupButtons" id="buttonsAddComment">
                        <button onClick={handleCancelAddComment} type="button" className="cancelAddCommentButton">Cancel</button>
                        <button type="submit" className="confirmAddCommentButton">Reply</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
