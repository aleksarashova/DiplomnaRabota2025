import React, { useState, useEffect } from 'react';
import "../../common.css";
import "./edit-account-popup.css";

type EditAccountPopupProps = {
    handleCancelEditAccount: () => void;
    handleEditAccount: (input: string) => void;
    fieldToEdit: string;
    currentValue: string;
}

const EditAccountPopup = ({handleCancelEditAccount, handleEditAccount, fieldToEdit, currentValue} : EditAccountPopupProps) => {
    const [inputValue, setInputValue] = useState(currentValue);

    useEffect(() => {
        setInputValue(currentValue);
    }, [currentValue]);

    const handleEdit = () => {
        handleEditAccount(inputValue);
    }

    return (
        <div className="popupOverlay">
            <div className="editAccountPopup">
                <div className="popupTitle">Edit {fieldToEdit}</div>
                <div className="popupContent">
                    <textarea
                        value={inputValue}
                        placeholder={`New ${fieldToEdit}`}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="edit-input"
                    />
                    <div className="popupButtons">
                        <button onClick={handleCancelEditAccount} className="cancelDeleteButton">Cancel</button>
                        <button onClick={handleEdit} className="confirmEditButton">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditAccountPopup;