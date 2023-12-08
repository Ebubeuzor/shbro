import React, { useState } from "react";
import HamburgerMenu from "hamburger-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png"

export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" md:hidden bg-blue-500  relative flex items-center justify-between px-4 py-2">
      {/* Logo */}
      <div className="text-xl font-bold text-white">    <img
            src={Logo}
            alt="Logo"
            className="h-16 w-16 mr-2"
          /></div>

      {/* Hamburger Menu */}
      <div className="hamburger-button z-40" onClick={toggleMenu}>
        <HamburgerMenu
          toggled={isOpen}
          toggle={toggleMenu}
          size={30}
          color="white"
        />
      </div>

      {/* Menu */}
      {isOpen && (
        <div className="menu absolute top-12 right-0 bg-white p-4 space-y-2 z-40">
          <ul>
            <li>
              <Link to="/Chat">Chat</Link>
            </li>
            <li>
              <Link to="/WishList">WishList</Link>
            </li>
            <li>
              <Link to="/Trip">Trip</Link>
            </li>
            <li>
              <Link to="/Settings">Settings</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
