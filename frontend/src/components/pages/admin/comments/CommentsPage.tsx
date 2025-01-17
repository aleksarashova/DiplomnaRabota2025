import React, {useEffect, useState} from "react";
import "./commentspage.css";

import {Link, useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";
import {approveComment, getAllUnapprovedComments, rejectComment} from "./requests";
import {Comment} from "./types";
import Header from "../../../sections/header/Header";
import NotAdminError from "../../../popups/errors/NotAdminError";

const CommentsPage = () => {
    const [comments, setComments] = useState<Comment[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [notAdminErrorPopup, setNotAdminErrorPopup] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            const token = localStorage.getItem("accessToken");
            const { isValid, role } = validateJWT(token);

            if (!isValid) {
                navigateTo("/login");
                return;
            }

            setIsLoggedIn(true);

            if (role === "admin") {
                setIsAdmin(true);
            } else {
                setErrorMessage("Only admins can access this page.");
                setNotAdminErrorPopup(true);
            }

            try {
                const commentsData = await getAllUnapprovedComments(token!);
                setComments(commentsData);
            } catch (error) {
                console.error("Error getting comments:", error);
                setComments([]);
            }
        };

        fetchComments();
    }, []);

    const handleCloseNotAdminError = () => {
        setNotAdminErrorPopup(false);
        navigateTo("/");
    }

    const handleApproveComment = async(commentId: string) => {
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            await approveComment(token!, commentId);
            window.location.reload();
        } catch (error) {
            console.error("Error approving comment:", error);
        }
    }

    const handleRejectComment = async(commentId: string) => {
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }
        try {
            await rejectComment(token!, commentId);
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting comment:", error);
        }
    }

    return (
        <div className="admin-page-comments">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false} />
            <p className="commentsTitleAdmin">PENDING COMMENTS</p>
            <div className="comments-list">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => {
                        return (
                            <div key={comment.id} className="commentAdminPage">
                                <div className="commentInfo">
                                    <Link to={`/profile/${comment.author}`} className="linkToCommentAuthorAdmin">
                                        <p className="commentAuthor">{comment.author}</p>
                                    </Link>
                                    <p className="commentContent">{comment.content}</p>
                                </div>
                                <div className="approve-reject-buttons">
                                    <button onClick={() => handleApproveComment(comment.id)} id="approve-button">APPROVE</button>
                                    <button onClick={() => handleRejectComment(comment.id)} id="reject-button">REJECT</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="noCommentsMessage">No comments available. Please check back later!</p>
                )}
            </div>

            {notAdminErrorPopup && (
                <NotAdminError
                    handleCloseError={handleCloseNotAdminError}
                    errorContent={errorMessage} />
            )}
        </div>
    );
}

export default CommentsPage;