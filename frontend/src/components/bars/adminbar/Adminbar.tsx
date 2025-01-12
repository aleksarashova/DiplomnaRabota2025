import React from "react";
import "./adminbar.css";

import { FcViewDetails } from "react-icons/fc";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaLongArrowAltRight } from "react-icons/fa";

const Adminbar = () => {

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