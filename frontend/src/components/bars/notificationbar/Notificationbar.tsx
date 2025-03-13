import React, {useEffect} from "react";
import "./notificationbar.css";
import {decodeBase64URL, validateJWT} from "../../pages/authCheck";
import {useNavigate} from "react-router-dom";
import {UserNotification} from "./types";
import {getAllNotifications} from "./requests";

import { MdOutlineCircleNotifications } from "react-icons/md";

interface NotificationbarProps {
    visibility: boolean;
}

const NotificationBar = ({visibility}: NotificationbarProps) => {
    const [notifications, setNotifications] = React.useState<UserNotification[]>([]);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);

            if (isValid) {
                const payload = JSON.parse(decodeBase64URL(token.split(".")[1]));
                const username = payload.username;
                try {
                    const userNotifications = await getAllNotifications(token, username);
                    setNotifications(userNotifications);
                } catch (error) {
                    console.error("Error fetching user notifications:", error);
                }
            } else {
                navigateTo("/login");
            }
        };

        fetchData();
    }, []);
    return (
        <nav className={`notificationbar ${visibility ? "visible" : ""}`}>
            <p className="notificationsTitle">NOTIFICATIONS</p>
            <div className="myNotifications">
                {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <div key={index} className="notificationRow">
                            <p className="notification">{notification.content}<MdOutlineCircleNotifications className="notificationIcon"/></p>
                        </div>
                    ))
                ) : (
                    <p className="noRatingsMessage">You have no notifications.</p>
                )}
            </div>
        </nav>

    );
}

export default NotificationBar;
