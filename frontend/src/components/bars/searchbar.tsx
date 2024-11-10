import React from 'react';

import { FaSearch } from "react-icons/fa";

const SearchBar = () => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search..." className="search-input"/>
            <button type="submit" className="search-button">
                <FaSearch className="search-icon"/>
            </button>
        </div>
    );
}

export default SearchBar;
