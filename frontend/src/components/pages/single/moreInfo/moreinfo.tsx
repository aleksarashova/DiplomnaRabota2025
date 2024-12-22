import React from "react";

import RecipeProducts from "./products";
import RecipePreparation from "./preparation";
import {RecipeData} from "../singlepage/types";

type MoreRecipeInfoProps = {
    recipeData: RecipeData | null;
};

const MoreRecipeInfo = ({recipeData}: MoreRecipeInfoProps) => {

    return (
        <div className="moreInfo">
            <RecipeProducts
                recipeData={recipeData}
            />
            <RecipePreparation
                recipeData={recipeData}
            />
        </div>
    );
}

export default MoreRecipeInfo;