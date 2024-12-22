import React from "react";
import "./more-info.css";

import { FaShoppingBasket, FaTags } from "react-icons/fa";
import {RecipeData} from "../singlepage/types";

type ProductsInfoProps = {
    recipeData: RecipeData | null;
};

const RecipeProducts = ({recipeData}: ProductsInfoProps) => {
    const products = recipeData?.products;

    return (
        <details className="collapsible-products" open>
            <summary className="collapsible-summary">
                <h1 className="Products">
                    <FaShoppingBasket /> Products <span className="expand-symbol"></span>
                </h1>
            </summary>
            <div className="collapsibleContent">
                <ul className="products-list">
                    {
                        products?.map((product, index) => (
                            <li key={index} className="product">
                                <div className="productName">
                                    <FaTags className="productIcon"/> {product}
                                </div>
                                <div className="productQuantity">
                                    1 tablespoon
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </details>
    );
}

export default RecipeProducts;
