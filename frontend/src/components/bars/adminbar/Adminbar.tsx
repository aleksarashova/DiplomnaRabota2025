import React, {useEffect, useState} from "react";
import "./adminbar.css";

import { FcViewDetails } from "react-icons/fc";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import {getAllCategories} from "../sidebar/requests";
import {getNumberOfPendingComments, getNumberOfPendingRecipes} from "./requests";
import {useNavigate} from "react-router-dom";

const Adminbar = () => {
    const [numberOfPendingRecipes, setNumberOfPendingRecipes] = useState<number>(0);
    const [numberOfPendingComments, setNumberOfPendingComments] = useState<number>(0);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('No access token found.');
                navigateTo('/login');
                return;
            }

            try {
                const numberRecipes = await getNumberOfPendingRecipes(accessToken);
                setNumberOfPendingRecipes(numberRecipes);
                const numberComments = await getNumberOfPendingComments(accessToken);
                setNumberOfPendingComments(numberComments);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="adminbar">
            <p className="adminbar-title"> <FcViewDetails className="to-do-list-icon"/> ADMINISTRATOR BOARD </p>
            <div className="admin-to-do-sections">
                <div className="to-do-section">
                    <p className="admin-task-title"> <MdOutlinePendingActions className="pending-icon"/> PENDING RECIPES </p>
                    <p className="task-number">+ 23 new</p>
                    <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                </div>
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> PENDING COMMENTS</p>
                    <p className="task-number">+ 18 new</p>
                    <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                </div>
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> MANAGE CATEGORIES </p>
                    <p className="show-to-do-categories"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                </div>
            </div>
        </div>
    );
};

export default Adminbar;