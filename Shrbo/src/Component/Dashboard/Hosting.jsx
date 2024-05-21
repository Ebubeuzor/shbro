import React, { useEffect, useState } from "react";
import exclammationMark from "../../assets/svg/exclamation-round-icon.svg";
import GoBackButton from "../GoBackButton";
import SuperHostGuidanceCard from "../SuperHostGuidanceCard";
import { Link } from "react-router-dom";
import HostHeader from "../Navigation/HostHeader";
import HostBottomNavigation from "./HostBottomNavigation";
import Notificationbell from "../../assets/bell-icon.png";
import InfoCard from "../InfoCard";
import AlertCard from "../AlertCard";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import axios from "../../Axios";
import { message, notification, Popconfirm } from 'antd';
import Popup from "../../hoc/Popup";
import { LoadingOutlined } from '@ant-design/icons';
import { styles } from "../ChatBot/Style";
import logoImage from "../../assets/logo.png"

export default function Hosting() {
  const [activeTab, setActiveTab] = useState("checkingOut");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { setUser, setToken, token, setHost, setAdminStatus, user, host } = useStateContext();
  const [isBellDropdownOpen, setIsBellDropdownOpen] = useState(false);
  const [tips, setTips] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [checking, setChecking] = useState([]);
  const [pending, setPending] = useState([]);
  const [arriving, setArriving] = useState([]);
  const [hosting, setHosting] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGeneral, setLoadingGeneral] = useState(true);
  const [isCohostModalOpen, setCohostModalOpen] = useState(false);
  const [isCohostListModalOpen, setCohostListModalOpen] = useState(false);
  const [isAddingCohostLoading, setAddingCohostLoading] = useState(false);
  const [isCohostLoading, setCohostLoading] = useState(false);
  const [coHostEmail, setCoHostEmail] = useState("");
  const [errorCohost, setErrorCohost] = useState("");
  const [cohostList, setCohostList] = useState([]);

  const [isNotificationDeleted, setNotificationDeleted] = useState(false);
  const [tabLoading, setTabLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    // {
    //   id: 1,
    //   message:
    //     "New booking request for Property XYZ. Check details and confirm the reservation.",
    //   date: "Oct 15, 2023",
    // },
    // {
    //   id: 2,
    //   message:
    //     "Guests for Property ABC will be arriving soon. Ensure everything is ready for their check-in on [date].",
    //   date: "Oct 18, 2023",
    // },
    // {
    //   id: 3,
    //   message:
    //     "Don't forget to encourage guests from Property DEF to leave a review. It boosts your property's profile!",
    //   date: "Oct 20, 2023",
    // },
    // {
    //   id: 4,
    //   message:
    //     "Maintenance required at Property GHI. Schedule a visit to address issues reported by guests.",
    //   date: "Oct 22, 2023",
    // },
    // {
    //   id: 5,
    //   message:
    //     "Payment received for booking at Property JKL. Check your account for transaction details.",
    //   date: "Oct 25, 2023",
    // },
    // {
    //   id: 6,
    //   message:
    //     "Guests have checked out from Property MNO. Confirm the condition of the property and report any issues.",
    //   date: "Oct 28, 2023",
    // },
    // {
    //   id: 7,
    //   message:
    //     "Provide emergency contact information to guests staying at Property PQR. Ensure their safety and comfort.",
    //   date: "Nov 1, 2023",
    // },
    // {
    //   id: 8,
    //   message:
    //     "Create a special offer for Property STU to attract more bookings. Limited-time discounts available!",
    //   date: "Nov 5, 2023",
    // },
    // {
    //   id: 9,
    //   message:
    //     "Weather advisory for guests at Property VWX. Inform them about any potential weather-related impacts.",
    //   date: "Nov 8, 2023",
    // },
    // {
    //   id: 10,
    //   message:
    //     "Share information about upcoming local events near Property YZ. Enhance your guests' experience.",
    //   date: "Nov 12, 2023",
    // },
  ]);

  /// ************ Notification Logic*****************************

  const receiverId = parseInt(localStorage.getItem("receiverid"), 10);

  const deleteNotification = async (notificationId) => {
    try {
      const response = await axios.delete(`/notification/${notificationId}`);
      console.log("Deleted Notification", response.data)

      message.success("notification deleted successfully")
      setNotificationDeleted(!isNotificationDeleted);

    } catch (error) {
      message.error("could not delete notification")

    }

  }


  useEffect(() => {

    if (token) {
      axios.get("/notification").then(response => {
        setNotifications([...response.data.data]);
        console.log("notification", [...response.data.data]);
      }).catch(error => {
        // console.log("Error",error);
      });
    }
  }, [isNotificationDeleted, token]);


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

  const initializeEcho = (token, receiverId) => {
    if (typeof window.Echo !== "undefined") {
      const channelName = `App.Models.User.${receiverId}`;

      window.Echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
      console.log(
        "Authentication token is set:",
        window.Echo.connector.options.auth.headers.Authorization
      );

      const privateChannel = window.Echo.private(channelName);

      privateChannel.listen("NewNotificationEvent", (data) => {
        // console.log("Received Notification:", data);
        // console.log("User ID:", data.user_id);

        setNotifications([data.notification, ...notifications]);

      });

      console.log("Listening for messages on channel:", channelName);
    } else {
      console.error(
        "Echo is not defined. Make sure Laravel Echo is properly configured."
      );
    }
  };


  useEffect(() => {
    if (token) {

      initializeEcho(token, receiverId);
    }
  }, [token]);





  ////  End



  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleBellDropdown = () => {
    setIsBellDropdownOpen(!isBellDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const closeBellDropdown = () => {
    setIsBellDropdownOpen(false);
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       // Make a request to get the user data
  //       const response = await axios.get("/user"); // Adjust the endpoint based on your API

  //       // Set the user data in state
  //       setUser(response.data);
  //       setHost(response.data.host);
  //       setAdminStatus(response.data.adminStatus);

  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     } finally {
  //       // Set loading to false regardless of success or error

  //     }
  //   };

  //   fetchUserData();
  // }, []);

  useEffect(() => {
    // const fetchUserTips = async () => {
    //   try {
    //     // Make a request to get the user data
    //     const tipsResponse = await axios.get("/userTips"); // Adjust the endpoint based on your API

    //     setTips(tipsResponse.data);

    //     console.log("hello")



    //   } catch (error) {
    //     console.error("Error fetching user data:", error);
    //   } finally {
    //     // Set loading to false regardless of success or error

    //   }
    // };

    const fetchInitialData = async () => {
      // setTabLoading(true);
      await fetchUpcomingData();
      await fetchCheckingOut();
      await fetchCurrentlyHosting();
      await fetchArrivingSoon();
      await fetchPendingReview();
      // setTabLoading(false);
    };


    const fetchData = async () => {
      try {
        // Make a request to get the user data
        const UserResponse = await axios.get("/user"); // Adjust the endpoint based on your API

        // Set the user data in state
        setUser(UserResponse.data);
        setHost(UserResponse.data.host);
        setAdminStatus(UserResponse.data.adminStatus);


        const tipsResponse = await axios.get("/userTips"); // Adjust the endpoint based on your API

        setTips(tipsResponse.data);

      



        console.log("hello")

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Set loading to false regardless of success or error
        setLoadingGeneral(false);
        setLoading(false);

      }
    };


    fetchData();
    fetchInitialData();

    // fetchUserTips();
    // fetchInitialData();
  }, []);

  // useEffect(() => {

  //   setLoading(true);

  //   switch (activeTab) {
  //     case "upcoming":
  //       fetchUpcomingData();
  //       break;
  //     case "checkingOut":
  //       fetchCheckingOut()
  //       break;
  //     case "currentlyHosting":
  //       fetchCurrentlyHosting();
  //       break;
  //     case "arrivingSoon":
  //       fetchArrivingSoon();
  //       break;
  //     case "pendingReview":
  //       fetchPendingReview();
  //       break;
  //     default:
  //       setLoading(false);
  //       break;
  //   }
  // }, [activeTab]);

  const handleTabClick = async (tab) => {
    if (tab === activeTab) {
      return;
    }
    setActiveTab(tab);
    console.log("CHAT")

    setLoading(true);
    switch (tab) {
      case "upcoming":
        await fetchUpcomingData();
        break;
      case "checkingOut":
        await fetchCheckingOut()
        break;
      case "currentlyHosting":
        await fetchCurrentlyHosting();
        break;
      case "arrivingSoon":
        await fetchArrivingSoon();
        break;
      case "pendingReview":
        await fetchPendingReview();
        break;
      default:
        setLoading(false);
        break;
    }
  };

  // const fetchInitialData = async () => {
  //   // setTabLoading(true);
  //   await fetchUpcomingData();
  //   await fetchCheckingOut();
  //   await fetchCurrentlyHosting();
  //   await fetchArrivingSoon();
  //   await fetchPendingReview();
  //   // setTabLoading(false);
  // };

  // useEffect(() => {
  //   fetchInitialData();
  // }, []);

  const fetchUpcomingData = async () => {
    await axios.get("/upcomingReservation").then(response => {
      const filteredUpcoming = response.data.bookings.map(item => ({
        id: item.aboutGuest.id,
        name: item.name,
        checkInDate: item.check_in_date,
        checkOutDate: item.check_out_date,
        // amountPaid: "half payment made",
        time: item.check_out_time,
        image: item.profilepic ? item.profilepic : logoImage,
      }));
      setUpcoming(filteredUpcoming);
      console.log(response.data);
    }).catch(err => {
      console.log("Upcoming", err);
    })
      .finally(() =>
        setLoading(false)

      );

  }

  const fetchPendingReview = async () => {
    try {
      const response = await axios.get("/getHostPendingReviews");
      const filteredData = response.data.data.map(item => ({
        name: item.username,
        checkInDate: item.check_in,
        id: item.userid,
        reservationId: item.id,
        image: item.guestProfilePic ? item.guestProfilePic : logoImage,
      }));
      setPending(filteredData)
      console.log("pending", response);
    } catch (error) {
      console.log("pending", error);
    }
    finally {
      setLoading(false);
    }


  }

  const fetchArrivingSoon = async () => {
    try {
      const response = await axios.get("/arrivingSoon");
      const filteredData = response.data.bookings.map(item => ({
        name: item.name,
        id: item.aboutGuest.id,
        date: item.check_in_date,
        time: item.check_in_time,
        image: item.profilepic ? item.profilepic : logoImage,
      }));
      setArriving(filteredData)
      console.log("Arriving", filteredData);
    } catch (error) {
      console.log("Arriving", error);
    } finally {
      setLoading(false);
    }


  }

  const fetchCurrentlyHosting = async () => {
    try {
      const response = await axios.get("/currentlyHosting");
      const filteredData = response.data.bookings.map(item => ({
        name: item.name,
        id: item.aboutGuest.id,
        date: item.check_in_date + "-" + item.check_out_date,
        image: item.profilepic ? item.profilepic : logoImage,
      }));
      setHosting(filteredData)
      console.log("CurrentlyHosting", filteredData);
    } catch (error) {
      console.log("CurrentlyHosting", error);
    }
    finally {
      setLoading(false);
    }

  }

  const fetchCheckingOut = async () => {
    try {
      const response = await axios.get("/checkingOut");
      const filteredData = response.data.bookings.map(item => ({
        name: item.name,
        id: item.aboutGuest.id,
        date: item.check_out_date,
        time: item.check_in_time,
        image: item.profilepic ? item.profilepic : logoImage,
      }));
      setChecking(filteredData)
      console.log("CheckingOut", filteredData);
    } catch (error) {
      console.log("CheckingOut", error);
    }
    finally {
      setLoading(false);
    }

  }


  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (isProfileDropdownOpen) {
        const profileDropdown = document.getElementById("profile-dropdown");
        if (profileDropdown && !profileDropdown.contains(event.target)) {
          closeProfileDropdown();
        }
      }

      if (isBellDropdownOpen) {
        const bellDropdown = document.getElementById("bell-dropdown");
        if (bellDropdown && !bellDropdown.contains(event.target)) {
          closeBellDropdown();
        }
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isProfileDropdownOpen, isBellDropdownOpen]);

  const checkingOut = [
    ...checking,
    // {
    //   name: "Endo",
    //   date: " Oct 22",
    //   time: "12:00pm",

    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Endo",
    //   date: "Today",
    //   time: "12:00pm",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Endo",
    //   date: " Oct 22",
    //   time: "12:00pm",

    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Endo",
    //   date: " Expired",
    //   time: "12:00pm",

    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
  ];

  const currentlyHosting = [
    ...hosting,
    // {
    //   name: "Sonia",
    //   date: "Sept 22 - Oct 22",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Abigail",
    //   date: "Sept 22 - Oct 22",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Joy",
    //   date: "Sept 22 - Oct 22",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Soma",
    //   date: "Sept 22 - Oct 22",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
  ];

  const arrivingSoonReservations = [

    // {
    //   name: "John",
    //   date: "Oct 25",
    //   time: "3:00pm",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Alice",
    //   date: "Oct 26",
    //   time: "2:30pm",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    ...arriving,
  ];

  const upcomingReservations = [
    // {
    //   name: "Michael Jackson",
    //   checkInDate: "Nov 10 2023",
    //   checkOutDate: "Nov 10 2023",
    //   // amountPaid: "half payment made",
    //   time: "4:00pm",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "William",
    //   checkInDate: "Dec 10 2023",
    //   checkOutDate: "Nov 10 2023",
    //   // amountPaid: "full payment made",
    //   time: "4:00pm",
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    ...upcoming,
  ];

  const pendingReviews = [
    // {
    //   name: "John",
    //   checkInDate: "Oct 25, 2023",
    //   reservationId: 123,
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    // {
    //   name: "Alice",
    //   checkInDate: "Oct 26, 2023",
    //   reservationId: 124,
    //   image:
    //     "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    // },
    ...pending,
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "checkingOut":
        if (checkingOut.length === 0) {
          return (
            <div className=" mt-4 h-36 flex justify-center items-center">
              No guest needs to be checked out.
            </div>
          );
        }
        return (
          <div className="  mt-4">
            <div className="whitespace-nowrap overflow-x-auto example">
              <div className="flex space-x-3 w-fit p-6 ">
                {checkingOut.map((host, index) => (
                  <div
                    className="shadow-xl border-2 w-[300px] p-4 mt-4 rounded-xl bg-white "
                    key={index}
                  >
                    <div className="current text-orange-300 text-sm">
                      Checking out
                    </div>
                    <div className="flex items-center  gap-2 justify-between mt-5 flex-wrap">
                      <div className="guest-name">
                        <h1>{host.name}</h1>
                        <p>{host.date}</p>
                        <p>{host.time}</p>
                      </div>
                      <div className="guest-image">
                        <Link to={`/UserDetails/${host.id}`}>
                          <img
                            src={host.image || logoImage}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* <button className="bg-orange-400 rounded-full py-2 px-4 w-full text-white ">
                        message
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "currentlyHosting":
        if (currentlyHosting.length === 0) {
          return (
            <div className=" mt-4 h-36 flex justify-center items-center">
              You're not currently hosting any guest.
            </div>
          );
        }
        return (
          <div className=" mt-4">
            <div className="whitespace-nowrap overflow-x-auto example">
              <div className="flex space-x-3 w-fit p-6 ">
                {currentlyHosting.map((host, index) => (
                  <div
                    className="shadow-xl border-2   w-[300px] p-4 mt-4 rounded-xl bg-white "
                    key={index}
                  >
                    <div className="current text-orange-300 text-sm">
                      Currently hosting
                    </div>
                    <div className="flex items-center gap-2 justify-between mt-5 flex-wrap">
                      <div className="guest-name">
                        <h1>{host.name}</h1>
                        <p>{host.date}</p>
                      </div>
                      <div className="guest-image">
                        <Link to={`/UserDetails/${host.id}`}>
                          <img
                            src={host.image || logoImage}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* <button className="bg-orange-400 rounded-full py-2 px-4 w-full text-white ">
                        message
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "arrivingSoon":
        if (arrivingSoonReservations.length === 0) {
          return (
            <div className=" mt-4 h-36 flex justify-center items-center">
              No guest is arriving soon.
            </div>
          );
        }
        return (
          <div className=" mt-4">
            <div className="whitespace-nowrap overflow-x-auto example">
              <div className="flex space-x-3 w-fit p-6 ">
                {arrivingSoonReservations.map((reservation, index) => (
                  <div
                    className="shadow-xl border-2   w-[300px] p-4 mt-4 rounded-xl bg-white"
                    key={index}
                  >
                    <div className="current text-orange-300 text-sm">
                      Arriving soon
                    </div>
                    <div className="flex items-center gap-2 justify-between mt-5 flex-wrap">
                      <div className="guest-name">
                        <h1>{reservation.name}</h1>
                        <p>{reservation.date}</p>
                        <div className="flex space-x-3">
                          <span>Time of arrival:</span>
                          <p>{reservation.time}</p>
                        </div>
                      </div>
                      <div className="guest-image">
                        <Link to={`/UserDetails/${reservation.id}`}>
                          <img
                            src={reservation.image || logoImage}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* <button className="bg-orange-400 rounded-full py-2 px-4 w-full text-white ">
                        message
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "upcoming":
        if (upcomingReservations.length === 0) {
          return (
            <div className=" mt-4 h-36 flex justify-center items-center">
              No upcoming reservations.
            </div>
          );
        }
        return (
          <div className=" mt-4">
            <div className="whitespace-nowrap overflow-x-auto example">
              <div className="flex space-x-3 w-fit p-6 ">
                {upcomingReservations.map((reservation, index) => (
                  <div
                    className=" shadow-xl border-2  w-[300px] p-4 mt-4 rounded-xl bg-white "
                    key={index}
                  >
                    {/* Content for each upcoming reservation */}
                    {/* You can customize the content as needed */}
                    <div className="current text-orange-300 text-sm">
                      Upcoming Reservation
                    </div>
                    <div className="flex items-center gap-2 justify-between mt-5 flex-wrap">
                      <div className="guest-name">
                        <h1 className="pb-[2px]">{reservation.name}</h1>
                        <p className="pb-[2px]">CheckIn: {reservation.checkInDate}</p>
                        <p>ChecKOut: {reservation.checkOutDate}</p>
                        <p>{reservation.amountPaid}</p>
                      </div>
                      <div className="guest-image">
                        <Link to={`/UserDetails/${reservation.id}`}>
                          <img
                            src={reservation.image || logoImage}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* <button className="bg-orange-400 rounded-full py-2 px-4 w-full text-white ">
                        Message
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "pendingReview":
        if (pendingReviews.length === 0) {
          return (
            <div className=" mt-4 h-36 flex justify-center items-center">
              No pending reviews.
            </div>
          );
        }
        return (
          <div className=" mt-4">
            <div className="whitespace-nowrap overflow-x-auto example">
              <div className="flex space-x-3 w-fit p-6 ">
                {pendingReviews.map((review, index) => (
                  <div
                    className="shadow-xl border-2  w-[300px] p-4 mt-4 rounded-xl bg-white "
                    key={index}
                  >
                    <div className="current text-orange-300 text-sm">
                      Pending Review for Reservation {review.reservationId}
                    </div>
                    <div className="flex items-center gap-2 justify-between mt-5 flex-wrap">
                      <div className="guest-name">
                        <h1>{review.name}</h1>
                        <p>Check-In Date: {review.checkInDate}</p>
                      </div>
                      <div className="guest-image">
                        <Link to={`/UserDetails/${review.id}`}>
                          <img
                            src={review.image || logoImage}
                            className="w-10 h-10 object-cover rounded-full bg-gray-100"
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                    <div className="mt-4">
                      {/* <button className="bg-orange-400 rounded-full py-2 px-4 w-full text-white">
                        Message
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      // ...
    }
  };


  const SkeletonLoaderReservations = Array.from({ length: 5 }).map((group, index) => (
    <div
      key={index}
      className="rounded  m-4 cursor-pointer  "
    >

      <div className=''>

        <div className=' h-[170px] w-[260px] rounded-xl object-cover skeleton-loader text-transparent' />
      </div>
    </div>

  ));

  const SkeletonLoaderTabs = Array.from({ length: 5 }).map((group, index) => (
    <div
      key={index}
      className={`  py-2 px-4 ml-3 w-28  h-10 rounded-full   skeleton-loader `}
    >

    </div>

  ));


  const SkeletonLoaderTips = Array.from({ length: 5 }).map((group, index) => (
    <div
      key={index}
      className=" rounded-sm  m-4 cursor-pointer  "
    >

      <div className=''>

        <div className=' h-64 w-64 rounded-xl object-cover skeleton-loader text-transparent' />
      </div>
    </div>

  ));

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, error) => {
    api[type]({
      message: type === "error" ? 'Error' : "Succesfull",
      description: error,
      placement: 'topRight',
      className: 'bg-green'
    });
  };

  const addCohost = async () => {
    // console.log(error)

    if (coHostEmail.trim() === "") {
      setErrorCohost("Email field can not be empty")
      return;
    }
    setErrorCohost("")



    setAddingCohostLoading(true);
    try {
      const response = await axios.get(`/addCoHost?email=${coHostEmail}`)
      setCohostModalOpen(false)
      openNotificationWithIcon("success");

    } catch (error) {
      console.log(error.response.data.error);
      setErrorCohost(error.response.data.error)

    } finally {
      setAddingCohostLoading(false);
    }

  }

  const handleCohostModal = () => {
    if (isAddingCohostLoading) {
      return
    }
    setCohostModalOpen(false);
    setErrorCohost("")
    setCoHostEmail("")
  }


  const AddCohostModal = (
    <>
      {isAddingCohostLoading ?
        <div className="space-y-12 h-52">
          <div
            className="transition-3 "
            style={{
              ...styles.loadingDiv,
              ...{
                zIndex: isAddingCohostLoading ? '10' : '-1',
                display: isAddingCohostLoading ? "block" : "none",
                opacity: isAddingCohostLoading ? '0.33' : '0',
              }
            }}

          />
          <LoadingOutlined
            className="transition-3"
            style={{
              ...styles.loadingIcon,
              ...{
                zIndex: isAddingCohostLoading ? '10' : '-1',
                display: isAddingCohostLoading ? "block" : "none",
                opacity: isAddingCohostLoading ? '1' : '0',
                fontSize: '42px',
                top: 'calc(50% - 41px)',
                left: 'calc(50% - 41px)',


              }


            }}
          />
        </div>
        :
        <form>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <p className="mt-1 text-sm leading-6 text-gray-600">A cohost is an individual who assists the primary host in managing the listings.
                They take on various responsibilities to support the host and ensure the smooth operation of the host's listings on shrbo . </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                <div className="sm:col-span-4">
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address(cohost)
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={coHostEmail}
                      onChange={(e) => setCoHostEmail(e.target.value)}
                      autoComplete="email"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <h3 className=" text-red-500 " >{errorCohost}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={handleCohostModal} >
              Cancel
            </button>
            <button
              type="button"
              onClick={addCohost}
              disabled={isAddingCohostLoading}
              className="rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Save
            </button>
          </div>
        </form>
      }
    </>
  )

  //Confirm deleting the Card 
  const confirm = async (e, type, id) => {
    // console.log(e);

    await axios.delete(`/removeCoHost/${id}`).then(response => {
      console.log(response);
      message.success(` ${type} Removed as Co-host`);
      // fetchUserCards();
      openViewCohostModal();
    }).catch(error => {
      console.error("Failed to Remove Card", error);
      message.error(`An Error Occured while trying to Remove ${type} as Co-host`)
    })

  };
  const cancel = (e) => {
    console.log();
  };

  const CohostModal = (
    <div className=" h-full overflow-y-scroll example ">
      {!isCohostLoading ?
        <ul role="list" className="divide-y divide-gray-100">
          {cohostList.length > 0 ?
            <>
              {cohostList.map((person) => (
                <li key={person.id} className="flex justify-between gap-x-6 py-5">
                  <div className="flex min-w-0 gap-x-4">
                    <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={person.profilePicture || logoImage} alt="" />
                    <div className="min-w-0 flex-auto">
                      <p className="text-sm font-semibold leading-6 text-gray-900">{person.name}</p>
                      <p className="mt-1 truncate text-xs leading-5 text-gray-500">{person.email}</p>
                    </div>
                  </div>
                  <div className=" shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm leading-6 text-gray-900">Co-Host</p>
                    <div className="mt-1 flex items-center gap-x-1.5">
                      {/* <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div> */}
                      <Popconfirm
                        title="Remove Co-host"
                        description={`Sure you want to remove ${person.name} as a Co-host ?`}
                        onConfirm={(e) => { confirm(e, person.name, person.id) }}
                        onCancel={cancel}
                        okText="Delete"
                        cancelText="Cancel"
                      >
                        <button className="text-xs border rounded-md p-[4px] font-semibold hover:bg-slate-50 transition-colors   leading-5 text-gray-500">Remove</button>

                      </Popconfirm>
                    </div>
                  </div>
                </li>
              ))}
            </>
            :
            <div className=" m-8 ">
              You have not added a co-host yet.
            </div>

          }
        </ul>
        :
        <div className="self-start my-28   p-2 rounded-lg w-full h-full flex items-center justify-center ">
          <div className="dot-pulse1">
            <div className="dot-pulse1__dot"></div>
          </div>
        </div>
      }
    </div>
  )

  const openViewCohostModal = async () => {

    !isCohostListModalOpen && setCohostLoading(true)

    setCohostListModalOpen(true);


    try {
      const response = await axios.get('/hostcohosts');

      setCohostList([...response.data.cohosts])
    } catch (error) {

    } finally {
      setCohostLoading(false)

    }



  }

  const removeCohost = async (id) => {
    try {
      const response = await axios.delete(`/removeCoHost/${id}`);
    } catch (error) {

    }

  }













  return (
    <div className="pb-20">
      {contextHolder}
      <HostHeader />
      <div className="flex flex-wrap md:flex-col md:w-[80vw] md:mx-auto md:my-10 p-4 md:p-10">
        <GoBackButton />
        <div className="w-full">

          {!loadingGeneral ?
            <p className="text-gray-400 font-normal text-base my-4 italic">
              Efficiently manage your home rental listings with our comprehensive
              management tool.
            </p>
            :
            <div className="skeleton-loader my-7 w-[200px] md:w-[560px] rounded-[2px] h-7 ml-3" />
          }


          {!loadingGeneral ? <div
            id="bell-dropdown"
            className={`relative w-fit   ${isBellDropdownOpen ? "group" : ""}`}
            onClick={toggleBellDropdown}
          >
            <button className="text-white relative">
              <img src={Notificationbell} className="w-5 h-5" alt="" />
              {notifications.length > 0 && notifications[0].id && (
                <span className="bg-red-500 text-white  absolute h-[2px] w-[2px] p-[5px] top-0 right-0 rounded-full">
                  {/* {notifications.length} */}
                </span>
              )}
            </button>
            {isBellDropdownOpen && notifications.length > 0 && (
              <div className="absolute bg-white z-[60] h-96 overflow-scroll example left-0 mt-1 p-2 w-64 border rounded-lg shadow-lg">
                {/* Render your notifications here */}
                <>
                  {(notifications[0].id) ?
                    <>
                      {notifications.map((notification, index) => (
                        <div key={notification.id} onClick={() => { deleteNotification(notification.id) }} className="text-gray-800 my-4 p-2 rounded-md cursor-pointer hover:bg-orange-400 hover:text-white">
                          {notification.message}
                          <div className="text-gray-500 text-xs">
                            {DateTimeConverter(notification.time)}
                          </div>
                        </div>
                      ))}
                    </>
                    :
                    <div className=" text-black w-full h-full flex items-center justify-center  ">No Notifications</div>
                  }
                </>
              </div>
            )}
          </div>
            :
            <div className={`relative w-fit`}>
              <div className="skeleton-loader my-7 w-10 rounded-xl h-7 ml-3" />
            </div>
          }

          {/* /////////////////// */}

          <div className="flex flex-wrap mt-4 items-center justify-between">
            {!loadingGeneral ?
              <>
                <h1 className="text-3xl font-medium my-7">Welcome back, {user.name}</h1>
                <Link to="/Reservations" className="">All Reservations
                  <svg xmlns="http://www.w3.org/2000/svg" width={"30px"} height={"30px"} viewBox="0 0 24 24">
                    <path d="M14 16.94V12.94H5.08L5.05 10.93H14V6.94L19 11.94Z" />
                  </svg>
                </Link>

              </>
              :
              <>
                <div className="skeleton-loader my-7 w-64 rounded-[2px] h-7 ml-3" />
                <div className="skeleton-loader my-3 w-56 rounded-[2px] h-7 ml-3" />

              </>}


          </div>

          {host == 1 && <div className=" flex gap-8  md:justify-end w-full ">

           {!loadingGeneral ? <>
              <button onClick={() => { setCohostModalOpen(true) }} className=" bg-orange-400 text-white p-1 rounded  ">+ Add co-host</button>
              <button onClick={openViewCohostModal} className=" bg-orange-400 text-white px-2 py-1 rounded   ">view co-host</button>
            </>
            :
            <>
              <div className="skeleton-loader my-7 w-56 rounded-[2px] h-7 ml-3" />
              <div className="skeleton-loader my-3 w-56 rounded-[2px] h-7 ml-3" />
            </>}

          </div>}
          <Popup isModalVisible={isCohostModalOpen} handleCancel={handleCohostModal} title={"Adding a Cohost"} centered={true}  >
            {AddCohostModal}
          </Popup>
          <Popup isModalVisible={isCohostListModalOpen} handleCancel={() => { setCohostListModalOpen(false) }} title={"Your Cohosts"} centered={true}  >
            {CohostModal}
          </Popup>

          <div>


            {!loadingGeneral ?
              <div className="block text-2xl my-4 font-semibold">
                Recommended for you
              </div>
              :
              <div className="skeleton-loader my-3 w-56 rounded-[2px] h-7 ml-3" />}

            {!loadingGeneral ? <div className="flex space-x-5  w-full overflow-scroll example">
              {tips.map(tip => (

                <AlertCard
                  title={"Verify your identity" || tip.title}
                  description={tip.message}
                  link={tip.url}

                // houseTitle={"Fully Furnished Apartment at Carrington 32 road"}
                />

              ))}

              <AlertCard
                title="Verify your identity"
                description="Required to publish"
                link="/AddGovvernmentId"
                image={exclammationMark}
                houseTitle={"Fully Furnished Apartment at Carrington 32 road"}
              />

              <AlertCard
                title="Resubmit your government ID photo"
                description="It looks like the photo of your id is in black and white. Please make sure your camera is set to take color photos and try again."
                link="/AddGovvernmentId"

              // image={exclammationMark}
              />
              <InfoCard
                title="QUICK LINK"
                description="Finding reservation details Your Trips tab has full details, receipts, and Host contact info for each of your reservations. Go to Trips"
                link="/Trip"
              />
              <InfoCard
                title="Host Tip: Enhance Your Profile"
                description=" Enhance your guests' experience by uploading
                your photo. Let them know who owns the apartment!"
                link="/UsersShow"
              />
            </div> : <div className="flex space-x-4  w-full overflow-scroll example">
              {SkeletonLoaderTips}

            </div>}

          </div>
        </div>
        <div className="reservation w-full md:w-[80vw] mt-14 pb-20">
          <div>
            {!loadingGeneral ? <h1 className="text-2xl font-medium mb-4">Your reservations</h1>
              :
              <h1 className="skeleton-loader mb-4 w-52 rounded-[2px] h-7 ml-3" />}
          </div>
          <div className="tab-container space-x-4 flex  overflow-x-auto whitespace-nowrap example">
            {(!loadingGeneral) ? <>
              <div
                className={`tab border py-2 px-4 rounded-full cursor-pointer  ${activeTab === "checkingOut"
                  ? "active bg-orange-300 text-white"
                  : ""
                  }`}
                onClick={() => handleTabClick("checkingOut")}
              >
                Checking out ({checkingOut.length})
              </div>
              <div
                className={`tab border py-2 px-4 rounded-full cursor-pointer  ${activeTab === "currentlyHosting"
                  ? "active bg-orange-300 text-white"
                  : ""
                  }`}
                onClick={() => handleTabClick("currentlyHosting")}
              >
                Currently hosting ({currentlyHosting.length})
              </div>
              <div
                className={`tab border py-2 px-4 rounded-full cursor-pointer  ${activeTab === "arrivingSoon"
                  ? "active bg-orange-300 text-white"
                  : ""
                  }`}
                onClick={() => handleTabClick("arrivingSoon")}
              >
                Arriving soon ({arrivingSoonReservations.length})
              </div>
              <div
                className={`tab border py-2 px-4 rounded-full cursor-pointer  ${activeTab === "upcoming"
                  ? "active bg-orange-300 text-white"
                  : ""
                  }`}
                onClick={() => handleTabClick("upcoming")}
              >
                Upcoming ({upcomingReservations.length})
              </div>
              <div
                className={`tab border py-2 px-4 rounded-full cursor-pointer  ${activeTab === "pendingReview"
                  ? "active bg-orange-300 text-white"
                  : ""
                  }`}
                onClick={() => handleTabClick("pendingReview")}
              >
                Pending review ({pendingReviews.length})
              </div>
            </>
              :

              (SkeletonLoaderTabs)

            }
          </div>

          {!(loading || loadingGeneral) ? <div className="tab-content">{renderTabContent()}</div> : <div className=" flex items-center w-full  whitespace-nowrap overflow-x-auto example ">{SkeletonLoaderReservations}</div>}

          {!loadingGeneral ? <div className="my-10 bg-orange-100 p-5">
            <h1 className="mb-5 text-2xl">Share more details</h1>
            <div className="w-64 border p-4 rounded-lg shadow-lg relative bg-white ">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Your Profile</h2>
                <p className="text-gray-600">
                  Personalizing your profile can improve your search ranking and
                  help guests get to know you better.
                </p>
                <Link to="/UsersShow">
                  <button className="bg-orange-400 py-2 px-4 rounded-full mt-2 text-white">
                    <strong>Add profile details</strong>
                  </button>
                </Link>
              </div>
              {/* <button className="absolute top-2 right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                X
              </button> */}
            </div>
          </div>
            :
            <div className="skeleton-loader my-10 h-[330px] w-full rounded-[2px]  ml-3" />

          }

          {!loadingGeneral ? <div className="my-10 bg-orange-100 p-5">
            <h1 className="mb-5 text-2xl">We are here to help</h1>

            <div className="flex  flex-wrap">
              <SuperHostGuidanceCard
                title="Guidance from a Superhost"
                description="We’ll match you with an experienced Host who can help you get started."
              />
              <SuperHostGuidanceCard
                title="Contact specialized support"
                description="As a new Host, you get one-tap access to a specially trained support team."
              />
              <Link to="/ReportDamage">
                <SuperHostGuidanceCard
                  title="Report Property Damage"
                  description="If a guest has caused any damage to your apartment, please reach out to our specialized support team immediately. Use the 'Contact Support' option to report the incident and provide details about the damage. Our team is here to assist you in resolving the issue and ensuring a smooth resolution process."
                />
              </Link>

            </div>
          </div>
            :
            <div className=" grid grid-cols-2 w-full ml-3 my-10 gap-8   ">
              <div className="skeleton-loader my-10 h-[90px] w-full col-span-1  rounded-[6px]  " />
              <div className="skeleton-loader my-10 h-[90px] w-full rounded-[6px] col-span-1  " />
              <div className="skeleton-loader my-10 h-[90px] w-full col-span-2 rounded-[6px] " />
            </div>
          }

        </div>
      </div>

      <HostBottomNavigation />
    </div>
  );
}
