import React, { useState } from 'react';
import "../../common.css";
import "./add-category-popup.css";

interface AddCategoryPopupProps {
    handleCancelAddCategory: () => void;
    handleAddCategory: (content: string) => void;
}

export const AddCategoryPopup = ({ handleCancelAddCategory, handleAddCategory }: AddCategoryPopupProps) => {
    const [content, setContent] = useState("");

    const handleSubmitCategory = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddCategory(content);
    }

    return (
        <div className="popupOverlay">
            <div className="addCategoryPopup">
                <div className="popupTitle">Add new category</div>
                <form className="popupContent" onSubmit={handleSubmitCategory}>
                    <input
                        className="category-input"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                    <div className="popupButtons" id="buttonsAddCategory">
                        <button onClick={handleCancelAddCategory} type="button" className="cancelAddCategoryButton">Cancel</button>
                        <button type="submit" className="confirmAddCategoryButton">Add Category</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
