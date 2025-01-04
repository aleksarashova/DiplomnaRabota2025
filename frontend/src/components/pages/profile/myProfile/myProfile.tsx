import React, { useEffect, useState } from 'react';
import './my-profile.css';

import profileImage from '../../../images/altImage.png';

import DeleteAccountPopup from '../../../popups/actions/delete-acc/deleteAccountPopup';
import EditAccountPopup from '../../../popups/actions/edit-profile/editProfileInfoPopup';

import { useNavigate } from 'react-router-dom';

import { EditAcc, UserData } from './types';
import { deleteAccountRequest, editAccountRequest, getUserDataRequest } from './requests';

import Header from '../../../sections/header/Header';
import Footer from '../../../sections/footer/Footer';

import { validateJWT } from '../../authCheck';
import altImage from "../../../images/altImage.png";

const MyProfile = () => {
    const [visibilityDeleteAccountPopup, setVisibilityDeleteAccountPopup] = useState(false);
    const [visibilityEditAccountPopup, setVisibilityEditAccountPopup] = useState(false);
    const [currentFieldForEdit, setCurrentFieldForEdit] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);
            setIsLoggedIn(!!isValid);

            if (isValid) {
                try {
                    await getUserData();
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigateTo("/login");
            }
        };

        fetchData();
    }, []);

    const getUserData = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found.');
            navigateTo('/login');
            return;
        }

        try {
            const data = await getUserDataRequest(accessToken);
            console.log('Backend Response:', data);
            setUserData(data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleDeleteAccount = async () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found.');
            navigateTo('/login');
            return;
        }

        try {
            const data = await deleteAccountRequest(accessToken);
            console.log('Backend Response:', data);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setVisibilityDeleteAccountPopup(false);
            navigateTo("/");
        } catch (error) {
            console.error('Error deleting account:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleCancelDeleteAccount = () => {
        setVisibilityDeleteAccountPopup(false);
    }

    const handleEditAccount = async (input: string): Promise<void> => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            console.error('No access token found.');
            navigateTo('/login');
            return;
        }

        const formData: EditAcc = {
            field: currentFieldForEdit,
            value: input,
        };

        try {
            const data = await editAccountRequest(accessToken, formData);
            console.log('Backend Response:', data);
            setVisibilityEditAccountPopup(false);
            window.location.reload();
        } catch (error) {
            console.error('Error editing account:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleCancelEditAccount = () => {
        setVisibilityEditAccountPopup(false);
    }

    if (!isLoggedIn) {
        return null;
    }

    const userImagePath = userData?.image ? `http://localhost:8000${userData.image}` : altImage;
    console.log(userImagePath);

    return (
        <div className="myProfileWrapper">
            <Header isLoggedIn={isLoggedIn} isProfilePage={true} isHomePage={false} />
            <div className="myProfileInfoBox">
                <div className="my-photo-wrapper">
                    <img src={userImagePath} alt="Profile Picture" className="myProfilePhoto" />
                    <button className="editMyProfileButton">Edit</button>
                </div>
                <div className="myProfileData">
                    <div className="editField">
                        <div className="field">
                            <div className="fieldTitle">First name</div>
                            <div className="fieldContent">{userData?.first_name}</div>
                        </div>
                    </div>

                    <div className="editField">
                    <div className="field">
                            <div className="fieldTitle">Last name</div>
                            <div className="fieldContent">{userData?.last_name}</div>
                        </div>
                    </div>

                    <div className="editField">
                        <div className="field">
                            <div className="fieldTitle">Username</div>
                            <div className="fieldContent">{userData?.username}</div>
                        </div>
                        <button
                            className="editMyProfileButton"
                            onClick={() => {
                                setVisibilityEditAccountPopup(true);
                                setCurrentFieldForEdit('username');
                            }}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="editField">
                        <div className="field">
                            <div className="fieldTitle">Email</div>
                            <div className="fieldContent">{userData?.email}</div>
                        </div>
                        <button
                            className="editMyProfileButton"
                            onClick={() => {
                                setVisibilityEditAccountPopup(true);
                                setCurrentFieldForEdit('email');
                            }}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="editField">
                        <div className="field">
                            <div className="fieldTitle">Password</div>
                            <div className="fieldContent">{userData?.password_placeholder}</div>
                        </div>
                        <button
                            className="editMyProfileButton"
                            onClick={() => {
                                setVisibilityEditAccountPopup(true);
                                setCurrentFieldForEdit('password');
                            }}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="editField">
                        <div className="field">
                            <div className="fieldTitle">Bio</div>
                            <div className="fieldContent" id="bioField">
                                {userData?.bio}
                            </div>
                        </div>
                        <button
                            className="editMyProfileButton"
                            onClick={() => {
                                setVisibilityEditAccountPopup(true);
                                setCurrentFieldForEdit('bio');
                            }}
                        >
                            Edit
                        </button>
                    </div>
                </div>
                <button id="deleteProfileButton" onClick={() => setVisibilityDeleteAccountPopup(true)}>
                    Delete account
                </button>
            </div>

            {visibilityDeleteAccountPopup && (
                <DeleteAccountPopup
                    handleCancelDeleteAccount={handleCancelDeleteAccount}
                    handleDeleteAccount={handleDeleteAccount}
                />
            )}

            {visibilityEditAccountPopup && (
                <EditAccountPopup
                    handleCancelEditAccount={handleCancelEditAccount}
                    handleEditAccount={handleEditAccount}
                    fieldToEdit={currentFieldForEdit}
                />
            )}
            <Footer />
        </div>
    );
};

export default MyProfile;