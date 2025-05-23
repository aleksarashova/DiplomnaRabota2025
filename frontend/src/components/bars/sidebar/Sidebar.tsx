import React, { useState, useEffect } from "react";
import "./sidebar.css";

import { getAllCategories } from "./requests";

interface SidebarProps {
    setSelectedCategory: (category: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedCategory }) => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {
            try {
                const categories = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        };

        fetchCategories(). then();
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
