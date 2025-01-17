import React from 'react';
import '../profilewindow.css';

import RecipesList from '../../../../sections/recipes-home/RecipesList';

type MyFavouritesWindowProps = {
    author: string;
    close: React.Dispatch<React.SetStateAction<boolean>>;
};

const MyFavouritesWindow: React.FC<MyFavouritesWindowProps> = ({ author, close }) => {
    return (
        <div className="windowOverlay">
            <div className="windowContent">
                <p className="windowTitle">MY FAVOURITES</p>
                <div className="recipesListContainer">
                    <RecipesList favouritesOf={author}/>
                </div>
                <button className="closeButtonProfileWindow" onClick={() => close(false)}>
                    Close
                </button>
            </div>
        </div>
    );
}

export default MyFavouritesWindow;