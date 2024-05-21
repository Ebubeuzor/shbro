import React, { useState, useEffect } from "react";
import Axios from "../../Axios";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useStateContext } from "../../ContextProvider/ContextProvider";

const HouseRulesTab = () => {
  const [listingDetails, setListingDetails] = useState(null);
  const { id } = useParams(); // Get the ID parameter from the route
  const { token } = useStateContext();
  console.log(token);

  useEffect(() => {
    const fetchListingDetails = async () => {
      let response;
      try {
        if (token) {
          // If token exists, fetch details for authenticated user
          response = await Axios.get(`showGuestHomeForAuthUser/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // If token doesn't exist, fetch details for unauthenticated user
          response = await Axios.get(`showGuestHomeForUnAuthUser/${id}`);
        }
        setListingDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };
  
    fetchListingDetails();
  }, [id, token]);
  

  if (!listingDetails) {
    return <div>Loading...</div>;
  }

  const rules = listingDetails.rules || [];
  const notices = listingDetails.notices || [];
  const checkin = listingDetails.checkin || [];

  const checkout = listingDetails.checkout || [];

  const checkInString = listingDetails.checkin || "";
  const checkInParts = checkInString.match(/(\d+):(\d+) (AM|PM)/i);

  let checkInTime = null;
  let checkoutTime = null;

  if (checkInParts && checkInParts.length === 4) {
    const hours = parseInt(checkInParts[1]);
    const minutes = parseInt(checkInParts[2]);
    const period = checkInParts[3].toUpperCase();

    // Convert to 24-hour format
    const adjustedHours = period === 'PM' && hours < 12 ? hours + 12 : hours;

    checkInTime = new Date(2000, 0, 1, adjustedHours, minutes);
    checkoutTime = new Date(checkInTime.getTime() + 24 * 60 * 60 * 1000);
  }

  const formatTime = (time) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Intl.DateTimeFormat('en-US', options).format(time);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
        <div className="mb-4">
        <h3 className="text-xl font-semibold">Check-in Information</h3>
        <p className="text-gray-600  mb-2">
              Please note the check-in and checkout times for your stay.
            </p>
        {checkInTime && (
          <div className=" border-gray-200 ">
            <p className="text-sm">
              <strong>Check-in:</strong> {checkin}
            </p>
            {checkoutTime && (
              <p className="text-sm mt-2">
                <strong>Checkout:</strong> {checkout}
              </p>
            )}
           
          </div>
        )}
      </div>
      <h2 className="text-2xl font-bold mb-6">House Rules and Notices</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Display Rules */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">House Rules</h3>
          {rules.map((rule) => (
            <div key={rule.id} className="mb-4">
              <div className="flex items-center mb-2">
                {rule.rule.toLowerCase().includes("guest") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <title>account-group</title>
                      <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                    </svg>
                  </span>
                )}
                {rule.rule.toLowerCase().includes("pets") && (
                  <span className="mx-2">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <title>paw-off</title>{" "}
                      <path d="M2,4.27L3.28,3L21.5,21.22L20.23,22.5L18.23,20.5C18.09,20.6 17.94,20.68 17.79,20.75C16,21.57 13.88,19.87 11.89,19.87C9.9,19.87 7.76,21.64 6,20.75C5,20.26 4.31,18.96 4.44,17.88C4.62,16.39 6.41,15.59 7.47,14.5C8.21,13.77 8.84,12.69 9.55,11.82L2,4.27M8.35,3C9.53,2.83 10.78,4.12 11.14,5.9C11.32,6.75 11.26,7.56 11,8.19L7.03,4.2C7.29,3.55 7.75,3.1 8.35,3M15.5,3C16.69,3.19 17.35,4.77 17,6.54C16.62,8.32 15.37,9.61 14.19,9.43C13,9.25 12.35,7.67 12.72,5.9C13.08,4.12 14.33,2.83 15.5,3M3,7.6C4.14,7.11 5.69,8 6.5,9.55C7.26,11.13 7,12.79 5.87,13.28C4.74,13.77 3.2,12.89 2.41,11.32C1.62,9.75 1.9,8.08 3,7.6M21,7.6C22.1,8.08 22.38,9.75 21.59,11.32C20.8,12.89 19.26,13.77 18.13,13.28C17,12.79 16.74,11.13 17.5,9.55C18.31,8 19.86,7.11 21,7.6Z" />
                    </svg>
                  </span>
                )}
                {rule.rule.toLowerCase().includes("events") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <title>party-popper</title>
                      <path d="M14.53 1.45L13.45 2.53L15.05 4.13C15.27 4.38 15.38 4.67 15.38 5S15.27 5.64 15.05 5.86L11.5 9.47L12.5 10.55L16.13 6.94C16.66 6.35 16.92 5.7 16.92 5C16.92 4.3 16.66 3.64 16.13 3.05L14.53 1.45M10.55 3.47L9.47 4.55L10.08 5.11C10.3 5.33 10.41 5.63 10.41 6S10.3 6.67 10.08 6.89L9.47 7.45L10.55 8.53L11.11 7.92C11.64 7.33 11.91 6.69 11.91 6C11.91 5.28 11.64 4.63 11.11 4.03L10.55 3.47M21 5.06C20.31 5.06 19.67 5.33 19.08 5.86L13.45 11.5L14.53 12.5L20.11 6.94C20.36 6.69 20.66 6.56 21 6.56S21.64 6.69 21.89 6.94L22.5 7.55L23.53 6.47L22.97 5.86C22.38 5.33 21.72 5.06 21 5.06M7 8L2 22L16 17L7 8M19 11.06C18.3 11.06 17.66 11.33 17.06 11.86L15.47 13.45L16.55 14.53L18.14 12.94C18.39 12.69 18.67 12.56 19 12.56C19.33 12.56 19.63 12.69 19.88 12.94L21.5 14.53L22.55 13.5L20.95 11.86C20.36 11.33 19.7 11.06 19 11.06Z" />
                    </svg>
                  </span>
                )}
                {rule.rule.toLowerCase().includes("smoking") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24px"
                      height="24px"
                    >
                      <title>smoking-off</title>
                      <path d="M2,6L9,13H2V16H12L19,23L20.25,21.75L3.25,4.75L2,6M20.5,13H22V16H20.5V13M18,13H19.5V16H18V13M18.85,4.88C19.47,4.27 19.85,3.43 19.85,2.5H18.35C18.35,3.5 17.5,4.35 16.5,4.35V5.85C18.74,5.85 20.5,7.68 20.5,9.92V12H22V9.92C22,7.69 20.72,5.77 18.85,4.88M14.5,8.7H16.03C17.08,8.7 18,9.44 18,10.75V12H19.5V10.41C19.5,8.61 17.9,7.25 16.03,7.25H14.5C13.5,7.25 12.65,6.27 12.65,5.25C12.65,4.23 13.5,3.5 14.5,3.5V2A3.35,3.35 0 0,0 11.15,5.35A3.35,3.35 0 0,0 14.5,8.7M17,15.93V13H14.07L17,15.93Z" />
                    </svg>
                  </span>
                )}
                 {!rule.rule.toLowerCase().includes("guest") &&
        !rule.rule.toLowerCase().includes("pets") &&
        !rule.rule.toLowerCase().includes("events") &&
        !rule.rule.toLowerCase().includes("smoking") && (
          <span className="mx-2">
            <FaPlus/>
          </span>
        )}
                <h4 className="text-md font-medium">{rule.rule}</h4>
              </div>
              {/* <p className="text-sm text-gray-600">{rule.rule}</p> */}
            </div>
          ))}
        </div>
        {/* Display Notices */}
        <div className="col-span-1">
          <h3 className="text-lg font-semibold mb-4">Notices</h3>
          {notices.map((notice) => (
            <div key={notice.id} className="mb-4">
              <div className="flex items-center mb-2">
                {/* Add conditional rendering for notice icons */}
                {notice.notice.toLowerCase().includes("security") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 2v4m0 16v4M22 12h-4m-16 0H2M12 2L9 6h6l-3-4z" />
                    </svg>
                  </span>
                )}
                {notice.notice.toLowerCase().includes("weapons") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="15" x2="19" y2="19" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                      <line x1="19" y1="5" x2="15" y2="9" />
                      <line x1="9" y1="15" x2="5" y2="19" />
                    </svg>
                  </span>
                )}
                {notice.notice.toLowerCase().includes("dangerous") && (
                  <span className="mx-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16h2v-2h-2zm0-4h2V8h-2z" />
                      <circle cx="12" cy="14" r="1" />
                      <circle cx="12" cy="10" r="1" />
                    </svg>
                  </span>
                )}
                <h4 className="text-md font-medium">{notice.notice}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseRulesTab;
