import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import SearchBar from "../searchbar/searchbar";
import "./navbar.css";

interface NavbarProps {
    isLoggedIn: boolean;
    isProfilePage: boolean;
    isHomePage: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, isProfilePage, isHomePage }) => {
    const navbarClass = isHomePage
        ? "navbar-home"
        : "navbar-home navbar-default";

    return (
        <nav className={navbarClass}>
            {isHomePage && (
                <div className="search-bar-nav">
                    <SearchBar />
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
                        <Link to="/logout" className="link">
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