import React, { useState, useEffect } from "react";
import axios from "../../../Axios";
import bellIcon from "../../../assets/svg/bell-icon.svg";
import HamburgerMenuComponent from "./HamburgerMenu";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notification");
        setNotifications(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const navigate = useNavigate();

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logOut = async () => {
    try {
      await axios.get("/logout").then((response) => {
        localStorage.removeItem("Shbro");
        localStorage.removeItem("A_Status");
        localStorage.removeItem("H_Status");
        localStorage.removeItem("CH_Status");
        setIsLoggedIn(false);
        navigate("/login"); // Redirect to homepage
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      <nav className="bg-gray-700 text-white p-4">
        <div className="flex justify-between items-center ">
          <div className="mr-10 md:hidden">
            <HamburgerMenuComponent isOpen={isOpen} toggleMenu={toggleMenu} />
          </div>
          <h1 className="text-2xl">Admin Dashboard</h1>
          <div className="flex items-center">
            <div className="mr-4 relative">
              <button onClick={toggleNotification}>
                {" "}
                <img src={bellIcon} className="w-5 h-5" alt="" />
              </button>
              {notifications.length > 0 && (
                <span className="bg-red-500 text-white  absolute h-[2px] w-[2px] p-[5px] top-0 right-0 rounded-full">
                  {/* {notifications.length} */}
                </span>
              )}

              {isNotificationOpen && notifications.length > 0 && (
                <div className="absolute bg-white z-[60] h-96 w-96 overflow-scroll example right-0 mt-1 p-2 w-64 border rounded-lg shadow-lg text-black">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="text-gray-800 p-2 cursor-pointer my-4 rounded-md hover:bg-orange-300 hover:text-white"
                    >
                      <div>{notification.message}</div>
                      <div className="text-gray-500 text-xs">
                        {notification.date}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mr-4 relative">
              <button onClick={toggleProfile}>Profile</button>
              {isProfileOpen && (
                <div className="absolute bg-white text-black p-4 shadow-xl right-10">
                  <ul className="w-56">
                    <li className="py-2">Profile</li>

                    <li onClick={logOut} className=" cursor-pointer py-2">Logout</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
