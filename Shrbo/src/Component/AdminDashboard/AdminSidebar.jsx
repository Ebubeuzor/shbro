import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa"; // You can use any icon from React-Icons
import Axios from "../../Axios";
export default function AdminSidebar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [propertiesShowDropdown, setPropertiesShowDropdown] = useState(false);
  const [financeShowDropdown, setFinanceShowDropdown] = useState(false);
  const [bookingStatusShowDropdown, setBookingStatusShowDropdown] =
    useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const togglePropertiesDropdown = () => {
    setPropertiesShowDropdown(!propertiesShowDropdown);
  };

  const toggleFinanceDropdown = () => {
    setFinanceShowDropdown(!financeShowDropdown);
  };

  const toggleBookingStatusDropdown = () => {
    setBookingStatusShowDropdown(!bookingStatusShowDropdown);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await Axios.get("/user");
        setUserInfo(response.data.adminRoles);
        console.log(response.data.adminRoles);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserInfo();
  }, []);
  // console.log(userInfo);

  return (
    <div className="bg-orange-800 text-white p-4 overflow-auto">
      <ul>
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "Dashboard") && (
            <Link to="/AdminAnalytical">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Dashboard
              </li>
            </Link>
          )}

        {userInfo &&
          userInfo.some((role) => role.rolePermission === "EditHomepage") && (
            <Link to="/EditHomepage">
              <li className="p-2 hover-bg-orange-400 cursor-pointer w-full">
                Edit Homepage
              </li>
            </Link>
          )}

        {userInfo &&
          userInfo.some((role) => role.rolePermission === "ManageUsers") && (
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
                  <Link to="/GuestsListings" className="w-full">
                    <div>Guests</div>
                  </Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/HostsListings" className="">
                    <div>Hosts</div>
                  </Link>
                </li>
              </ul>
            </li>
          )}

        {userInfo &&
          userInfo.some((role) => role.rolePermission === "Property") && (
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
                  <Link to="/PropertyList">
                    <div>Properties Listings</div>
                  </Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/ApartmentListingApproval">
                    <div>Property Listing Approval</div>
                  </Link>
                </li>
              </ul>
            </li>
          )}

        {userInfo &&
          userInfo.some((role) => role.rolePermission === "Finance") && (
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
                  <Link to="/DisplayBookingsPaid">
                    <div>Paid Payment</div>
                  </Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/PendingPayment">Pending Payments</Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/FailedPayment">
                    <div>Failed Payment</div>
                  </Link>
                </li>
                {/* <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
          <Link to="/ReceivablePayable"><div>
          Receivable & Payable</div></Link>
        </li> */}
              </ul>
            </li>
          )}

        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "SecurityDeposit"
          ) && (
            <Link to="/AdminSecurityDeposit">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Security Deposit
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "BookingStatus") && (
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
                  <Link to="/BookingTable">
                    <div>New Booking</div>
                  </Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/CompletedBooking">
                    <div>Completed Booking</div>
                  </Link>
                </li>
                <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                  <Link to="/ReceivablePayable">
                    <div>Receivable & Payable</div>
                  </Link>
                </li>
              </ul>
            </li>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "UserVerificationPage"
          ) && (
            <Link to="/UserVerificationPage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                User Verification Page
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "CanceledReservationTable"
          ) && (
            <Link to="/CanceledReservationTable">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Canceled Reservation Table
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "AdminRoles") && (
            <Link to="/AdminRolesPage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Admin Roles
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "ApartmentReporting"
          ) && (
            <Link to="/AdminSupportPage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Apartment Reporting
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "ReportDamages") && (
            <Link to="/AdminDamagePage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Report Damages
              </li>
            </Link>
          )}
           {userInfo &&
          userInfo.some((role) => role.rolePermission === "AdminUserReports") && (
            <Link to="/AdminUserReports">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                User Reported
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "AnnouncementPage"
          ) && (
            <Link to="/AnnouncementPage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Announcement Page
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "CommunicationCenter"
          ) && (
            <Link to="/CommunicationCenter">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Communication Center
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "ReviewList") && (
            <Link to="/ReviewList">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Review List
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some(
            (role) => role.rolePermission === "UserVerificationDashboard"
          ) && (
            <Link to="/UserVerificationDashboard">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                User Verification Dashboard
              </li>
            </Link>
          )}
        {userInfo &&
          userInfo.some((role) => role.rolePermission === "ServiceCharge") && (
            <Link to="/ServiceChargeSettings">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
                Service Charge Settings
              </li>
            </Link>
          )}
           {userInfo &&
          userInfo.some((role) => role.rolePermission === "SocialLink") && (
            <Link to="/SocialPage">
              <li className="p-2 hover:bg-orange-400 cursor-pointer w-full">
              Social Page
              </li>
            </Link>
          )}


      </ul>
    </div>
  );
}
