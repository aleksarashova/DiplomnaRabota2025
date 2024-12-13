import React from 'react';
import "../../common.css";
import "./delete-account-popup.css";

type DeleteAccountPopupProps = {
    handleCancelDeleteAccount: () => void;
    handleDeleteAccount: () => void;
}

const DeleteAccountPopup = ({handleCancelDeleteAccount, handleDeleteAccount} : DeleteAccountPopupProps) => {
    return (
        <div className="popupOverlay">
            <div className="deleteAccountPopup">
                <div className="popupTitle">Delete Account</div>
                <div className="popupContent">
                    <div className="popupQuestion">Are you sure you want to delete your account? <br />If you delete your
                        account you will permanently lose your profile.
                    </div>
                    <div className="popupButtons">
                        <button onClick={handleCancelDeleteAccount} className="cancelDeleteButton">Cancel</button>
                        <button onClick={handleDeleteAccount} className="confirmDeleteButton">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountPopup;