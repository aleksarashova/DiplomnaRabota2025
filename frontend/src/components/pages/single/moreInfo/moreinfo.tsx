import React from "react";

import RecipeProducts from "./products";
import RecipePreparation from "./preparation";

const MoreRecipeInfo = () => {

    return (
        <div className="moreInfo">
            <RecipeProducts />
            <RecipePreparation />
        </div>
    );
}

export default MoreRecipeInfo;