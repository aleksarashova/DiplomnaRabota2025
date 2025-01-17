import React, { useState, useEffect } from "react";
import "./sidebar.css";

import { getAllCategories } from "./requests";
import {validateJWT} from "../../pages/authCheck";
import {useNavigate} from "react-router-dom";

interface SidebarProps {
    setSelectedCategory: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedCategory }) => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const navigateTo = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories(token!);
                setCategories(categories);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category: string | null) => {
        setSelectedCategory(category);
        setActiveCategory(category);
    };

    return (
        <nav className="sidebar">
            <p className="categoriesTitle">CATEGORIES</p>
            <ul className="category-list">
                <li key="all" className="category">
                    <button
                        onClick={() => handleCategoryClick(null)}
                        className={`categoryButton ${activeCategory === null ? "active" : ""}`}
                    >
                        ALL
                    </button>
                </li>
                {categories &&
                    categories.map((category) => (
                        <li key={category} className="category">
                            <button
                                onClick={() => handleCategoryClick(category)}
                                className={`categoryButton ${activeCategory === category ? "active" : ""}`}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
            </ul>
        </nav>
    );
}

export default Sidebar;
