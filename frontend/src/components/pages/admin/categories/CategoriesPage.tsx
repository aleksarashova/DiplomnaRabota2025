import React, {useEffect, useState} from "react";
import "./categories.css";

import {addCategory, deleteCategory, getAllCategoriesForAdmin} from "../../../bars/adminbar/requests";

import { FaPlus } from "react-icons/fa";
import {AddCategoryPopup} from "../../../popups/actions/add-category/AddCategoryPopup";
import {useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";
import CategoryError from "../../../popups/errors/AddCategoryError";
import NotAdminError from "../../../popups/errors/NotAdminError";
import Header from "../../../sections/header/Header";

const CategoriesPage = () => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [visibilityAddCategoryPopup, setVisibilityAddCategoryPopup] = useState(false);
    const [visibilityCategoryErrorPopup, setVisibilityCategoryErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [notAdminErrorPopup, setNotAdminErrorPopup] = useState<boolean>(false);


    const navigateTo = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
            return;
        }

        setIsLoggedIn(true);

        if (role === "admin") {
            setIsAdmin(true);
        } else {
            setErrorMessage("Only admins can access this page.");
            setNotAdminErrorPopup(true);
        }

        const fetchCategories = async () => {
            try {
                const categories = await getAllCategoriesForAdmin(token!);
                setCategories(categories);
            } catch (error) {
                console.error("Error getting categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityCategoryErrorPopup(true);
    }

    const handleCloseCategoryError = () => {
        setVisibilityCategoryErrorPopup(false);
    }

    const handleCloseNotAdminError = () => {
        setNotAdminErrorPopup(false);
        navigateTo("/");
    }

    const handleAddCategory = async(category: string) => {
        const token = localStorage.getItem("accessToken");
        const { isValid} = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await addCategory(category, token!);

            console.log("Backend Response:", data);
            setVisibilityAddCategoryPopup(false);
            window.location.reload();
        } catch (error) {
            console.error("Error during adding category:", error);

            if (error instanceof Error) {
                if (error.message.includes("401")) {
                    navigateTo("/login");
                } else {
                    handleInvalidInput(error.message);
                }
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    const handleCancelAddCategory = () => {
        setVisibilityAddCategoryPopup(false);
    }

    const handleDeleteCategory = async(category: string) => {
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            await deleteCategory(category, token!);
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
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false} />
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

            {visibilityCategoryErrorPopup && (
                <CategoryError
                    handleCloseError={handleCloseCategoryError}
                    errorContent={errorMessage}
                />
            )}

            {notAdminErrorPopup && (
                <NotAdminError
                    handleCloseError={handleCloseNotAdminError}
                    errorContent={errorMessage} />
            )}
        </div>
    );
}

export default CategoriesPage;