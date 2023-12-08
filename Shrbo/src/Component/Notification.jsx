import React, { useState } from "react";

export default function Notification({ notifications, onClose }) {
  return (
    <div className="notification-container h-[80vh] pb-32 overflow-auto example">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="notification bg-orange-200 rounded-xl  border-2 p-3  shadow mb-2 cursor-pointer"
          onClick={() => onClose(notification.id)}
        >
          <span>{notification.message}</span>
          <div className="text-gray-500 text-xs">
                      {notification.date}
                    </div>
          {/* You can add a close button here if needed */}
        </div>
      ))}
    </div>
  );
}
