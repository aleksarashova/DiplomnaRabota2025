import React, { useState } from "react";
import "./comments.css";

import { CgProfile } from "react-icons/cg";
import { MdAddComment } from "react-icons/md";

import { Link } from "react-router-dom";
import { AddCommentPopup } from "../../../popups/actions/add-comment/addCommentPopup";
import AddCommentMessage from "../../../popups/messages/addCommentMessage";

import {useNavigate} from "react-router-dom";
import {addComment} from "./requests";
import CommentError from "../../../popups/errors/AddCommentError";


const CommentsSection = () => {
    //vzimame gi ot bazata
    const comments = [
        "lajdb",
        "qoufweifbw",
        "qqffqbqefwq"
    ];

    const [visibilityAddCommentPopup, setVisibilityAddCommentPopup] = useState(false);
    const [visibilityAddCommentMessage, setVisibilityAddCommentMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visibilityCommentErrorPopup, setVisibilityCommentErrorPopup] = useState(false);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityCommentErrorPopup(true);
    }

    const handleCloseCommentError = () => {
        setVisibilityCommentErrorPopup(false);
    }

    const handleAddComment = async (content: string) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        try {
            const data = await addComment(content, accessToken);

            console.log("Backend Response:", data);

            setVisibilityAddCommentPopup(false);
            setVisibilityAddCommentMessage(true);
        } catch (error) {
            console.error("Error during adding comment:", error);

            if (error instanceof Error) {
                if (error.message.includes("401")) {
                    navigateTo("/login");
                } else {
                    handleInvalidInput(error.message);
                }
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    const handleCancelAddComment = () => {
        setVisibilityAddCommentPopup(false);
    }

    const handleCloseAddCommentMessage = () => {
        setVisibilityAddCommentMessage(false);
    }

    return (
        <div className="commentsWrapper">
            <div className="commentsTitle-addYours">
                <div className="commentsSectionTitle">COMMENTS</div>
                <button onClick={() => setVisibilityAddCommentPopup(true)} className="addCommentButton">
                    <MdAddComment className="addCommentIcon" />
                </button>
            </div>
            <div className="comments">
                {
                    comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="commentAuthor-commentDate-Single">
                                <div className="commentAuthor">
                                    <Link to="/profile" className="profileLinkComments">
                                        <CgProfile className="profileIcon" /> Aleksa Rashova
                                    </Link>
                                </div>
                                <div className="commentDate">03-12-2024</div>
                            </div>
                            <div className="commentContent">{comment}</div>
                        </div>
                    ))
                }
            </div>
            {visibilityAddCommentPopup && (
                <AddCommentPopup
                    handleCancelAddComment={handleCancelAddComment}
                    handleAddComment={handleAddComment}
                />
            )}
            {visibilityAddCommentMessage && (
                <AddCommentMessage
                    handleCloseMessage={handleCloseAddCommentMessage}
                />
            )}

            {visibilityCommentErrorPopup && (
                <CommentError
                    handleCloseError={handleCloseCommentError}
                    errorContent={errorMessage}
                />
            )}
        </div>
    );
}

export default CommentsSection;