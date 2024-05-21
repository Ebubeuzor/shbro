import React, { useState, useEffect } from "react";
import close from "../../assets/svg/close-line-icon.svg";
import axios from "../../Axios";
import bedroom from "../../assets/svg/double-bed-icon.svg";
import bathroom from "../../assets/svg/bathtub-icon.svg";
import calender from "../../assets/svg/calendar-icon.svg";
import { Link } from "react-router-dom";
import PaginationExample from "../PaginationExample";
import BottomNavigation from "../Navigation/BottomNavigation";
import { styles } from "../ChatBot/Style";
import { LoadingOutlined } from '@ant-design/icons';
import Header from "../Navigation/Header";
import { Modal, Button,message, Form, Input } from "antd";

import {
  FaHome,
  FaHotel,
  FaBed,
  FaBuilding,
  FaTrash,
  FaVideo,
  FaPalette,
  FaCity,
  FaDog,
  FaTree,
  FaUserFriends,
  FaShopify,
  FaWater,
  FaLandmark,
  FaChartBar,
  FaMountain,
  FaWifi,
  FaTv,
  FaUtensils,
  FaHandsWash,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaHotTub,
  FaFire,
  FaBell,
  FaFirstAid,
  FaFireExtinguisher,
  FaSmoking,
  FaTemperatureHigh,
  FaSuitcase,
  FaShower,
  FaDumbbell,
  FaWheelchair,
  FaPaw,
  FaCoffee,
  FaBook,
  FaChessBoard,
  FaLaptop,
  FaAirFreshener,
  FaPaperclip,
  FaSnowboarding,
  FaArrowUp,
  FaObjectGroup,
  FaWaveSquare,
  FaHotdog,
  FaBox,
  FaUser,
  FaCamera,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaUtensilSpoon,
  FaSmog,
} from "react-icons/fa";


