import React from 'react';
import '../profilewindow.css';

import RecipesList from '../../../../sections/recipes-home/RecipesList';

type MyLikedWindowProps = {
    author: string;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyRecipesWindow: React.FC<MyLikedWindowProps> = ({ author, close }) => {
    return (
        <div className="windowOverlay">
            <div className="windowContent">
                <p className="windowTitle">MY LIKED</p>
                <div className="recipesListContainer">
                    <RecipesList likedBy={author}/>
                </div>
                <button className="closeButtonProfileWindow" onClick={() => close(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default MyRecipesWindow;