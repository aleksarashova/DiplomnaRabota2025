import React, {useEffect, useState} from "react";
import "./recipespage.css";

import {Recipe} from "../../../sections/recipes-home/types";
import {Link, useNavigate} from "react-router-dom";
import {validateJWT} from "../../authCheck";
import {getAllUnapprovedRecipes} from "./requests";
import FoodImage from "../../../images/altImage.png";
import {FaComment, FaHeart} from "react-icons/fa";

const RecipesPage = () => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);

            if (!isValid) {
                navigateTo("/login");
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

    return (
        <div className="admin-page-recipes">
            <p className="recipesTitleAdmin">PENDING RECIPES</p>
            <div className="recipes-list" id="recipes-list-admin-page">
                {recipes && recipes.length > 0 ? (
                    recipes.map((recipe) => {
                        const recipeImagePath = recipe.image ? `http://localhost:8000${recipe.image}` : FoodImage;
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
                                    <button id="approve-button">APPROVE</button>
                                    <button id="reject-button">REJECT</button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="noRecipesMessage">No recipes available. Please check back later!</p>
                )}
            </div>
        </div>
    );
}

export default RecipesPage;