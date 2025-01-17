import React from "react";
import "./navbar.css";

import {Link} from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiAdminFill } from "react-icons/ri";

import SearchBar from "../searchbar/searchbar";

interface NavbarProps {
    isLoggedIn: boolean;
    isAdmin: boolean;
    isProfilePage: boolean;
    isHomePage: boolean;
    setSearchText?: (text: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, isAdmin, isProfilePage, isHomePage, setSearchText }) => {
    const navbarClass = isHomePage
        ? "navbar-home"
        : "navbar-home navbar-default";

    const handleLogOut = () => {
        localStorage.removeItem("accessToken");
    }

    return (
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
                                    <IoMdLogIn className="icon-nav" />
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="link">
                                <div className="icon-box-nav-last">
                                    <MdAppRegistration className="icon-nav" />
                                </div>
                            </Link>
                        </li>
                    </>
                )}

                {isLoggedIn && (
                    <li>
                        <Link to="/login" onClick={handleLogOut} className="link">
                            <div className="icon-box-nav-last">
                                <IoMdLogOut className="icon-nav" />
                            </div>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;