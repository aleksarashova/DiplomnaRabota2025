import React, {useEffect, useState} from "react";
import "./adminpage.css";

import Adminbar from "../../../bars/adminbar/Adminbar";
import {validateJWT} from "../../authCheck";
import {useNavigate} from "react-router-dom";
import Header from "../../../sections/header/Header";
import NotAdminError from "../../../popups/errors/NotAdminError";

const AdminPage = () => {
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [notAdminErrorPopup, setNotAdminErrorPopup] = useState<boolean>(false);

    const navigateTo = useNavigate();

    const handleCloseNotAdminError = () => {
        setNotAdminErrorPopup(false);
        navigateTo("/");
    }

    useEffect(() => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
            return;
        }

        setIsLoggedIn(true);

        if (role === "admin") {
            setIsAdmin(true);
        } else {
            setErrorMessage("Only admins can access this page.");
            setNotAdminErrorPopup(true);
        }
    }, []);


    return (
        <div className="admin-page">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false}/>
            <Adminbar />

            {notAdminErrorPopup && (
                <NotAdminError
                    handleCloseError={handleCloseNotAdminError}
                    errorContent={errorMessage} />
            )}
        </div>
    );
}

export default AdminPage;