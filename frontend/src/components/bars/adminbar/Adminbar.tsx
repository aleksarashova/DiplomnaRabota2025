import React, {useEffect, useState} from "react";
import "./adminbar.css";

import { FcViewDetails } from "react-icons/fc";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";
import {getNumberOfPendingComments, getNumberOfPendingRecipes} from "./requests";
import {Link, useNavigate} from "react-router-dom";
import {validateJWT} from "../../pages/authCheck";

const Adminbar = () => {
    const [numberOfPendingRecipes, setNumberOfPendingRecipes] = useState<number>(0);
    const [numberOfPendingComments, setNumberOfPendingComments] = useState<number>(0);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {
            const token = sessionStorage.getItem("accessToken");
            const { isValid } = validateJWT(token);

            if (!isValid) {
                navigateTo("/login");
                return;
            }

            try {
                const numberRecipes = await getNumberOfPendingRecipes(token!);
                setNumberOfPendingRecipes(numberRecipes);
                const numberComments = await getNumberOfPendingComments(token!);
                setNumberOfPendingComments(numberComments);
            } catch (error) {
                console.error("Error getting categories:", error);

                if (error instanceof Error) {
                    if (error.message.includes("401")) {
                        navigateTo("/login");
                    }
                }
            }
        };

        fetchCategories().then();
    }, []);

    return (
        <div className="adminbar">
            <p className="adminbar-title"> <FcViewDetails className="to-do-list-icon"/> ADMINISTRATOR BOARD </p>
            <div className="admin-to-do-sections">
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> PENDING RECIPES
                    </p>
                    {numberOfPendingRecipes !== 0 && (
                        <p className="task-number">+ {numberOfPendingRecipes} new</p>
                    )}
                    <Link to="/admin/recipes" className="linkToRecipes">
                        <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                    </Link>
                </div>
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> PENDING COMMENTS
                    </p>
                    {numberOfPendingComments !== 0 && (
                        <p className="task-number">+ {numberOfPendingComments} new</p>
                    )}
                    <Link to="/admin/comments" className="linkToComments">
                        <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                    </Link>
                </div>
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> MANAGE
                        CATEGORIES </p>
                    <Link to="/admin/categories" className="linkToCategories">
                        <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                    </Link>
                </div>
                <div className="to-do-section">
                    <p className="admin-task-title"><MdOutlinePendingActions className="pending-icon"/> MANAGE
                        ROLES </p>
                    <Link to="/admin/roles" className="linkToRoles">
                        <p className="show-to-do"><FaLongArrowAltRight className="show-to-do-arrow"/>view</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Adminbar;