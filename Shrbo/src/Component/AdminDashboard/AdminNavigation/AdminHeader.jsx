import React, { useState } from "react";
import bellIcon from "../../../assets/svg/bell-icon.svg";
import HamburgerMenu from "./HamburgerMenu";
import HamburgerMenuComponent from "./HamburgerMenu";

export default function AdminHeader() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the isOpen state when the hamburger icon is clicked
  };

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "New booking request for Property XYZ. Check details and confirm the reservation.",
      date: "Oct 15, 2023",
    },
    {
      id: 2,
      message:
        "Guests for Property ABC will be arriving soon. Ensure everything is ready for their check-in on [date].",
      date: "Oct 18, 2023",
    },
    {
      id: 3,
      message:
        "Don't forget to encourage guests from Property DEF to leave a review. It boosts your property's profile!",
      date: "Oct 20, 2023",
    },
    {
      id: 4,
      message:
        "Maintenance required at Property GHI. Schedule a visit to address issues reported by guests.",
      date: "Oct 22, 2023",
    },
    {
      id: 5,
      message:
        "Payment received for booking at Property JKL. Check your account for transaction details.",
      date: "Oct 25, 2023",
    },
    {
      id: 6,
      message:
        "Guests have checked out from Property MNO. Confirm the condition of the property and report any issues.",
      date: "Oct 28, 2023",
    },
    {
      id: 7,
      message:
        "Provide emergency contact information to guests staying at Property PQR. Ensure their safety and comfort.",
      date: "Nov 1, 2023",
    },
    {
      id: 8,
      message:
        "Create a special offer for Property STU to attract more bookings. Limited-time discounts available!",
      date: "Nov 5, 2023",
    },
    {
      id: 9,
      message:
        "Weather advisory for guests at Property VWX. Inform them about any potential weather-related impacts.",
      date: "Nov 8, 2023",
    },
    {
      id: 10,
      message:
        "Share information about upcoming local events near Property YZ. Enhance your guests' experience.",
      date: "Nov 12, 2023",
    },
  ]);
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
            {notifications.map((notification, index) => (
                  <div
                    key={index}
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
                    <li className="">Profile</li>

                    <li className="">Logout</li>
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
