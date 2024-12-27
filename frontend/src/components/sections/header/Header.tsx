import React from 'react';
import "./header.css";

import Navbar from "../../bars/navbar/Navbar";

interface NavbarProps {
    isLoggedIn: boolean;
    isProfilePage: boolean;
    isHomePage: boolean;
    setSearchText?: (text: string) => void;
}

const Header: React.FC<NavbarProps> = ({ isLoggedIn, isProfilePage, isHomePage, setSearchText }) => {

    return (
        <div className="header">
            { isHomePage &&
                <h1 className="siteTitle">CookeryPlace</h1>
            }
            <Navbar isLoggedIn={isLoggedIn} isProfilePage={isProfilePage} isHomePage={isHomePage} setSearchText={setSearchText} />
        </div>
    );
}

export default Header;

