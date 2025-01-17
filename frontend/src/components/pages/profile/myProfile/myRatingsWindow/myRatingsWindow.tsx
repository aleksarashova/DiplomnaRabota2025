import React, {useEffect} from 'react';
import '../profilewindow.css';
import "./myratingswindow.css";

import {validateJWT} from "../../../authCheck";
import {getAllRatings, getOverallRating} from "./requests";
import {useNavigate} from "react-router-dom";
import {FaStar} from "react-icons/fa";
import {FaRegStar} from "react-icons/fa6";
import {UserRating} from "./types";
import {User} from "../../../admin/roles/types";

type MyRatingsWindowProps = {
    author: string;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyRatingsWindow: React.FC<MyRatingsWindowProps> = ({ author, close }) => {
    const [overallRating, setOverallRating] = React.useState<number>(0);
    const [ratings, setRatings] = React.useState<UserRating[]>([]);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);

            if (isValid) {
                try {
                    const averageRating = await getOverallRating(token, author);
                    setOverallRating(averageRating);
                    const userRatings = await getAllRatings(token, author);
                    setRatings(userRatings);
                } catch (error) {
                    console.error("Error fetching user ratings:", error);
                }
            } else {
                navigateTo("/login");
            }
        };

        fetchData();
    }, []);

    return (
        <div className="windowOverlay">
            <div className="windowContent">
                <p className="windowTitle">MY RATINGS</p>
                <div className="myRating">
                    <p className="overallRatingTitle">YOUR OVERALL RATING:  </p>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                            {overallRating >= star ? (
                                <FaStar className="star-form-filled"/>
                            ) : (
                                <FaRegStar className="star-form"/>
                            )}
                        </span>
                    ))}
                </div>
                <div className="myRatings">
                    <p className="myRatingsTitle">YOUR RATINGS:</p>
                    {ratings.length > 0 ? (
                        ratings.map((rating, index) => (
                            <div key={index} className="ratingRow">
                                <p className="ratingRater">{rating.rater}</p>
                                <div className="ratingStars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span key={star}>
                                            {rating.rating >= star ? (
                                                <FaStar className="star-form-filled-smaller"/>
                                            ) : (
                                                <FaRegStar className="star-form-smaller"/>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="noRatingsMessage">You have no ratings yet.</p>
                    )}
                </div>
                <button className="closeButtonProfileWindow" onClick={() => close(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default MyRatingsWindow;