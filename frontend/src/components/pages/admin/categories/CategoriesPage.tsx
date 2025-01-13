import React, {useEffect, useState} from "react";
import "./categories.css";

import {addCategory, deleteCategory, getAllCategoriesForAdmin} from "../../../bars/adminbar/requests";

import { FaPlus } from "react-icons/fa";
import {AddCategoryPopup} from "../../../popups/actions/add-category/AddCategoryPopup";
import {useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [visibilityAddCategoryPopup, setVisibilityAddCategoryPopup] = useState(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const isValid = accessToken && validateJWT(accessToken);

        if (!isValid) {
            navigateTo("/login");
        }

        const fetchCategories = async () => {
            try {
                const categories = await getAllCategoriesForAdmin(accessToken!);
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
            const data = await addCategory(category, accessToken);

            console.log("Backend Response:", data);
            setVisibilityAddCategoryPopup(false);
            window.location.reload();
        } catch (error) {
            console.error("Error during adding category:", error);

            if (error instanceof Error) {
                if (error.message.includes("401")) {
                    navigateTo("/login");
                }
            }
        }
    }

    const handleCancelAddCategory = () => {
        setVisibilityAddCategoryPopup(false);
    }

    const handleDeleteCategory = async(category: string) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        try {
            await deleteCategory(category, accessToken);
            window.location.reload();
        } catch (error) {
            console.error("Error during deleting category:", error);

            if (error instanceof Error) {
                if (error.message.includes("401")) {
                    navigateTo("/login");
                }
            }
        }
    }

    return (
        <div className="admin-page-categories">
            <div className="categoriesSection">
                <p className="categoriesTitleAdmin">CATEGORIES</p>
                {categories &&
                    categories.map((category) => (
                        <div key={category} className="category-admin-page">
                            <p className="categoryValue"> {category} </p>
                            <button onClick={() => handleDeleteCategory(category)} className="deleteCategoryButton">DELETE</button>
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