import React, {useEffect, useState} from "react";
import "./recipespage.css";

import {Recipe} from "../../../sections/recipes-home/types";
import {Link, useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";
import {approveRecipe, getAllUnapprovedRecipes, rejectRecipe} from "./requests";
import FoodImage from "../../../images/altImage.png";
import {FaComment, FaHeart} from "react-icons/fa";
import Header from "../../../sections/header/Header";
import NotAdminError from "../../../popups/errors/NotAdminError";

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [notAdminErrorPopup, setNotAdminErrorPopup] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = sessionStorage.getItem("accessToken");
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

            try {
                const recipesData = await getAllUnapprovedRecipes(token!);
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error getting recipes:", error);
                setRecipes([]);
            }
        };

        fetchRecipes();
    }, []);

    const handleCloseNotAdminError = () => {
        setNotAdminErrorPopup(false);
        navigateTo("/");
    }

    const handleApproveRecipe = async(recipeId: string) => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            await approveRecipe(token!, recipeId);
            window.location.reload();
        } catch (error) {
            console.error("Error approving recipe:", error);
        }
    }

    const handleRejectRecipe = async(recipeId: string) => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            await rejectRecipe(token!, recipeId);
            window.location.reload();
        } catch (error) {
            console.error("Error rejecting recipe:", error);
        }
    }

    return (
        <div className="admin-page-recipes">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false} />
            <p className="recipesTitleAdmin">PENDING RECIPES</p>
            <div className="recipes-list" id="recipes-list-admin-page">
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => {
                        const recipeImagePath = recipe.image ? `${process.env.REACT_APP_BASE_URL_IMAGES}${recipe.image}` : FoodImage;
                        console.log(recipeImagePath);

                        return (
                            <div key={recipe.id} className="recipe" id="recipe-admin-page">
                                <Link to={`/singleview/${recipe.id}`} className="recipeLink">
                                    <img
                                        src={recipeImagePath}
                                        alt="No photo"
                                        className="recipeImage"
                                    />
                                </Link>
                                <div className="basicInfo">
                                    <p className="recipeAuthor">{recipe.author}</p>
                                    <p className="dateOfPosting">{recipe.date}</p>
                                </div>
                                <div className="recipeCategoryHome">{recipe.category}</div>
                                <Link to={`/singleview/${recipe.id}`} className="recipeLink">
                                    <h1 className="recipeTitle">{recipe.title}</h1>
                                </Link>
                                <div className="likes-comments-home">
                                    <div>
                                        <FaHeart /> {recipe.likes}
                                    </div>
                                    <div>
                                        <FaComment /> {recipe.comments}
                                    </div>
                                </div>
                                <div className="approve-reject-buttons">
                                    <button onClick={() => handleApproveRecipe(recipe.id)} id="approve-button">APPROVE</button>
                                    <button onClick={() => handleRejectRecipe(recipe.id)} id="reject-button">REJECT</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="noRecipesMessage">No recipes available. Please check back later!</p>
                )}
            </div>
            {notAdminErrorPopup &&(
              <NotAdminError
                  handleCloseError={handleCloseNotAdminError}
                  errorContent={errorMessage}  />
            )}
        </div>
    );
}

export default RecipesPage;