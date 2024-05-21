import React, { useState } from "react";

export default function Notification({ notifications, onClose }) {

  const DateTimeConverter = (date) => {
    // Create a new Date object from the provided date string
    const originalDate = new Date(date);

    // Define months array
    const months = [
      "Jan", "Feb", "Mar", "Apr",
      "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"
    ];

    // Extract day, month, year, hours, and minutes from the date object
    const day = originalDate.getDate();
    const monthIndex = originalDate.getMonth();
    const year = originalDate.getFullYear();
    let hours = originalDate.getHours();
    const minutes = originalDate.getMinutes();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Format the date string
    const formattedDate = `${months[monthIndex]} ${day}, ${year} ${hours}:${minutes} ${amOrPm}`;

    // Render the formatted date
    return formattedDate;
  };
  return (
    <div className="notification-container h-[80vh] pb-32 overflow-auto example">
      <>
        {(notifications[0]?.id) ?
          <>

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="notification bg-orange-200 rounded-xl  border-2 p-3  shadow mb-2 cursor-pointer"
                onClick={() => onClose(notification.id)}
              >
                <span>{notification.message}</span>
                <div className="text-gray-500 text-xs">
                  {DateTimeConverter(notification.time)}
                </div>
                {/* You can add a close button here if needed */}
              </div>
            ))}
          </>
          :
          <div className=" text-black w-full h-full flex items-center justify-center  ">No Notifications</div>
        }

      </>
    </div>
  );
}
