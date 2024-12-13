import React, { useState, useEffect } from "react";
import "./sidebar.css";

import { getAllCategories } from "./requests";

const Sidebar = () => {
    const [categories, setCategories] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategories();
                setCategories(categories);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        }

        fetchCategories();
    }, []);

    return (
        <nav className="sidebar">
            <p className="categoriesTitle">CATEGORIES</p>
            <ul className="category-list">
                {categories &&
                    categories.map((category) => (
                        <li key={category} className="category">
                            <button className="categoryButton">{category}</button>
                        </li>
                    ))}
            </ul>
        </nav>
    );
};

export default Sidebar;