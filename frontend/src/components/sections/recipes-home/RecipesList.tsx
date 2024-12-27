import React, { useEffect, useState } from "react";
import "./recipes.css";

import { getAllApprovedRecipes } from "./requests";
import { Recipe } from "./types";

import { Link } from "react-router-dom";
import FoodImage from "../../images/altImage.png";
import { FaComment, FaHeart } from "react-icons/fa";
import {validateJWT} from "../../pages/authCheck";

interface RecipesListProps {
    selectedCategory: string | null;
}

const RecipesList: React.FC<RecipesListProps> = ({ selectedCategory }) => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const isValid = token && validateJWT(token);
        setIsLoggedIn(!!isValid);

        const fetchRecipes = async () => {
            try {
                const recipesData = await getAllApprovedRecipes();
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error getting recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    const filteredRecipes = recipes
        ? selectedCategory
            ? recipes.filter((recipe) => recipe.category === selectedCategory)
            : recipes
        : [];

    return (
        <div className="recipes-list-section">
            {isLoggedIn && (
                <Link to="/add-recipe" className="link-for-recipe-creation">
                    <p className="recipe-creation-caption">
                        Create your own recipe here
                    </p>
                </Link>
            )}
            <div className="recipes-list">
                {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((recipe) => (
                        <div key={recipe.id} className="recipe">
                            <Link to={`/singleview/${recipe.id}`} className="recipeLink">
                                <img
                                    src={FoodImage}
                                    alt={recipe.title}
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
                    ))
                ) : (
                    <p className="noRecipesMessage">No recipes available. Please check back later!</p>
                )}
            </div>
        </div>
    );
};

export default RecipesList;