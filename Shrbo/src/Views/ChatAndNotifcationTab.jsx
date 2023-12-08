import React, { useState } from "react";
import Chat from "../Component/Chat/Chat";
import Notification from "../Component/Notification";
import Header from "../Component/Navigation/Header";

export default function ChatAndNotifcationTab() {
  const [selectedTab, setSelectedTab] = useState("chats"); // "chats" or "notifications"

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

  const closeNotification = (id) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.id !== id
    );
    setNotifications(updatedNotifications);
  };

  const toggleGreen = () => {
    // Prevent toggling on larger screens (desktop)
    if (window.innerWidth <= 768) {
      // You can add your logic for toggling here
    }
  };

  return (
<div>
    <Header/>

    <div className="bg-gray-100">
        
        <div className="col-span-3 fixed top-0 left-0 right-0 bg-white rounded-md p-4 shadow md:hidden">
          <div className="flex space-x-2">
            <button
              className={`${
                selectedTab === "chats" ? "bg-orange-400 text-white" : "bg-orange-200"
              } p-2 rounded`}
              onClick={() => setSelectedTab("chats")}
            >
              Chats
            </button>
            <button
              className={`${
                selectedTab === "notifications"
                  ? "bg-black text-white"
                  : "bg-slate-700 text-white"
              } p-2 rounded`}
              onClick={() => setSelectedTab("notifications")}
            >
              Notifications
            </button>
          </div>
        </div>
  
        <div className="col-span-3 md:col-span-2 pt-20 md:pt-0 p-4   overscroll-auto example bg-white rounded-md shadow">
          {selectedTab === "chats" && (
            <Chat showGreen={window.innerWidth <= 768} />
          )}
  
          {selectedTab === "notifications" && (
            <Notification notifications={notifications} onClose={closeNotification} />
          )}
        </div>
      </div>
</div>
  );
}
