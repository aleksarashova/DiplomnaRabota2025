import React, { useEffect, useState } from "react";
import "./rolespage.css";
import { Link, useNavigate } from "react-router-dom";
import { validateJWT } from "../../authCheck";
import { getAllUsers, updateUserRole } from "./requests";
import { User } from "./types";
import altImage from "../../../images/altImage.png";
import Header from "../../../sections/header/Header";
import NotAdminError from "../../../popups/errors/NotAdminError";

const RolesPage = () => {
    const [users, setUsers] = useState<User[] | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [notAdminErrorPopup, setNotAdminErrorPopup] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
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

            try {
                const usersData = await getAllUsers(token!);
                setUsers(usersData);
            } catch (error) {
                console.error("Error getting users:", error);
                setUsers([]);
            }
        };

        fetchUsers();
    }, [navigateTo]);

    const handleCloseNotAdminError = () => {
        setNotAdminErrorPopup(false);
        navigateTo("/");
    }

    const handleRoleChange = async (userId: string, newRole: string) => {
        const token = sessionStorage.getItem("accessToken");
        const { isValid, role } = validateJWT(token);

        if (!isValid) {
            navigateTo("/login");
        }

        try {
            await updateUserRole(token!, userId, newRole);
            setUsers((prevUsers) =>
                prevUsers
                    ? prevUsers.map((user) =>
                        user.id === userId ? { ...user, role: newRole } : user
                    )
                    : null
            );

        } catch (error) {
            console.error("Error updating user role:", error);
        }
    }

    return (
        <div className="admin-page-roles">
            <Header isLoggedIn={isLoggedIn} isAdmin={isAdmin} isProfilePage={false} isHomePage={false} />
            <div className="rolesSection">
                <p className="rolesTitleAdmin">MANAGE USER ROLES</p>
                <div className="users-list">
                    {users && users.length > 0 ? (
                        users.map((user) => {
                            const userImagePath = user.image
                                ? `http://localhost:8000${user.image}`
                                : altImage;
                            return (
                                <div key={user.id} className="userAdminPage">
                                    <div className="userInfo">
                                        <Link to={`/profile/${user.username}`} className="linkToUserAdmin">
                                            <img
                                                src={userImagePath}
                                                alt="Profile"
                                                className="profilePhotoAdmin"
                                            />
                                            <p className="userNamesAdmin">{user.first_name} {user.last_name}</p>
                                        </Link>
                                        <div className="roleSwitcher">
                                            <div className="role-slider">
                                                <input
                                                    id={`roleSwitch-${user.id}`}
                                                    type="checkbox"
                                                    checked={user.role === "admin"}
                                                    onChange={(e) =>
                                                        handleRoleChange(user.id, e.target.checked ? "admin" : "user")
                                                    }
                                                    className="role-toggle"
                                                />
                                                <span className={`role-text ${user.role === "admin" ? "active" : ""}`}>
                                                    Admin
                                                </span>
                                                <span className={`role-text ${user.role === "user" ? "active" : ""}`}>
                                                    User
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="noCommentsMessage">
                            No users available. Please check back later!
                        </p>
                    )}
                </div>
            </div>
            {notAdminErrorPopup && (
                <NotAdminError
                    handleCloseError={handleCloseNotAdminError}
                    errorContent={errorMessage} />
            )}
        </div>
    );
};

export default RolesPage;