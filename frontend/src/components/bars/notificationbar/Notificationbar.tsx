import React, { useEffect, useState } from "react";
import "./notificationbar.css";
import { decodeBase64URL, validateJWT } from "../../pages/authCheck";
import { UserNotification } from "./types";
import {deleteNotifications, getAllNotifications} from "./requests";
import { MdOutlineCircleNotifications } from "react-icons/md";
import {useNavigate} from "react-router-dom";

interface NotificationbarProps {
    visibility: boolean;
}

const NotificationBar = ({ visibility }: NotificationbarProps) => {
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    const navigateTo = useNavigate();

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const token = sessionStorage.getItem("accessToken");
            if(!token) {
                navigateTo("/login");
                return;
            }

            const {isValid, username} = validateJWT(token);

            if (isValid && username) {
                try {
                    const userNotifications = await getAllNotifications(token, username);
                    setNotifications(userNotifications);
                } catch (error) {
                    console.error("Error fetching user notifications:", error);
                }
            }
        };

        fetchData().then();
    }, []);

    const handleSelectNotification = (id: string) => {
        setSelectedNotifications((prev) =>
            prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
        );
    }

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map((n) => n.id));
        }
        setSelectAll(!selectAll);
    }

    const handleDeleteSelected = async () => {
        if (selectedNotifications.length > 0) {
            const token = sessionStorage.getItem("accessToken");
            const isValid = token && validateJWT(token);
            if(isValid) {
                try {
                    await deleteNotifications(token, selectedNotifications);
                } catch (error){
                    console.error("Error deleting user notifications:", error);
                }
            } else {
                navigateTo("/login");
                return;
            }
            setSelectedNotifications([]);
            setSelectAll(false);

            setNotifications((prev) => prev.filter((n) => !selectedNotifications.includes(n.id)));
            setSelectedNotifications([]);
            setSelectAll(false);
        }
    }

    return (
        <nav className={`notificationbar ${visibility ? "visible" : ""}`}>
            <p className="notificationsTitle">NOTIFICATIONS</p>
            <div className="myNotifications">
                {notifications.length > 0 ? (
                    <>
                        <div className="selectAllContainer">
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                className="selectAllCheckbox"
                            />
                            <label className="selectAllNotifications">Select All</label>
                            {selectedNotifications.length > 0 && (
                            <button className="deleteNotificationsButton" onClick={handleDeleteSelected}>
                                Delete {selectedNotifications.length}
                            </button>
                            )}
                        </div>
                        {notifications.map((notification) => (
                            <div key={notification.id} className="notificationRow">
                                <p className="timeAgoNotification">
                                    <input
                                        type="checkbox"
                                        checked={selectedNotifications.includes(notification.id)}
                                        onChange={() => handleSelectNotification(notification.id)}
                                    />
                                    <MdOutlineCircleNotifications className="notificationIcon"/>
                                    {notification.date}
                                </p>
                                <p className="notification">{notification.content}</p>
                            </div>
                        ))}
                    </>
                ) : (
                    <p className="noRatingsMessage">You have no notifications.</p>
                )}
            </div>
        </nav>
    );
}

export default NotificationBar;
