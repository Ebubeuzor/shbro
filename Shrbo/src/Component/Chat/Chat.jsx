import React, { useState } from "react";
import ChatCard from "./ChatCard";
import ChatContainer from "./ChatContainer";
import sendButton from "../../assets/svg/angle-circle-left-icon.svg";
import BottomNavigation from "../Navigation/BottomNavigation";
import Header from "../Navigation/Header";

export default function Chat() {
  const [showGreen, setShowGreen] = useState(true);

  const toggleGreen = () => {
    // Prevent toggling on larger screens (desktop)
    if (window.innerWidth <= 768) {
      setShowGreen(!showGreen);
    }
  };

  return (
    <div className="h-[100vh]">
      {/* <Header /> */}
      <div className="grid grid-cols-3 ">
        {/* Only show green part on mobile */}
        {showGreen && (
          <div className=" col-span-5 md:col-span-1 h-[100vh] overflow-auto  border-r-[1px]">
            <div onClick={toggleGreen}>
              <ChatCard />
            </div>
          </div>
        )}

        {/* Show yellow part on desktop */}
        <div
          className={`col-span-3 md:col-span-2 mb-32   ${
            showGreen ? "hidden md:block" : ""
          }`}
        >
          {window.innerWidth <= 768 && (
            <div className="ml-4 mt-4">
              <span onClick={toggleGreen}>
                <img src={sendButton} className="w-4" alt="" />
              </span>
            </div>
          )}

          <ChatContainer />
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
