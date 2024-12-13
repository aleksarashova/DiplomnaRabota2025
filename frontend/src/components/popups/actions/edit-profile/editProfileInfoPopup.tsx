import React, { useRef } from 'react';
import "../../common.css";
import "./edit-account-popup.css";

type EditAccountPopupProps = {
    handleCancelEditAccount: () => void;
    handleEditAccount: (input: string) => void;
    fieldToEdit: string;
}

const EditAccountPopup = ({handleCancelEditAccount, handleEditAccount, fieldToEdit} : EditAccountPopupProps) => {
    const inputValueRef = useRef<HTMLTextAreaElement>(null);

    const handleEdit = () => {
        const inputValue = inputValueRef.current?.value || "";
        handleEditAccount(inputValue);
    }

    return (
        <div className="popupOverlay">
            <div className="editAccountPopup">
                <div className="popupTitle">Edit {fieldToEdit}</div>
                <div className="popupContent">
                    <textarea
                        ref={inputValueRef}
                        placeholder={`New ${fieldToEdit}`}
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