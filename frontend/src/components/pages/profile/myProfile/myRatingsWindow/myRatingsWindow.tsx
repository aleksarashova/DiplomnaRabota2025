import React, {useEffect} from 'react';
import '../profilewindow.css';
import "./myratingswindow.css";

import {validateJWT} from "../../../authCheck";
import {getOverallRating} from "./requests";
import {useNavigate} from "react-router-dom";
import {FaStar} from "react-icons/fa";
import {FaRegStar} from "react-icons/fa6";

type MyRatingsWindowProps = {
    author: string;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyRatingsWindow: React.FC<MyRatingsWindowProps> = ({ author, close }) => {
    const [overallRating, setOverallRating] = React.useState<number>(0);
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);

            if (isValid) {
                try {
                    const averageRating = await getOverallRating(token, author);
                    setOverallRating(averageRating);
                } catch (error) {
                    console.error("Error fetching user data:", error);
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
                                    <FaStar className="star-form-filled-smaller"/>
                                ) : (
                                    <FaRegStar className="star-form-smaller"/>
                                )}
                            </span>
                    ))}
                </div>
                <button className="closeButtonProfileWindow" onClick={() => close(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default MyRatingsWindow;