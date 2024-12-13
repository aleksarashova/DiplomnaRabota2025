import React from "react";
import "./navbar.css";

import { Link } from 'react-router-dom';

import { FaHome } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const NavbarForProfile = () => {
    return (
        <nav className="navbar" id="navbarForForms">
            <ul className="nav-list">
                <li>
                    <Link to="/" className="link">
                        <div className="icon-box-nav"><FaHome className="icon-nav"/></div>
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

export default NavbarForProfile;