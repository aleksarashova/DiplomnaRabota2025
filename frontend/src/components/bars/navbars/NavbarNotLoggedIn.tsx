import React from "react";
import "./navbar.css";

import { Link } from 'react-router-dom';

import { FaHome } from "react-icons/fa";
import { IoMdLogIn } from "react-icons/io";
import { MdAppRegistration } from "react-icons/md";

import SearchBar from "../searchbar/searchbar";

const NavbarNotLoggedIn = () => {
    return (
        <nav className="navbar">
            <div className="search-bar-nav">
                <SearchBar />
            </div>
            <ul className="nav-list">
                <li>
                    <Link to="/" className="link">
                        <div className="icon-box-nav"><FaHome className="icon-nav"/></div>
                    </Link>
                </li>
                <li>
                    <Link to="/login" className="link">
                        <div className="icon-box-nav"><IoMdLogIn className="icon-nav"/></div>
                    </Link>
                </li>
                <li>
                    <Link to="/register" className="link">
                        <div className="icon-box-nav-last"><MdAppRegistration className="icon-nav"/></div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavbarNotLoggedIn;