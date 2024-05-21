import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HostModal from "../Dashboard/HostModal";
import bellIcon from "../../assets/svg/bell-icon.svg";
import Logo from "../../assets/logo.png";
import axios from "../../Axios.js";
import { useStateContext } from "../../ContextProvider/ContextProvider.jsx";
import { message } from "antd";

export default function Header() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, token, adminStatus,coHost, host, setAdminStatus, setHost, setUser } = useStateContext();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const receiverId = parseInt(localStorage.getItem("receiverid"), 10);
  const [isNotificationLoading, setNotificationLoading] = useState(false);
  const [isNotificationDeleted, setNotificationDeleted] = useState(false);

  const [notifications, setNotifications] = useState([
  
  ]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen(!isBellDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const closeBellDropdown = () => {
    setIsBellDropdownOpen(false);
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/notification/${notificationId}`);
      console.log("Deleted Notification", response.data);

      message.success("notification deleted successfully");
      setNotificationDeleted(!isNotificationDeleted);
    } catch (error) {
      message.error("could not delete notification");
    }
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isProfileDropdownOpen) {
        const profileDropdown = document.getElementById("profile-dropdown");
        if (profileDropdown && !profileDropdown.contains(event.target)) {
          closeProfileDropdown();
        }
      }

      if (isBellDropdownOpen) {
        const bellDropdown = document.getElementById("bell-dropdown");
        if (bellDropdown && !bellDropdown.contains(event.target)) {
          closeBellDropdown();
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isProfileDropdownOpen, isBellDropdownOpen]);

  useEffect(() => {
    setNotificationLoading(true);

   if(token){ axios
      .get("/notification")
      .then((response) => {
        setNotifications(
          response.data.data.flatMap((notification) => notification)
        );
        console.log(
          "notification",
          response.data.data.flatMap((notification) => notification)
        );
      })
      .catch((error) => {
        // console.log("Error",error);
      })
      .finally(() => {
        setNotificationLoading(false);
      });}
  }, [isNotificationDeleted,token]);

  const initializeEcho = (token, receiverId) => {
    if (typeof window.Echo !== "undefined") {
      const channelName = `App.Models.User.${receiverId}`;

      window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Authentication token is set:",
        window.Echo.connector.options.auth.headers.Authorization
      );

      const privateChannel = window.Echo.private(channelName);

      privateChannel.listen("NewNotificationEvent", (data) => {
        // console.log("Received Notification:", data);
        // console.log("User ID:", data.user_id);

        setNotifications([ data.notification,...notifications]);
      });

      console.log("Listening for messages on channel:", channelName);
    } else {
      console.error(
        "Echo is not defined. Make sure Laravel Echo is properly configured."
      );
    }
  };

  // console.log("adminStatus",adminStatus);
  // console.log("host",host);

  const logOut = async () => {
    try {
      await axios.get("/logout").then((response) => {
        //  console.log("logout",response);
        localStorage.removeItem("Shbro");
        localStorage.removeItem("A_Status");
        localStorage.removeItem("H_Status");
        localStorage.removeItem("CH_Status");
        localStorage.removeItem("supportAgent")
        localStorage.removeItem("supportUser")
        setIsLoggedIn(false);
        window.location.replace("/");
      });
    } catch (error) {
      //  console.log("Error",error);
    }
  };

  //  useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Make a request to get the user data
  //       const response = await axios.get('/user'); // Adjust the endpoint based on your API

  //       // Set the user data in state
  //       setUser(response.data);
  //       setHost(response.data.host);
  //       setAdminStatus(response.data.adminStatus);

  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  const DateTimeConverter = (date) => {
    if (!date) return "";

    // Create a new Date object from the provided date string
    const originalDate = new Date(date);

    // Check if the date is valid
    if (isNaN(originalDate.getTime())) return "";

    // Define months array
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Extract day, month, year, hours, and minutes from the date object
    const day = originalDate.getDate();
    const monthIndex = originalDate.getMonth();
    const year = originalDate.getFullYear();
    let hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Format the date string
    const formattedDate = `${
      months[monthIndex]
    } ${day}, ${year} ${hours}:${minutes
      .toString()
      .padStart(2, "0")} ${amOrPm}`;

    // Render the formatted date
    return formattedDate;
  };

  useEffect(() => {
    if(token){

      initializeEcho(token, receiverId);
    }
  }, [token]);

  return (
    <header className="bg-gray-800 text-white py-2 hidden md:block">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-semibold">
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-16 w-16 mr-2" />
          </Link>
        </div>
        <nav className="flex items-center">
          <Link to="/" className="text-white hover:text-gray-300 ml-4">
            Home
          </Link>
          {token && <Link to="/wishlist" className="text-white hover:text-gray-300 ml-4">
            Wishlist
          </Link>}
          {token && <Link to="/trip" className="text-white hover:text-gray-300 ml-4">
            Trips
          </Link>}
          {token && <Link to="/ChatAndNotifcationTab" className="text-white hover:text-gray-300 ml-4">
            Inbox
          </Link>}
          {((host == 1 || coHost==1) && token) && <Link to="/Hosting" className={` hover:text-gray-300 ml-4 ${((host != 0||coHost==1) && token) ? "block text-white" : "hidden"}`}>
            Switch to {coHost==1?"CoHost":"Host"}
          </Link>}
          {!((host == 1 || coHost==1) && token) && <Link to="/HostHomes" className="text-white hover:text-gray-300 ml-4"  >Shrbo your place</Link>}
          {(adminStatus == "admin") && <Link to="/AdminAnalytical" className="text-white hover:text-gray-300 ml-4">
            Dashboard
          </Link>}
          {!token && <Link to="/Login" className="text-white hover:text-gray-300 ml-4"   >Login</Link>}

          {token && <div
            id="profile-dropdown"
            className={`relative ${isProfileDropdownOpen ? "group" : ""}`}
            onClick={toggleProfileDropdown}
            tabIndex={0}
          >
            <Link to="" className="text-white hover:text-gray-300 ml-4">
              Profile
            </Link>
            {isProfileDropdownOpen && (
              <div className="absolute bg-white z-[60] right-0 mt-1 p-2 w-64 border rounded-lg shadow-lg">
                {/* Dropdown content goes here */}
                <Link
                  to="/Profile"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/Settings"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                >
                  Settings
                </Link>
                <Link
                  to="/HostHomes"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                >
                  Create a new Listings
                </Link>
                {(host == 1||coHost==1) && <Link
                  to="/Hosting"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                >
                  Manage Listings
                </Link>
                }
                {(host == 1||coHost==1) && <Link
                  to="/Listings"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                >
                  Listings
                </Link>}
                <button
                  // to="/logout"
                  className="block text-gray-800 hover:text-red-500 p-2 cursor-pointer"
                  onClick={logOut}
                >
                  Logout
                </button>
              </div>
            )}
          </div>}
          {/* Bell Icon and Notification Dropdown */}
          {token && <div
            id="bell-dropdown"
            className={`relative group ml-4 ${isBellDropdownOpen ? "group" : ""}`}
            onClick={toggleBellDropdown}
          >
            <button className="text-white relative">
              <img src={bellIcon} className="w-5 h-5" alt="" />
              {notifications.length > 0 && notifications[0].id && (
                <span className="bg-red-500 text-white  absolute h-[2px] w-[2px] p-[5px] top-0 right-0 rounded-full">
                  {/* {notifications.length} */}
                </span>
              )}
            </button>
            {isBellDropdownOpen && notifications.length > 0 && (
              <div className="absolute bg-white z-[999999] h-96 overflow-scroll example w-96 right-0 mt-1 p-2  border rounded-lg shadow-lg">
                {!isNotificationLoading ?
                  <>
                    {(notifications[0].id) ?
                      <>
                        {notifications.map((notification, index) => (
                          <div key={notification.id} onClick={() => { deleteNotification(notification.id) }} className="text-gray-800 my-4 p-2 rounded-md cursor-pointer hover:bg-orange-400 hover:text-white">
                            {notification.message}
                            <div className="text-gray-500 text-xs">
                              {DateTimeConverter(notification.time)}
                            </div>
                          </div>
                        ))}
                      </>
                      :
                      <div className=" text-black w-full h-full flex items-center justify-center  ">No Notifications</div>
                    }
                  </>
                  :
                  <div className="self-start   p-2 rounded-lg w-full h-full flex items-center justify-center ">
                    <div className="dot-pulse1">
                      <div className="dot-pulse1__dot"></div>
                    </div>
                  </div>}

              </div>
            )}
          </div>}
        </nav>
      </div>
    </header>
  );
}
