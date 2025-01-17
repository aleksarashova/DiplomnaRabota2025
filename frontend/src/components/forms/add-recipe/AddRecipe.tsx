import React, { useEffect, useState } from 'react';
import "../form.css";
import "./add-recipe.css";
import { useNavigate } from "react-router-dom";
import RecipeCreationError from "../../popups/errors/RecipeCreationError";
import RecipeCreationSuccessfulMessage from "../../popups/messages/RecipeCreationSuccessfulMessage";
import { addRecipe, getAllCategories } from "./requests";
import {validateJWT} from "../../pages/authCheck";

const AddRecipeForm = () => {
    const [categories, setCategories] = useState<string[] | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [productName, setProductName] = useState<string>("");
    const [productQuantity, setProductQuantity] = useState<string>("");
    const [step, setStep] = useState<string>("");
    const [products, setProducts] = useState<{ name: string; quantity: string }[]>([]);
    const [steps, setSteps] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);

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
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }
        try {
            const data = await getAllCategories(token!);
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
        if (productName.trim() !== "" && productQuantity.trim() !== "") {
            setProducts((prev) => [...prev, { name: productName.trim(), quantity: productQuantity.trim() }]);
            setProductName("");
            setProductQuantity("");
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            console.error("No access token found.");
            navigateTo("/login");
            return;
        }

        const formData = new FormData();
        formData.append("title", (e.target as HTMLFormElement).recipeTitle.value);
        formData.append("category", selectedCategory || "");
        formData.append("time_for_cooking", (e.target as HTMLFormElement).timeForCooking.value);
        formData.append("servings", (e.target as HTMLFormElement).servings.value);
        const productsAsArrayOfStrings = products.map(product => `${product.name} (${product.quantity})`);
        if(products.length != 0) {
            formData.append("products", JSON.stringify(productsAsArrayOfStrings));
        }
        if(steps.length != 0) {
            formData.append("preparation_steps", JSON.stringify(steps));
        }

        if (image) {
            formData.append("image", image);
        }

        console.log("Form Data to Submit:", formData);
        console.log("FormData contents:");
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });


        try {
            const data = await addRecipe(formData, token!);
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
            <p className="recipe-creation-title">Create your recipe:</p>
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
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Product"
                            className="recipeFormInputProduct"
                        />
                        <input
                            type="text"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                            placeholder="Quantity"
                            className="recipeFormInputQuantity"
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

                    <div className="addRecipeFormInputBox">
                        <p className="recipeFormInputImage">Upload image for your recipe</p>
                        <input
                            type="file"
                            id="fileInput"
                            onChange={handleImageChange}
                            accept="image/jpeg, image/png, image/jpg"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="fileInput" className="recipeFormInputImageLabel">
                            {image ? image.name : "Choose file..."}
                        </label>
                    </div>

                    <h3 className="productListTitle">Product list:</h3>
                    <ol className="productList">
                        {products.map((item, index) => (
                            <li key={index} className="productListItem">
                                <div className="product-button-pair">
                                    {item.name} ({item.quantity})
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
    );
}

export default AddRecipeForm;
