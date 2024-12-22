import React, { useState } from "react";
import "./comments.css";

import { CgProfile } from "react-icons/cg";
import { MdAddComment } from "react-icons/md";

import {Link, useParams} from "react-router-dom";
import { AddCommentPopup } from "../../../popups/actions/add-comment/addCommentPopup";
import AddCommentMessage from "../../../popups/messages/addCommentMessage";

import {useNavigate} from "react-router-dom";
import {addComment} from "./requests";
import CommentError from "../../../popups/errors/AddCommentError";
import {RecipeData} from "../singlepage/types";

type CommentsInfoProps = {
    recipeData: RecipeData | null;
};

const CommentsSection = ({recipeData}: CommentsInfoProps) => {
    const comments = recipeData?.comments;

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

    const { recipeId } = useParams();

    if(!recipeId) {
        console.error("No recipe id is found in the url.");
    }

    const handleAddComment = async (content: string) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        try {
            const data = await addComment(content, accessToken, recipeId || "");

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
        window.location.reload();
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
                    comments?.map((comment, index) => (
                        <div key={index} className="comment">
                            <div className="commentAuthor-commentDate-Single">
                                <div className="commentAuthor">
                                    <Link to="/profile" className="profileLinkComments">
                                        <CgProfile className="profileIcon" />
                                        {comment.author.username}
                                    </Link>
                                </div>
                                <div className="commentDate">{comment.date}</div>
                            </div>
                            <div className="commentContent">{comment.content}</div>
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