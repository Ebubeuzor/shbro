import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa"; // You can use any icon from React-Icons

export default function AdminSidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertiesShowDropdown, setPropertiesShowDropdown] = useState(false);
  const [financeShowDropdown, setFinanceShowDropdown] = useState(false);
  const [bookingStatusShowDropdown, setBookingStatusShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const togglePropertiesDropdown = () => {
    setPropertiesShowDropdown(!propertiesShowDropdown);
  };

  const toggleFinanceDropdown = () => {
    setFinanceShowDropdown(!financeShowDropdown);
  };

  const toggleBookingStatusDropdown = () => {
    setBookingStatusShowDropdown(!bookingStatusShowDropdown);
  };

  return (
    <div className="bg-orange-800 text-white p-4">
      <ul>
        <Link to="/AdminAnalytical">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full ">
            Dashboard
          </li>
        </Link>
        <Link to="/EditHomepage">
          <li className="p-2 hover-bg-orange-400 cursor-pointer w-full">
            Edit Homepage
          </li>
        </Link>
        <li
          className={`p-2 cursor-pointer w-full ${showDropdown ? "" : ""}`}
          onClick={toggleDropdown}
        >
          <div className="flex justify-between items-center">
            Manage Users <FaAngleDown />
          </div>{" "}
          <ul
            className={`list-none ${
              showDropdown ? "block bg-orange-300" : "hidden"
            }`}
          >
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/GuestsListings" className="w-full"><div>
              Guests</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/HostsListings" className=""><div>
              Hosts</div></Link>
            </li>
          </ul>
        </li>

        <li
          className={`p-2 cursor-pointer w-full ${
            propertiesShowDropdown ? "" : ""
          }`}
          onClick={togglePropertiesDropdown}
        >
          <div className="flex justify-between items-center">
            Property <FaAngleDown />
          </div>
          <ul
            className={`list-none ${
              propertiesShowDropdown ? "block bg-orange-300" : "hidden"
            }`}
          >
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/PropertyList"><div>
              Properties Listings</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/ApartmentListingApproval">
                <div>
                Property Listing Approval
                </div>
              </Link>
            </li>
          </ul>
        </li>

        <li
          className={`p-2 cursor-pointer w-full ${
            financeShowDropdown ? "" : ""
          }`}
          onClick={toggleFinanceDropdown}
        >
          <div className="flex justify-between items-center">
            Finance <FaAngleDown />
          </div>
          <ul
            className={`list-none ${
              financeShowDropdown ? "block bg-orange-300" : "hidden"
            }`}
          >
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/DisplayBookingsPaid"><div>
              Paid Payment</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/PendingPayment">Pending Payments</Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/FailedPayment"><div>
              Failed Payment</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/ReceivablePayable"><div>
              Recievable & Payable</div></Link>
            </li>
          </ul>
        </li>

        <li
          className={`p-2 cursor-pointer w-full ${
            bookingStatusShowDropdown ? "" : ""
          }`}
          onClick={toggleBookingStatusDropdown}
        >
          <div className="flex justify-between items-center">
            Booking Status <FaAngleDown />
          </div>
          <ul
            className={`list-none ${
              bookingStatusShowDropdown ? "block bg-orange-300" : "hidden"
            }`}
          >
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/BookingTable"><div>
              New Booking</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/CompletedBooking"><div>
              Completed Booking</div></Link>
            </li>
            <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              <Link to="/ReceivablePayable"><div>
              Recievable & Payable</div></Link>
            </li>
          </ul>
        </li>
        <Link to="/UserVerificationPage">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            User Verification Page
          </li>
        </Link>
        <Link to="/CanceledReservationTable">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
          Canceled Reservation Table
          </li>
        </Link>
        <Link to="/AdminRolesPage">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            Admin Roles
          </li>
        </Link>
        <Link to="/AdminSupportPage">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            Admin Support Page
          </li>
        </Link>
        <Link to="/AnnouncementPage">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            Announcement Page
          </li>
        </Link>

        <Link to="/ReviewList">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            Review List
          </li>
        </Link>
        <Link to="/UserVerificationDashboard">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
            User Verification Dashboard
          </li>
        </Link>
        <Link to="/ServiceChargeSettings">
          <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
          Service Charge Settings
          </li>
        </Link>
      </ul>
    </div>
  );
}
