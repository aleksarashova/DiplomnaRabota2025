import React, {useEffect, useState} from "react";
import "./categories.css";

import {addCategory, getAllCategoriesForAdmin} from "../../bars/adminbar/requests";

import { FaPlus } from "react-icons/fa";
import {AddCategoryPopup} from "../../popups/actions/add-category/AddCategoryPopup";
import {useNavigate} from "react-router-dom";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [visibilityAddCategoryPopup, setVisibilityAddCategoryPopup] = useState(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAllCategoriesForAdmin();
                setCategories(categories);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async(category: string) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        try {
            const data = await addCategory(category);

            console.log("Backend Response:", data);
            setVisibilityAddCategoryPopup(false);
        } catch (error) {
            console.error("Error during adding category:", error);
        }
    }

    const handleCancelAddCategory = () => {
        setVisibilityAddCategoryPopup(false);
    }

    return (
        <div className="admin-page-categories">
            <div className="categoriesSection">
                <p className="categoriesTitleAdmin">CATEGORIES</p>
                {categories &&
                    categories.map((category) => (
                        <div key={category} className="category-admin-page">
                            <p className="categoryValue"> {category} </p>
                            <button className="deleteCategoryButton">DELETE</button>
                        </div>
                    ))}
                <p onClick={() => setVisibilityAddCategoryPopup(true)} className="addNewCategory"><FaPlus /> Add new</p>
            </div>
            {visibilityAddCategoryPopup && (
                <AddCategoryPopup
                    handleCancelAddCategory={handleCancelAddCategory}
                    handleAddCategory={handleAddCategory}
                />
            )}
        </div>
    );
}

export default CategoriesPage;