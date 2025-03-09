import React from "react";
import "./more-info.css";

import { IoFootsteps } from "react-icons/io5";
import { RiKnifeFill } from "react-icons/ri";
import {RecipeData} from "../singlepage/types";
import RecipeTimer from "../timer/timer";

type PrepInfoProps = {
    recipeData: RecipeData | null;
};

const RecipePreparation = ({recipeData}: PrepInfoProps) => {
    const steps= recipeData?.preparation_steps;
    return (
        <details className="collapsible-preparation" open>
            <div className="recipeTimer"><RecipeTimer /></div>
            <summary className="collapsible-summary">
                <h1 className="Preparation">
                    <IoFootsteps /> How to prepare <span className="expand-symbol"></span>
                </h1>
            </summary>
            <div className="collapsibleContent">
                <ul className="steps-to-prepare">
                    {
                        steps?.map((step, index) => (
                            <details className="collapsible-steps" open>
                                <summary className="collapsible-summary">
                                    <h1 className="Steps">
                                        <RiKnifeFill /> Step {index + 1}<span className="expand-symbol"></span>
                                    </h1>
                                </summary>
                                <div className="collapsibleContent">
                                    <div className="step-description">
                                        {step}
                                    </div>
                                </div>
                            </details>
                        ))
                    }
                </ul>
            </div>
        </details>
    );
}

export default RecipePreparation;