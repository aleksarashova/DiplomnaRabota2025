import React, { useEffect, useState } from "react";
import "./recipes.css";

import { getAllApprovedRecipes } from "./requests";
import { Recipe } from "./types";

import {Link, useLocation} from "react-router-dom";
import FoodImage from "../../images/altImage.png";
import { FaComment, FaHeart } from "react-icons/fa";
import { validateJWT } from "../../pages/authCheck";
import { TiDocumentAdd } from "react-icons/ti";
import { MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

interface RecipesListProps {
    selectedCategory?: string | null;
    searchText?: string;
    recipesOf?: string;
    likedBy?: string;
    favouritesOf?: string;
}

const RecipesList: React.FC<RecipesListProps> = ({ selectedCategory, searchText = "", recipesOf, likedBy, favouritesOf }: RecipesListProps) => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const location = useLocation();
    const isHomePage = location.pathname === "/";

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = sessionStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);
            setIsLoggedIn(!!isValid);

            try {
                const recipesData = await getAllApprovedRecipes(selectedCategory, searchText, recipesOf, likedBy, favouritesOf);
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error getting recipes:", error);
                setRecipes([]);
            }
        };

        fetchRecipes().then();
    }, [selectedCategory, searchText]);

    return (
        <div className="recipes-list-section">
            {isLoggedIn && isHomePage && (
                <Link to="/add-recipe" className="link-for-recipe-creation">
                    <p className="recipe-creation-caption">
                        <MdOutlineKeyboardDoubleArrowRight className="arrow" />
                        Create your own recipe here
                        <MdOutlineKeyboardDoubleArrowLeft className="arrow" />
                    </p>
                </Link>
            )}
            <div className="recipes-list">
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => {
                        const recipeImagePath = recipe.image ? `${process.env.REACT_APP_BASE_URL_IMAGES}${recipe.image}` : FoodImage;
                        console.log(recipeImagePath);

                        return (
                            <div key={recipe.id} className="recipe">
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
                            </div>
                        );
                    })
                ) : (
                    <p className="noRecipesMessage">No recipes available. Please check back later!</p>
                )}
                {isLoggedIn && isHomePage && (
                    <Link to="/add-recipe">
                        <div className="add-recipe">
                            <TiDocumentAdd className="addRecipeIcon" />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default RecipesList;