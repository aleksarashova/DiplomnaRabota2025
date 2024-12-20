import React, { useState } from "react";
import "./comments.css";

import { CgProfile } from "react-icons/cg";
import { MdAddComment } from "react-icons/md";

import { Link } from "react-router-dom";
import { AddCommentPopup } from "../../../popups/actions/add-comment/addCommentPopup";
import AddCommentMessage from "../../../popups/messages/addCommentMessage";

import {useNavigate} from "react-router-dom";

const CommentsSection = () => {
    //vzimame gi ot bazata
    const comments = [
        "lajdb",
        "qoufweifbw",
        "qqffqbqefwq"
    ];

    const [visibilityAddCommentPopup, setVisibilityAddCommentPopup] = useState(false);
    const [visibilityAddCommentMessage, setVisibilityAddCommentMessage] = useState(false);

    const navigateTo = useNavigate();

    const handleAddComment = (content: string) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        fetch("http://localhost:8000/api/comments/add-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content }),
        })
            .then((response) => {
                console.log("Response status:", response.status);
                if(response.status === 401) {
                    navigateTo("/login");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Backend Response:", data);

                if (!data || !data.message) {
                    console.error("Unexpected response data:", data);
                    return;
                }

                setVisibilityAddCommentPopup(false);
                setVisibilityAddCommentMessage(true);
            })
            .catch((error) => {
                console.error("Error:", error.message);
            });
    };

    const handleCancelAddComment = () => {
        setVisibilityAddCommentPopup(false);
    };

    const handleCloseAddCommentMessage = () => {
        setVisibilityAddCommentMessage(false);
    };

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
        </div>
    );
};

export default CommentsSection;