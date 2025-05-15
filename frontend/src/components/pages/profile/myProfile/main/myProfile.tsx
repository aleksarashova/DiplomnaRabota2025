import React, { useEffect, useState } from 'react';
import './my-profile.css';

import {EditAcc, UserData} from "./types";
import {useNavigate} from "react-router-dom";
import {validateJWT} from "../../../authCheck";
import {
    deleteAccountRequest,
    deleteProfilePictureRequest, editAccountRequest,
    editProfilePictureRequest,
    getUserDataRequest
} from "./requests";
import Header from "../../../../sections/header/Header";

import altImage from "../../../../images/altImage.png";
import Profilebar from "../../../../bars/profilebar/Profilebar";
import DeleteAccountPopup from "../../../../popups/actions/delete-acc/deleteAccountPopup";
import EditProfilePicturePopup from "../../../../popups/actions/edit-profile/editProfilePicturePopup";
import EditAccountPopup from "../../../../popups/actions/edit-profile/editProfileInfoPopup";
import MyRecipesWindow from "../myRecipesWindow/MyRecipesWindow";
import Footer from "../../../../sections/footer/Footer";
import MyLikedWindow from "../myLikedWindow/myLikedWindow";
import MyFavouritesWindow from "../myFavouritesWindow/myFavouritesWindow";
import MyRatingsWindow from "../myRatingsWindow/myRatingsWindow";

const MyProfile = () => {
    const [visibilityDeleteAccountPopup, setVisibilityDeleteAccountPopup] = useState(false);
    const [visibilityEditAccountPopup, setVisibilityEditAccountPopup] = useState(false);
    const [visibilityEditProfilePicturePopup, setVisibilityEditProfilePicturePopup] = useState(false);
    const [currentFieldForEdit, setCurrentFieldForEdit] = useState('');
    const [currentFieldValue, setCurrentFieldValue] = useState('');
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [showMyRecipes, setShowMyRecipes] = useState<boolean>(false);
    const [showMyLiked, setShowMyLiked] = useState<boolean>(false);
    const [showMyFavourites, setShowMyFavourites] = useState<boolean>(false);
    const [showMyRatings, setShowMyRatings] = useState<boolean>(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem("accessToken");
            const { isValid, role } = validateJWT(token);
            setIsLoggedIn(!!isValid);
            setIsAdmin(role === "admin");

            if (!isValid) {
                navigateTo("/login");
            }

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
        const token = sessionStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
            return;
        }

        try {
            const data = await getUserDataRequest(token!);
            console.log('Backend Response:', data);
            setUserData(data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(file);
        }
    }

    const handleRemoveImage = async () => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await deleteProfilePictureRequest(token!);
            console.log("Profile picture deleted successfully:", data);
            setSelectedImage(null);
            setVisibilityEditProfilePicturePopup(false);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting profile picture:", error);
        }
    }

    const handleEditProfilePicture = async () => {
        if (!selectedImage) {
            console.error("No image selected.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedImage);

        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await editProfilePictureRequest(token!, formData);
            console.log("Profile picture updated successfully:", data);
            setVisibilityEditProfilePicturePopup(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile picture:", error);
        }
    }

    const handleCancelEditAccount = () => {
        setVisibilityEditAccountPopup(false);
    }

    const handleCancelEditProfilePicture = () => {
        setVisibilityEditProfilePicturePopup(false);
    }

    const handleDeleteAccount = async () => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            const data = await deleteAccountRequest(token!);
            console.log('Backend Response:', data);
            sessionStorage.removeItem('accessToken');
            setVisibilityDeleteAccountPopup(false);
            navigateTo("/");
        } catch (error) {
            console.error('Error deleting account:', error);

            if (error instanceof Error && error.message.includes('401')) {
                navigateTo('/login');
            }
        }
    };

    const handleEditAccount = async (input: string): Promise<void> => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        if (input === currentFieldValue) {
            console.log('No change detected. Skipping request.');
            setVisibilityEditAccountPopup(false);
            return;
        }


        const formData: EditAcc = {
            field: currentFieldForEdit,
            value: input,
        };

        try {
            const data = await editAccountRequest(token!, formData);
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

    if (!isLoggedIn) {
        return null;
    }

    const userImagePath = userData?.image ? `${process.env.REACT_APP_BASE_URL_IMAGES}${userData.image}` : altImage;

    return (
        <div className="myProfileWrapper">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={true} isHomePage={false} />
            <div className="myProfileInfoBox">
                <div className="my-photo-wrapper">
                    <img src={userImagePath} alt="Profile Picture" className="myProfilePhoto"/>
                    <button
                        className="editMyProfileButton"
                        onClick={() => setVisibilityEditProfilePicturePopup(true)}
                    >
                        Edit
                    </button>
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
                                setCurrentFieldValue(userData?.username || "");
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
                                setCurrentFieldValue(userData?.bio || "");
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
            <Profilebar
                setShowMyRecipes={setShowMyRecipes}
                setShowMyLiked={setShowMyLiked}
                setShowMyFavourites={setShowMyFavourites}
                setShowMyRatings={setShowMyRatings}
            />

            {visibilityDeleteAccountPopup && (
                <DeleteAccountPopup
                    handleCancelDeleteAccount={() => setVisibilityDeleteAccountPopup(false)}
                    handleDeleteAccount={handleDeleteAccount}
                />
            )}


            {visibilityEditProfilePicturePopup && (
                <EditProfilePicturePopup
                    handleCancelEditProfilePicture={handleCancelEditProfilePicture}
                    handleEditProfilePicture={handleEditProfilePicture}
                    handleImageChange={handleImageChange}
                    handleRemoveImage={handleRemoveImage}
                    selectedImage={selectedImage}
                />
            )}

            {visibilityEditAccountPopup && (
                <EditAccountPopup
                    handleCancelEditAccount={handleCancelEditAccount}
                    handleEditAccount={handleEditAccount}
                    fieldToEdit={currentFieldForEdit}
                    currentValue={currentFieldValue}
                />
            )}

            {showMyRecipes && userData?.username && (
                <MyRecipesWindow
                    author={userData.username}
                    close={setShowMyRecipes}
                />
            )}

            {showMyLiked && userData?.username && (
                <MyLikedWindow
                    author={userData.username}
                    close={setShowMyLiked}
                />
            )}

            {showMyFavourites && userData?.username && (
                <MyFavouritesWindow
                    author={userData.username}
                    close={setShowMyFavourites}
                />
            )}

            {showMyRatings && userData?.username && (
                <MyRatingsWindow
                    author={userData.username}
                    close={setShowMyRatings}
                />
            )}

            <Footer/>
        </div>
    );
};

export default MyProfile;