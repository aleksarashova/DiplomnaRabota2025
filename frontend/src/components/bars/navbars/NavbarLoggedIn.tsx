import React from "react";
import "./navbar.css";

import { Link } from 'react-router-dom';

import { FaHome } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";

import SearchBar from "../searchbar/searchbar";

const NavbarLoggedIn = () => {
    return (
        <nav className="navbar">
            <div className="search-bar-nav">
                <SearchBar/>
            </div>
            <ul className="nav-list">
                <li>
                    <Link to="/" className="link">
                        <div className="icon-box-nav"><FaHome className="icon-nav"/></div>
                    </Link>
                </li>
                <li>
                    <Link to="/myProfile" className="link">
                        <div className="icon-box-nav"><CgProfile className="icon-nav"/></div>
                    </Link>
                </li>
                <li>
                    <Link to="/login" className="link">
                        <div className="icon-box-nav-last"><IoMdLogOut className="icon-nav"/></div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavbarLoggedIn;