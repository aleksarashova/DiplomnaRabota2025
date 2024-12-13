import React from 'react';
import "./header.css";

import NavbarLoggedIn from "../../bars/navbars/NavbarLoggedIn";

const Header = () => {
    return (
        <div className="header">
            <h1 className="siteTitle">CookeryPlace</h1>
            <NavbarLoggedIn />
        </div>
    );
}

export default Header;

