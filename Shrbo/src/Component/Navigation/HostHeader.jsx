import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HostModal from "../Dashboard/HostModal";
import Logo from "../../assets/logo.png"

export default function HostHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    console.log("Menu clicked"); // Add this line to check if the click event is triggered
    setIsModalOpen(!isModalOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isDropdownOpen) {
        const dropdown = document.getElementById("profile-dropdown");
        if (dropdown && !dropdown.contains(event.target)) {
          closeDropdown();
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-gray-800 text-white py-2 border-b hidden md:block">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-semibold">
       <Link to="/">
       <img
            src={Logo}
            alt="Logo"
            className="h-16 w-16 mr-2"
          />
       </Link>
        </div>
        <nav className="flex">
          <Link to="/Hosting" className="text-white hover:text-gray-300 ml-4">
            Today
          </Link>
          <Link to="/chat" className="text-white hover:text-gray-300 ml-4">
            Inbox
          </Link>
          <Link to="/HostAnalysis" className="text-white hover:text-gray-300 ml-4">
            Analysis
          </Link>
          <Link to="/Schduler" className="text-white hover:text-gray-300 ml-4">
            Calender
            </Link>
            <Link to="/HostPayment" className="text-white hover:text-gray-300 ml-4">
            Payment
            </Link>
        </nav>
        <div>
        <div
            id="profile-dropdown"
            className={`relative ${isDropdownOpen ? "group" : ""}`}
            onClick={toggleDropdown}
            tabIndex={0}
          >
      
            <Link to="" className="text-white hover:text-gray-300 ml-4">
               Menu
            </Link>
            {isDropdownOpen && (
              <div className="absolute bg-white z-[60] right-0 mt-1 p-2 w-64 border rounded-lg shadow-lg ">
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
                <Link
                  to="/Hosting"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                
                >
                  Manage Listings
                </Link>
                <Link
                  to="/Listings"
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                
                >
                   Listings
                </Link>
                <Link
                  to=""
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                
                >
                   Visit the help center
                </Link>
                <Link
                  to=""
                  className="block text-gray-800 hover:text-orange-400 p-2 cursor-pointer"
                
                >
                   Get help with a safety issue
                </Link>

                <Link
                  to="/logout"
                  className="block text-gray-800 hover:text-red-500 p-2 cursor-pointer"
                >
                  Logout
                </Link>
              </div>
            )}
            <HostModal isOpen={isModalOpen} onClose={toggleModal} />
          </div>
        </div>
      </div>
    </header>
  );
}
