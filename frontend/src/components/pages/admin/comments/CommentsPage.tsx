import React, {useEffect, useState} from "react";

import {Link, useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";
import {approveComment, getAllUnapprovedComments, rejectComment} from "./requests";
import {Comment} from "./types";

const CommentsPage = () => {
    const [comments, setComments] = useState<Comment[] | null>(null);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchComments = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);

            if (!isValid) {
                navigateTo("/login");
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

    const handleApproveComment = async(commentId: string) => {
        const token = localStorage.getItem("accessToken");
        const isValid = token && validateJWT(token);

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
        const isValid = token && validateJWT(token);

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
            <p className="commentsTitleAdmin">PENDING COMMENTS</p>
            <div className="comments-list">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => {
                        return (
                            <div key={comment.id} className="comment">
                                <div className="commentInfo">
                                    <Link to={`/profile/${comment.author}`}>
                                        <p className="commentAuthor">{comment.author}</p>
                                        <p className="commentContent">{comment.content}</p>
                                    </Link>
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
        </div>
    );
}

export default CommentsPage;