export default function Trip() {
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false); // Step 1: Manage modal visibility
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [reasoms, setReasons] = useState("");
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCancelReservation, setLoadingCancelReservation] = useState(false);
  const [goNext, setGoNext] = useState(true);
  const [error, setError] = useState('');
  const [cancellationPolicy, setCancellationPolicy] = useState(null);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [messageSent, setMessageSent] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messages, setMessages] = useState("");
  const [form] = Form.useForm(); // Define the form variable


  const amenityIcons = {
    Wifi: <FaWifi />,
    TV: <FaTv />,
    Kitchen: <FaUtensilSpoon />,
    Washer: <FaHandsWash />,
    "Air conditioning": <FaSnowflake />,
    // Add icons for the remaining amenities
    "Hot tub": <FaHotTub />,
    "fire extinguisher": <FaFireExtinguisher />,
    "first aid kit": <FaFirstAid />,
    Pool: <FaSwimmingPool />,
    "Free parking on premises": <FaParking />,
    Essentials: <FaSuitcase />,
    Gym: <FaDumbbell />,
    "Wheelchair accessible": <FaWheelchair />,
    "Board games": <FaChessBoard />,
    Books: <FaBook />,
    Refrigerator: <FaBox />,
    Toaster: <FaHotdog />,
    Microwave: <FaWaveSquare />,
    Oven: <FaObjectGroup />,
    "Smoking allowed": <FaSmoking />,
    Balcony: <FaBuilding />,
    Elevator: <FaArrowUp />,
    "Coffee maker": <FaCoffee />,
    "Tea kettle": <FaUtensils />,
    Dishwasher: <FaHandsWash />,
    "Pets allowed": <FaPaw />,
    Hangers: <FaPaperclip />,
    "Laptop-friendly workspace": <FaLaptop />,
    Iron: <FaSnowboarding />,
    "Fire pit": <FaFire />,
    "Indoor fireplace": <FaFire />,
    "Smoke alarm": <FaSmog />,
    Heating: <FaTemperatureHigh />,
    Shampoo: <FaShower />,
    "Hair dryer": <FaShower />,
    // "Smoke alarm": <FaBell />,
  };


  useEffect(() => {

    axios.get("/userTrips").then(response => {
      const filteredTripsData = response.data.data.map(item => ({
        id: item.id,
        destination: item.hosthometitleandloacation,
        startDate: item.check_in,
        endDate: item.check_out,
        notes: item.hosthomedescription,
        image: item.hosthomephotos[0],
        amenities: item.hosthomeamenities,
        hostName: item.hostName,
        hostId: item.hostid,
        bbokingid: item.bbokingid,
        rating: 4.8,
        bathrooms: item.hosthomebathroom,
        bedrooms: item.hosthomebedroom,
        guests: 2,
        price: item.amountPaid,
        morePhotos: item.hosthomephotos,
        contactHost: "/chat",
        comments: [],
        checkedIn: item.status,
        checkingInDate: "",
        checkingInTime: "",
        cancellationPolicy: item.hosthomecancelationpolicy,



      }));

      setTrips(filteredTripsData);
      setFilteredTrips(filteredTripsData);


    }).catch(error => {
      // console.log(error);
    }).finally(() => setLoading(false));



  }, []);

  let policyText = "";

  switch (cancellationPolicy) {
    case "Flexible Cancellation Policy":
      policyText =
        "Cancelling within 48 hours of booking is free, and guest will have a full refund of their total booking amount. Cancellation after 48 hours, guest will be refunded 70% of their total booking amount.";
      break;

    case "Moderate Cancellation Policy":
      policyText =
        "Cancellation after booking, guest will be refunded 70% of their total booking amount.";
      break;

    case "Strict Cancellation Policy":
      policyText =
        "Cancellation after booking, guest will be refunded 50% of their total booking amount.";
      break;

    default:
      // Handle other cases if needed
      break;
  }

  const [selectedTab, setSelectedTab] = useState("All"); // Default to "All" trips

  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const addComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setCancellationPolicy(trip.cancellationPolicy);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  const changeMainPhoto = (index) => {
    setSelectedPhotoIndex(index);
  };

  const openCancellationModal = () => {
    setIsCancellationModalOpen(true); // Step 2: Open the cancellation modal
  };

  const closeCancellationModal = () => {
    setGoNext(true);
    setReasons('');
    setIsCancellationModalOpen(false); // Step 2: Close the cancellation modal
  };


  // const tripHistory = [
  //   ...trips,
  // ];



  const SkeletonLoader = Array.from({ length: 8 }).map((group, index) => (
    <div
      key={index}
      className="md:w-2/5 m-4 max-w-[80vw] cursor-pointer w-full  rounded overflow-hidden    "
    >

      <div className='w-full   '>

        <div className=' w-full md:h-[310px] h-[210px]   rounded-xl object-cover skeleton-loader text-transparent' />
      </div>

      <div className=" py-4 h-full w-full">
        <div className="font-medium text-base mb-2 skeleton-loader text-transparent">dddddddddd</div>
        {/* <Rating rating={group.rating} /> */}
        <br></br>
        <p className="text-gray-400 text-base skeleton-loader text-transparent">dddddddddddddddddddd</p>
        {/* <p className="text-gray-400 text-base skeleton-loader text-transparent">dddddddddd</p> */}
        <br></br>
        <p className="font-medium text-gray-700 text-base skeleton-loader text-transparent">dddddddd</p>
      </div>


    </div>

  ));


  const cancelTrips = async () => {
    setLoadingCancelReservation(true);



    const data =
    {
      booking_id: selectedTrip.bbokingid,
      host_id: selectedTrip.hostId,
      reasonforcancel: reasoms
    }

    await axios.post("/createCancelTrips", data).then(response => {
      // setGoNext(true);
      setReasons('');

    }).catch(error => {
      // console.log(error)

    }).finally(() => {
      window.location.href = '/trip';
      setLoadingCancelReservation(false)
      closeModal()
      closeCancellationModal()
    });
  }

  const handleReasonChange = (e) => {
    setReasons(e.target.value)


  }

  const handleGoNext = () => {
    if (reasoms.trim() === "") {
      setError("Reason cannot be empty");
      return;
    }
    setGoNext(false);
    setError('');
  }


  function formatAmountWithCommas(amount) {
    // Convert the amount to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = amount.toString().split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts with a dot if there is a decimal part
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    return formattedAmount;
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };




  const filterTripsByTab = (tab) => {
    if (tab === "All") {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter((trip) => {
        return trip.checkedIn.toLowerCase() === tab.toLowerCase(); // Make it case-insensitive
      });
      setFilteredTrips(filtered);
    }
    setSelectedTab(tab);
  };

  const sendMessageToHost = async (receiverId) => {
    try {
      // Log the message before sending
      console.log("Sending message:", message);

      // Send the message to the API
      const response = await axios.post(`/chat/${receiverId}`, {
        message: messages,
      });

      // Set messageSent to true to indicate that the message was sent successfully
      setMessageSent(true);
      console.log("Message sent successfully");
      // showMessage.success("Message sent successfully");

      // Handle the response as needed
    } catch (error) {
      console.error("Error sending message to host:", error);
      // Handle errors
    }
  };

  // console.log(goNext)

  return (
    <div className=" h-[100vh]  overflow-auto example">
      <Header />
      <div className="mx-auto md:w-[90%]">
        <header className="text-4xl pl-6 py-6 font-bold">Trips History</header>
        <div className="flex flex-wrap  p-4">
          <button
            disabled={loading}
            className={`${selectedTab === "All"
              ? "bg-orange-400  text-white"
              : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded-full m-2 `}
            onClick={() => filterTripsByTab("All")}
            title="Show all trips" // Add the title attribute

          >
            All
          </button>
          <button
            disabled={loading}
            className={`${selectedTab === "Reserved"
              ? "bg-orange-400 text-white"
              : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("Reserved")}
            title="The booking is confirmed, and the check-in date is in the future. The trip has not yet started.
            "
          >
            Reserved
          </button>
          <button
            disabled={loading}
            className={`${selectedTab === "Checked in"
              ? "bg-orange-400 text-white"
              : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("Checked in")}
            title="The booking is confirmed, and the check-in date is approaching. This status is typically used for upcoming trips."

          >
            Checked In
          </button>
          <button
            disabled={loading}
            className={`${selectedTab === "Checked Out"
              ? "bg-orange-400 text-white"
              : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("Checked Out")}
            title="The trip has ended, and both the check-in and check-out dates have passed. This status indicates that the reservation is no longer active.
            "
          >
            Checked Out
          </button>
          <button
            disabled={loading}
            className={`${selectedTab === "Cancelled"
              ? "bg-orange-400 text-white"
              : "bg-gray-200 text-gray-600"
              } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("Cancelled")}
            title="The booking has been canceled by either the guest or the host. Cancellation can occur for various reasons, and the status indicates that the reservation is no longer active.
  "
          >
            Cancelled
          </button>

        </div>

        {!loading ?
          <div className="flex flex-wrap">
            {filteredTrips.length > 0 ? (
              filteredTrips.map((trip, index) => (
                <div
                  key={index}
                  className="md:w-[40%] m-5 cursor-pointer w-full   rounded-lg"
                >
                  <div className="relative">
                    <div className="absolute p-2 uppercase text-sm text-white bg-orange-400">
                      {trip.checkedIn}
                    </div>
                    <img
                      src={trip.image}
                      alt=""
                      className="object-cover h-full w-full rounded-lg"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="font-bold text-lg">{trip.destination}</h2>
                    <div className="flex flex-wrap  my-1">
                      <p className="flex items-center mr-2 text-sm">
                        <img src={calender} className="w-4 mr-3" alt="" />{" "}
                        {formatDate(trip.startDate)}
                      </p>
                      <p className="flex items-center text-sm">
                        <img src={calender} className="w-4 mr-3" alt="" />{" "}

                        {formatDate(trip.endDate)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <p className="flex">
                        <img src={bathroom} className="w-4 mr-2" alt="" />{" "}
                        {trip.bathrooms}
                      </p>
                      <p className="flex">
                        <img src={bedroom} className="w-4 mr-2" alt="" />{" "}
                        {trip.bedrooms}
                      </p>
                    </div>
                    <div className="text-lg text-orange-400 font-bold mt-2">
                      ₦{formatAmountWithCommas(trip.price)}
                    </div>
                    <div>
                      <span>{trip.checkingInDate}</span>
                    </div>
                    <div>
                      <button
                        className="bg-orange-400 p-2  mt-7 text-white text-sm"
                        onClick={() => openModal(trip)}
                      >
                        More Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-2xl p-6">
                <div>
                  <p className="text-lg">
                    No trips booked...yet! Time to dust off your bags and start
                    planning your next vacation.
                  </p>
                </div>

               <Link to="/">
               <button className="bg-orange-400 p-4 rounded-full mt-7 text-white text-lg">
                  Start Searching
                </button></Link>
              </div>
            )}
          </div>
          :
          <div className="flex flex-wrap ">

            {SkeletonLoader}
          </div>
        }
      </div>

      {/* Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          ></div>
          <div className="bg-white pb-32 p-3 rounded-lg z-10 overflow-auto h-[100vh] md:h-[90vh]  md:w-3/6 example">
            <div className="p-4 mt-10 ">
              {/* <div className="text-right"> */}
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <img src={close} className="w-4" alt="" />
              </button>
              {/* </div> */}
              <div className="">
                {/* <h3 className="text-xl font-semibold">Main Photo:</h3> */}
                <img
                  src={selectedTrip.morePhotos[selectedPhotoIndex]}
                  alt={`Main Photo`}
                  className="mt-2 w-full max-h-64 min-h-[256px] md:max-h-[360px] md:min-h-[360px] h-2/5 object-cover rounded-lg"
                />
              </div>
              <Link to="/ListingInfoMain">
                <h2 className="text-2xl font-semibold my-4">
                  {selectedTrip.destination}
                </h2>
              </Link>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">More Photos:</h3>
                <div className="flex flex-wrap mt-2">
                  {selectedTrip.morePhotos.map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => changeMainPhoto(index)}
                      className={`cursor-pointer ${selectedPhotoIndex === index
                        ? "border-2 border-orange-400"
                        : ""
                        }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-20 h-20 md:w-32 m-2 md:h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h2 className="font-bold text-2xl">
                  {selectedTrip.destination}
                </h2>
                <Link to="/UserDetails">
                  <div className="text-sm font-medium mt-2 flex space-x-2">
                    <span className="mr-2"> Hosted by:</span>
                    {selectedTrip.hostName}
                  </div>
                </Link>
                <div className="flex flex-wrap  my-1">
                  <p className="flex items-center mr-2">
                    <img src={calender} className="w-4 mr-3" alt="" />{" "}
                    {selectedTrip.startDate}
                  </p>
                  <p className="flex items-center">
                    <img src={calender} className="w-4 mr-3" alt="" />{" "}
                    {selectedTrip.endDate}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <p className="flex">
                    <img src={bathroom} className="w-4 mr-2" alt="" />{" "}
                    {selectedTrip.bathrooms}
                  </p>
                  <p className="flex">
                    <img src={bedroom} className="w-4 mr-2" alt="" />{" "}
                    {selectedTrip.bedrooms}
                  </p>
                </div>
                <div className="text-sm flex  font-medium mt-2">
                  <p className="mr-2">Guests</p>
                  {selectedTrip.guests}
                </div>
                <div className="text-lg text-orange-400 font-medium mt-2">
                  <span className="text-black"> Price: </span> ₦
                  {formatAmountWithCommas(selectedTrip.price)}
                </div>

                <div className="text-base break-words  text-black  mt-2">
                  {selectedTrip.notes}
                </div>

                <div className="my-4">
                  <h1 className="font-bold text-2xl">Amenities</h1>
                  <ul>
                    {selectedTrip.amenities.map((amenity, index) => (
                      <li key={index} className="flex items-center space-x-3 py-2" >
                        <span className="text-lg">
                          {amenityIcons[amenity] || <FaTv />}
                        </span>
                        <span className="text-lg">{amenity}</span>
                      </li>
                    ))}

                  </ul>
                </div>
              </div>
            </div>
            <div className="mb-10 flex space-x-3">
              {(selectedTrip.checkedIn.toLowerCase() === "reserved") && <div>
                <button className="bg-orange-400 px-4 py-2 rounded-full   text-white text-sm"
                  onClick={openCancellationModal} // Step 3: Open the cancellation modal
                >
                  Cancel Reservation
                </button>
              </div>}

              {selectedTrip.contactHost && (
                <button
                  onClick={()=>setMessageModalVisible(true)}
                  className="bg-orange-400 px-4 py-2 rounded-full text-center   text-white text-sm"
                >
                  Contact Host
                </button>
              )}

              <Modal
                title="Message Host"
                open={messageModalVisible}
                onCancel={() => setMessageModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setMessageModalVisible(false)}>
                    Cancel
                  </Button>,
                  <Button
                    key="send"
                    type="primary"
                    onClick={() => sendMessageToHost(selectedTrip.hostId, message)}
                  >
                    Send
                  </Button>,
                ]}
              >
                <Form
                  onFinish={sendMessageToHost}
                  form={form}
                  initialValues={{ message: "" }}
                >
                  {messageSent ? (
                    <p>Message sent successfully</p>
                  ) : (
                    <>
                      <Form.Item
                        name="message"
                        rules={[
                          {
                            required: true,
                            message: "Please enter your message",
                          },
                        ]}
                      >
                        <Input.TextArea
                          placeholder="Type your message here..."
                          style={{ width: "100%", minHeight: "100px" }}
                          value={messages}
                          onChange={(e) => setMessages(e.target.value)}
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          className="bg-orange-400 hover:bg-orange-600"
                          htmlType="submit"
                          onClick={() => {
                            sendMessageToHost(selectedTrip.hostId);
                            setMessages("");
                          }}
                        >
                          Send
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form>
              </Modal>
            </div>
          </div>
        </div>
      )}

      {isCancellationModalOpen && (
        <>
          {!loadingCancelReservation ? <>
            {goNext ? (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0 bg-black opacity-50"
                  onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                ></div>
                <div className="bg-white p-8 rounded-lg z-10 h-[100vh] md:h-[60vh] w-full md:w-2/5 overflow-auto">
                  <div className="text-right">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                    >
                      <img src={close} className="w-4" alt="" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-semibold mt-4">Cancel Reservation</h2>
                  <p className="mt-4">
                    Are you sure you want to cancel your reservation for{" "}
                    {selectedTrip.destination}? Please provide a reason for cancellation:
                  </p>
                  <textarea
                    rows="3"
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Reason for cancellation"
                    onChange={handleReasonChange}
                  ></textarea>
                  <label className="text-red-500">{error}</label><br></br>
                  <button
                    className="bg-orange-400 p-4 rounded-full text-white mt-4"
                    onClick={handleGoNext} // Use onClick for buttons
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            ) : (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0 bg-black opacity-50"
                  onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                ></div>
                <div className="bg-white p-8 rounded-lg z-10 h-[100vh] md:h-[60vh] w-full md:w-2/5 overflow-auto">
                  <div className="text-right">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                    >
                      <img src={close} className="w-4" alt="" />
                    </button>
                  </div>
                  <h2 className="text-2xl font-semibold mt-4">Host Cancellation Policy</h2>
                  <p className="mt-4">
                    {policyText}{" "}
                    ,do you still want to Proceed?
                  </p>
                  <button
                    className="bg-orange-400 p-4 rounded-full text-white mt-14 mr-4"
                    onClick={cancelTrips} // Use onClick for buttons
                  >
                    Cancel Reservation
                  </button>
                  <button
                    className=" border-orange-400 border  p-4 rounded-full text-black mt-14"
                    onClick={closeCancellationModal} // Use onClick for buttons
                  >
                    Keep Reservation
                  </button>
                </div>
              </div>
            )}
          </>
            :
            <>
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                  className="absolute inset-0 bg-black opacity-50"
                  onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                ></div>
                <div className="bg-white p-8 rounded-lg z-10 h-[100vh] md:h-[60vh] w-full md:w-2/5 overflow-auto">
                  <div className="text-right">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={closeCancellationModal} // Step 3: Close the cancellation modal
                    >
                      <img src={close} className="w-4" alt="" />
                    </button>
                  </div>
                  <div
                    className="transition-3"
                    style={{
                      ...styles.loadingDiv,
                      ...{
                        zIndex: loadingCancelReservation ? '10' : '-1',
                        display: loadingCancelReservation ? "block" : "none",
                        opacity: loadingCancelReservation ? '0.33' : '0',
                      }
                    }}

                  />
                  <LoadingOutlined
                    className="transition-3"
                    style={{
                      ...styles.loadingIcon,
                      ...{
                        zIndex: loadingCancelReservation ? '10' : '-1',
                        display: loadingCancelReservation ? "block" : "none",
                        opacity: loadingCancelReservation ? '1' : '0',
                        fontSize: '42px',
                        top: 'calc(50% - 41px)',
                        left: 'calc(50% - 41px)',


                      }


                    }}
                  />
                </div>
              </div>

            </>}
        </>
      )}

      <div className="my-10 pb-32">
        {(filteredTrips && filteredTrips.length > 0) && <PaginationExample />}
      </div>
      <BottomNavigation />
    </div>
  );
}
