import React, { useContext, useEffect, useRef, useState } from "react";
import "./Header.css";
import { AppContext } from "../../../context/AppContext";
import LogOut from "../../../data/images/LogOut.png";
import Moon from "../../../data/images/Moon.png";
import Logo from "../../../data/images/logo.png";
import Sun from "../../../data/images/sun.png";
import Home from "../../../data/images/home.png";

import NotificationOff from "../../../data/images/notificationOff.png";
import { getProjectsById, resolveNotification } from "../../../client/client";
import { NotificationType } from "../../../data/Interfaces";
import { useNavigate } from "react-router-dom";
import lightCube from "../../../data/images/lightCube.png";
import darkCube from "../../../data/images/darkCube.png";

interface HeaderProps {
  logOut: () => void;
}

export const Header = ({ logOut }: HeaderProps) => {
  const {
    profile,
    notifications,
    setNotifications,
    darkMode,
    setDarkMode,
    setProjects,
    projects,
  } = useContext(AppContext);
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const notificationPanelRef = useRef<HTMLDivElement>(null);
  const [notificationsLength, setNotificationsLength] = useState(
    notifications.length
  );

  const handleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleNotificationResolve = (
    notification: NotificationType,
    action: string,
    user_name: string
  ) => {
    resolveNotification(
      notification.project_id,
      profile!.id + "",
      action,
      user_name
    );
    let tempNotifications = [...notifications];
    let tNotifications = tempNotifications.filter(
      (n) => n.projectName !== notification.projectName
    );

    setNotifications(tNotifications);
    setTimeout(async () => {
      const projectArray = await getProjectsById(profile!.id);
      setProjects(projectArray);
    }, 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(target) &&
        !target.classList.contains("circle-header") &&
        !target.closest(".notification-container") &&
        !target.closest(".standard-container-button")
      ) {
        setShowNotification(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const circleHeaderElement = document.querySelector(
      ".circle-header.notification"
    );
    if (circleHeaderElement && notifications.length >= notificationsLength) {
      circleHeaderElement.classList.add("jump-animation");
      setTimeout(() => {
        circleHeaderElement.classList.remove("jump-animation");
        setTimeout(() => {
          circleHeaderElement.classList.add("jump-animation");
          setTimeout(() => {
            circleHeaderElement.classList.remove("jump-animation");
            setTimeout(() => {
              circleHeaderElement.classList.add("jump-animation");
              setTimeout(() => {
                circleHeaderElement.classList.remove("jump-animation");
              }, 700);
            }, 800);
          }, 700);
        }, 800);
      }, 700);
    }
    setNotificationsLength(notifications.length);
  }, [notifications, notificationsLength]);

  const toggleDarkMode = () => {
    setDarkMode(darkMode === "dark" ? "light" : "dark");
  };

  return (
    <>
      {profile && (
        <div className="header-container">
          <div className="header-logo-container">
            <img
              className="header-logo"
              src={darkMode === "dark" ? darkCube : lightCube}
            />
            <h1
              className={`header-logo-image ${darkMode}`}
              onClick={() => navigate("/dashboard")}
            >
              TASKWISE
            </h1>
          </div>
          <div className="header-right-container">
            <div className="circles-notification-container">
              <div className="circles-container">
                <div className="notification-panel" ref={notificationPanelRef}>
                  <div
                    className={`circle-header ${
                      notificationsLength > 0 ? "notification" : ""
                    }`}
                    onClick={handleNotification}
                  >
                    <img
                      src={NotificationOff}
                      alt=""
                      className={`header-icon ${darkMode}`}
                    />
                  </div>
                </div>
                <div className="circle-header" onClick={toggleDarkMode}>
                  <img
                    className={`header-icon ${
                      darkMode === "light" ? "moon" : "sun"
                    }`}
                    src={darkMode === "light" ? Moon : Sun}
                    alt={darkMode === "light" ? "Moon icon" : "Sun icon"}
                  />
                </div>
                <div
                  className="circle-header"
                  onClick={() => navigate("/dashboard")}
                >
                  <img src={Home} className={`header-icon ${darkMode}`} />
                </div>
                <div className="user-name-container">
                  <p className="user-name">{profile?.given_name}</p>
                </div>
                <div className="circle-header" onClick={logOut}>
                  <img className={`header-icon ${darkMode}`} src={LogOut} />
                </div>
              </div>
            </div>
          </div>
          {showNotification && (
            <div className={`notification-container ${darkMode}`}>
              {notifications.length === 0 ? (
                <div className="noInvites">No Invites</div>
              ) : (
                notifications.map((n, index) => (
                  <div className="standard-container notification-standard-container">
                    <div key={index}>
                      <div className="notification-container-title">
                        <h1> {n.projectName}</h1>
                      </div>
                      <div className="notification-message-container">
                        You have been invited to join this project by{" "}
                        {n.user_username}
                      </div>
                      <button
                        onClick={() =>
                          handleNotificationResolve(n, "accept", profile.name)
                        }
                        className="standard-container-button right notification"
                      >
                        Accept
                      </button>
                      <button
                        className=" standard-container-button left notification"
                        onClick={() =>
                          handleNotificationResolve(n, "reject", profile.name)
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
