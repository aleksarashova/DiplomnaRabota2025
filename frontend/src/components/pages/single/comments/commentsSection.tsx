import React, { useState } from "react";
import "./comments.css";

import { CgProfile } from "react-icons/cg";
import { MdAddComment } from "react-icons/md";
import { FaReply } from "react-icons/fa";

import {Link, useParams} from "react-router-dom";
import { AddCommentPopup } from "../../../popups/actions/add-comment/addCommentPopup";
import AddCommentMessage from "../../../popups/messages/addCommentMessage";

import {useNavigate} from "react-router-dom";
import {addComment} from "./requests";
import CommentError from "../../../popups/errors/AddCommentError";
import {RecipeData} from "../singlepage/types";
import {validateJWT} from "../../authCheck";
import {ReplyToCommentPopup} from "../../../popups/actions/add-comment/replyToCommentPopup";

type CommentsInfoProps = {
    recipeData: RecipeData | null;
};

const CommentsSection = ({recipeData}: CommentsInfoProps) => {
    const comments = recipeData?.comments;
    const approvedComments = comments?.filter((comment) => comment.is_approved);

    const [visibilityAddCommentPopup, setVisibilityAddCommentPopup] = useState(false);
    const [visibilityReplyToCommentPopup, setVisibilityReplyToCommentPopup] = useState(false);
    const [visibilityAddCommentMessage, setVisibilityAddCommentMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [visibilityCommentErrorPopup, setVisibilityCommentErrorPopup] = useState(false);

    const [replyToCurrent, setReplyToCurrent] = useState<string | null>(null);

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityCommentErrorPopup(true);
    }

    const handleCloseCommentError = () => {
        setVisibilityCommentErrorPopup(false);
    }

    const {recipeId} = useParams();

    if (!recipeId) {
        console.error("No recipe id is found in the url.");
    }

    const handleAddComment = async (content: string, reply_to: string | null) => {
        const token = sessionStorage.getItem("accessToken");
        const {isValid} = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await addComment(content, token!, recipeId || "", reply_to);

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

    const handleCancelReplyToComment = () => {
        setVisibilityReplyToCommentPopup(false);
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
                    <MdAddComment className="addCommentIcon"/>
                </button>
            </div>
            <div className="comments">
                {approvedComments?.map((comment, index) => {
                    const isReply = comment.reply_to !== "";
                    console.log(comment.reply_to);
                    return (
                        <div key={index} className={`comment ${isReply ? "replyComment" : ""}`}>
                            {isReply && (
                                <div className="replyingToText">
                                    Replying to <b>{comment.reply_to}</b>
                                </div>
                            )}

                            <div className="commentAuthor-commentDate-Single">
                                <div className="commentAuthor">
                                    <Link to={`/profile/${comment.author.username}`} className="profileLinkComments">
                                        <CgProfile className="profileIcon"/>
                                        {comment.author.username}
                                    </Link>
                                </div>
                                <div className="commentDate">{comment.date}</div>
                            </div>

                            <div className="commentContent">{comment.content}</div>

                            <div>
                                <button
                                    onClick={() => {
                                        setReplyToCurrent(comment.id);
                                        setVisibilityReplyToCommentPopup(true);
                                    }}
                                    className="replyToCommentButton"
                                >
                                    <FaReply/>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {visibilityAddCommentPopup && (
                <AddCommentPopup
                    handleCancelAddComment={handleCancelAddComment}
                    handleAddComment={handleAddComment}
                />
            )}
            {visibilityReplyToCommentPopup && (
                <ReplyToCommentPopup
                    handleCancelAddComment={handleCancelReplyToComment}
                    handleAddComment={handleAddComment}
                    reply_to={replyToCurrent}
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