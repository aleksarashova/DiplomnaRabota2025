import React from "react";
import "./more-info.css";

import { IoFootsteps } from "react-icons/io5";
import { RiKnifeFill } from "react-icons/ri";

const RecipePreparation = () => {
    //ot bazata
    const steps : string[] = [
        "Step 1",
        "Step 2",
        "Step 3"
    ]
    return (
        <details className="collapsible-preparation" open>
            <summary className="collapsible-summary">
                <h1 className="Preparation">
                    <IoFootsteps /> How to prepare <span className="expand-symbol"></span>
                </h1>
            </summary>
            <div className="collapsibleContent">
                <ul className="steps-to-prepare">
                    {
                        steps.map(step => (
                            <details className="collapsible-steps" open>
                                <summary className="collapsible-summary">
                                    <h1 className="Steps">
                                        <RiKnifeFill /> {step}<span className="expand-symbol"></span>
                                    </h1>
                                </summary>
                                <div className="collapsibleContent">
                                    <div className="step-description">
                                        First you have to mix the eggs with the salt.
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