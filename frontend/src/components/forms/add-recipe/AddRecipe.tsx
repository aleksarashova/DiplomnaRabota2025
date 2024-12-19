import React, { useEffect, useState } from 'react';
import "../form.css";
import "./add-recipe.css";

import { useNavigate } from "react-router-dom";

import RecipeCreationError from "../../popups/errors/RecipeCreationError";
import RecipeCreationSuccessfulMessage from "../../popups/messages/RecipeCreationSuccessfulMessage";

import {addRecipe, getAllCategories} from "./requests";
import {AddRecipeFormData} from "./types";
import {registerUser} from "../register/requests";

const AddRecipeForm = () => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [product, setProduct] = useState<string>("");
    const [step, setStep] = useState<string>("");
    const [products, setProducts] = useState<string[]>([]);
    const [steps, setSteps] = useState<string[]>([]);

    const [visibilityRecipeCreationErrorPopup, setVisibilityRecipeCreationErrorPopup] = useState(false);
    const [visibilitySuccessfulRecipeCreation, setVisibilitySuccessfulRecipeCreation] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigateTo = useNavigate();

    const handleInvalidInput = (message: string) => {
        setErrorMessage(message);
        setVisibilityRecipeCreationErrorPopup(true);
    }

    const handleCloseRecipeCreationError = () => {
        setVisibilityRecipeCreationErrorPopup(false);
    }

    const handleCloseSuccessfulRecipeCreationMessage = () => {
        setVisibilitySuccessfulRecipeCreation(false);
        navigateTo("/");

    }

    const getCategories = async () => {
        try {
            const data = await getAllCategories();

            console.log("Backend Response:", data);
            setCategories(data.categories);
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error) {
                handleInvalidInput(error.message);
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    useEffect(() => {
        getCategories();
    }, []);


    const handleAddProduct = () => {
        if (product.trim() !== "") {
            setProducts((prev) => [...prev, product.trim()]);
            setProduct("");
        }
    }

    const handleAddStep = () => {
        if (step.trim() !== "") {
            setSteps((prev) => [...prev, step.trim()]);
            setStep("");
        }
    }

    const handleRemoveProduct = (index: number) => {
        setProducts((prev) => prev.filter((_, i) => i !== index));
    }

    const handleRemoveStep = (index: number) => {
        setSteps((prev) => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        const formData: AddRecipeFormData = {
            title: (e.target as HTMLFormElement).recipeTitle.value,
            category: selectedCategory || "",
            time_for_cooking: (e.target as HTMLFormElement).timeForCooking.value,
            servings: (e.target as HTMLFormElement).servings.value,
            products: products,
            preparation_steps: steps
        };

        console.log("Recipe Data to Submit:", formData);

        try {
            const data = await addRecipe(formData, accessToken);

            console.log("Backend Response:", data);
            setVisibilitySuccessfulRecipeCreation(true);
        } catch (error) {
            console.error("Error:", error);
            if (error instanceof Error) {
                handleInvalidInput(error.message);
            } else {
                handleInvalidInput("An unknown error occurred.");
            }
        }
    }

    return (
        <div className="form-page" id="recipe-form-page">
            <div className="addRecipeFormWrapper">
                <form onSubmit={handleSubmit} className="addRecipeForm">
                    <div className="addRecipeFormInputBox">
                        <input
                            type="text"
                            name="recipeTitle"
                            placeholder="Recipe title"
                            className="recipeFormInputTitle"
                        />
                    </div>
                    <div className="addRecipeFormInputBox">
                        <input
                            type="text"
                            name="timeForCooking"
                            placeholder="Time for cooking"
                            className="recipeFormInputTime"
                        />
                    </div>
                    <div className="addRecipeFormInputBox">
                        <input
                            type="text"
                            name="servings"
                            placeholder="Servings"
                            className="recipeFormInputServings"
                        />
                    </div>

                    <div className="addRecipeFormInputBox">
                        <select
                            value={selectedCategory || ""}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="recipeFormInputCategory"
                        >
                            <option value="" disabled hidden>
                                Category
                            </option>
                            {categories &&
                                categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="addRecipeFormInputBox">
                        <input
                            type="text"
                            value={product}
                            onChange={(e) => setProduct(e.target.value)}
                            placeholder="Product"
                            className="recipeFormInputProduct"
                        />
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            className="addProductButton"
                        >
                            Add Product
                        </button>
                    </div>
                    <div className="addRecipeFormInputBox">
                        <input
                            type="text"
                            value={step}
                            onChange={(e) => setStep(e.target.value)}
                            placeholder="Step"
                            className="recipeFormInputStep"
                        />
                        <button
                            type="button"
                            onClick={handleAddStep}
                            className="addStepButton"
                        >
                            Add Step
                        </button>
                    </div>
                    <h3 className="productListTitle">Product list:</h3>
                    <ol className="productList">
                        {products.map((item, index) => (
                            <li key={index} className="productListItem">
                                <div className="product-button-pair">
                                    {item}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveProduct(index)}
                                        className="removeProductButton"
                                    >
                                        Remove Product
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <h3 className="stepListTitle">Steps:</h3>
                    <ol className="stepList">
                        {steps.map((step, index) => (
                            <li key={index} className="stepListItem">
                                <div className="step-button-pair">
                                    {step}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveStep(index)}
                                        className="removeStepButton"
                                    >
                                        Remove Step
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <button type="submit" className="addRecipeButton">
                        Create Recipe
                    </button>
                </form>
            </div>
            {visibilityRecipeCreationErrorPopup && (
                <RecipeCreationError
                    handleCloseError={handleCloseRecipeCreationError}
                    errorContent={errorMessage}
                />
            )}
            {visibilitySuccessfulRecipeCreation && (
                <RecipeCreationSuccessfulMessage
                    handleCloseMessage={handleCloseSuccessfulRecipeCreationMessage}
                />
            )}
        </div>
    )
}

export default AddRecipeForm;
