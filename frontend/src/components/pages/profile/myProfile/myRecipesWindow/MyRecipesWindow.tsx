import React from 'react';
import '../profilewindow.css';

import RecipesList from '../../../../sections/recipes-home/RecipesList';

type MyRecipesWindowProps = {
    author: string;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyRecipesWindow: React.FC<MyRecipesWindowProps> = ({ author, close }) => {
    return (
        <div className="windowOverlay">
            <div className="windowContent">
                <p className="windowTitle">MY RECIPES</p>
                <div className="recipesListContainer">
                    <RecipesList recipesOf={author}/>
                </div>
                <button className="closeButtonProfileWindow" onClick={() => close(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default MyRecipesWindow;