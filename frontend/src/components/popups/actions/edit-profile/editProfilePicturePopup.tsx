import React, { useState } from 'react';
import "../../common.css";
import "./edit-account-popup.css";

type EditProfilePicturePopupProps = {
    handleCancelEditProfilePicture: () => void;
    handleEditProfilePicture: () => void;
    handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    selectedImage: File | null;
};


const EditProfilePicturePopup = ({
         handleCancelEditProfilePicture,
         handleEditProfilePicture,
         handleImageChange,
         selectedImage,
     }: EditProfilePicturePopupProps) => {
    return (
        <div className="popupOverlay">
            <div className="editAccountPopup">
                <div className="popupTitle">Edit Profile Picture</div>
                <div className="popupContent">
                    <input
                        type="file"
                        id="fileInput"
                        onChange={handleImageChange}
                        accept="image/jpeg, image/png, image/jpg"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="fileInput" className="recipeFormInputImageLabel">
                        {selectedImage ? selectedImage.name : "Choose file..."}
                    </label>
                    <div className="popupButtons">
                        <button onClick={handleCancelEditProfilePicture} className="cancelDeleteButton">Cancel</button>
                        <button onClick={handleEditProfilePicture} className="confirmEditButton">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePicturePopup;