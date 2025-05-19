import React, {useState} from "react";
import "./searchbar.css";

import { FaSearch } from "react-icons/fa";

interface SearchbarProps {
    setSearchText?: (text: string) => void;
}

const SearchBar: React.FC<SearchbarProps> = ({ setSearchText }) => {
    const [search, setSearch] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchText = e.currentTarget.value;
        setSearch(newSearchText);
        if (setSearchText) {
            setSearchText(newSearchText);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (setSearchText) {
            setSearchText(search);
        }
    };

    return (
        <form className="search-bar" onSubmit={handleSearchSubmit}>
            <input
                type="text"
                placeholder="Search..."
                className="search-input"
                value={search}
                onChange={handleInputChange}
            />
            <button type="submit" className="search-button">
                <FaSearch className="search-icon" />
            </button>
        </form>
    );
};

export default SearchBar;
