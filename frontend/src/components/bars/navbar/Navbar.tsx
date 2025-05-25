import React, {useEffect, useState} from "react";
import "./navbar.css";

import {Link, useNavigate} from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiAdminFill } from "react-icons/ri";
import { MdNotificationsActive } from "react-icons/md";

import SearchBar from "../searchbar/searchbar";
import Notificationbar from "../notificationbar/Notificationbar";
import {validateJWT} from "../../pages/authCheck";

interface NavbarProps {
    isLoggedIn: boolean;
    isAdmin: boolean;
    isProfilePage: boolean;
    isHomePage: boolean;
    setSearchText?: (text: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, isAdmin, isProfilePage, isHomePage, setSearchText }) => {
    const [visibilityNotificationBar, setVisibilityNotificationBar] = useState<boolean>(() => {
        return JSON.parse(sessionStorage.getItem("notificationBarVisibility") || "false");
    });
    const navbarClass = isHomePage
        ? "navbar-home"
        : "navbar-home navbar-default";

    const navigateTo = useNavigate();

    useEffect(() => {
        sessionStorage.setItem("notificationBarVisibility", JSON.stringify(visibilityNotificationBar));
    }, [visibilityNotificationBar]);

    const handleLogOut = async() => {
        sessionStorage.setItem("notificationBarVisibility", "false");
        sessionStorage.removeItem("accessToken");
    }

    const handleNotificationClick = () => {
        const token = sessionStorage.getItem("accessToken");
        if(!token) {
            sessionStorage.setItem("notificationBarVisibility", "false");
            setTimeout(() => navigateTo("/login"), 0);
            return;
        }

        const isValid = validateJWT(token);
        if (!isValid) {
            navigateTo("/login");
            return;
        } else {
            setVisibilityNotificationBar(!visibilityNotificationBar);
        }
    }

    return (
        <div>
        <nav className={navbarClass}>
            {isHomePage && (
                <div className="search-bar-nav">
                    <SearchBar setSearchText={setSearchText}/>
                </div>
            )}

            <ul className="nav-list">
                <li>
                    <Link to="/" className="link">
                        <div className="icon-box-nav">
                            <FaHome className="icon-nav" />
                        </div>
                    </Link>
                </li>

                {isAdmin && isLoggedIn && (
                    <li>
                        <Link to="/admin" className="link">
                            <div className="icon-box-nav">
                                <RiAdminFill className="icon-nav" />
                            </div>
                        </Link>
                    </li>
                )}

                {isLoggedIn && !isProfilePage && (
                    <li>
                        <Link to="/myProfile" className="link">
                            <div className="icon-box-nav">
                                <CgProfile className="icon-nav" />
                            </div>
                        </Link>
                    </li>
                )}

                {!isLoggedIn && (
                    <>
                        <li>
                            <Link to="/login" className="link">
                                <div className="icon-box-nav">
                                    <IoMdLogIn className="icon-nav"/>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="link">
                                <div className="icon-box-nav-last">
                                    <MdAppRegistration className="icon-nav"/>
                                </div>
                            </Link>
                        </li>
                    </>
                )}

                {isLoggedIn && (
                    <li>
                        <Link to="#" onClick={handleNotificationClick} className="link">
                            <div className="icon-box-nav-last">
                                <MdNotificationsActive className="icon-nav"/>
                            </div>
                        </Link>
                        <Link to="/login" onClick={handleLogOut} className="link">
                            <div className="icon-box-nav-last">
                                <IoMdLogOut className="icon-nav"/>
                            </div>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
            {visibilityNotificationBar && <Notificationbar visibility={true} />}
        </div>
    );
};

export default Navbar;