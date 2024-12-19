import React, { useEffect, useState } from "react";
import "./recipes.css";

import { getAllRecipes } from "./requests";
import { Recipe } from "./types";

import { Link } from "react-router-dom";
import FoodImage from "../../images/altFoodImage.png";
import { FaComment, FaHeart } from "react-icons/fa";

const RecipesList: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const recipesData = await getAllRecipes();
                setRecipes(recipesData);
            } catch (error) {
                console.error("Error getting recipes:", error);
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div className="recipes-list">
            {recipes && recipes.length > 0 ? (
                recipes.map((recipe) => (
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
    );
}

export default RecipesList;
