import React, { useState } from "react";
import room from "../../assets/room.jpeg";
import room2 from "../../assets/room2.jpeg";
import close from "../../assets/svg/close-line-icon.svg";

import bedroom from "../../assets/svg/double-bed-icon.svg";
import bathroom from "../../assets/svg/bathtub-icon.svg";
import calender from "../../assets/svg/calendar-icon.svg";
import { Link } from "react-router-dom";
import PaginationExample from "../PaginationExample";
import BottomNavigation from "../Navigation/BottomNavigation";
import Header from "../Navigation/Header";


export default function Trip() {
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false); // Step 1: Manage modal visibility
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [comments, setComments] = useState([]);

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
    setIsCancellationModalOpen(false); // Step 2: Close the cancellation modal
  };

  const tripHistory = [
    {
      destination: "Admirality way, Lekki Lagos",
      startDate: "2022-05-15",
      endDate: "2022-05-22",
      notes:
        "Experience contemporary comfort and security in our chic 2-BD APT at The Drake Homes. Immaculately maintained with round-the-clock security, enjoy good electricity from Eko Electric, backed by an inverter and estate generator. The living room boasts a smart TV, DSTV, and air conditioning, while the bedroom features AC and a TV. Stay connected with Wi-Fi throughout the apartment. Your stylish urban retreat awaits! MINIMUM OF 2 GUESTS.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen", "TV"],
      hostName: "John Doe",
      rating: 4.8,
      bathrooms: 2,
      bedrooms: 1,
      guests: 2,
      price: 20000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "checked out",
      checkingInDate: "",
      checkingInTime: "",
    },
    {
      destination:
        "4 Bedroom house with 24 hrs electricity/24hr security Lekki, Lagos. Nigeria",
      startDate: "2023-02-10",
      endDate: "2023-02-18",
      notes:
        " Make some memories at this unique and family-friendly place. 10 mins walk from 2 private beaches (Laguna Beach and Atican Beach) I enjoy this house so much, and I want you, your family and friends to have it to yourselves and enjoy it in its entirety.Feel at home here, with: Solar-powered/grid electricity WiFi 2 Living rooms with AC & Cable TV 4 Bedrooms with En-Suite & AC Gym Free Parking Fully Equipped kitchen Come and enjoy your stay. The Estate is peaceful and serene with 24hours Security.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen", "Washing Machine"],
      hostName: "Jane Smith",
      rating: 4.9,
      bathrooms: 1,
      bedrooms: 2,
      guests: 4,
      price: 20000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "Reserved",
      checkingInDate: "Thursday, 28 december 2023",
      checkingInTime: "12:00pm",
    },
    {
      destination:
        "Cozy two Bedroom Apartment in a Well Secured Court in Ikate Axis of Lekki",
      startDate: "2023-07-01",
      endDate: "2023-07-07",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pretium eros non ligula scelerisque, eget convallis lorem tincidunt. Maecenas vulputate nulla eget ex malesuada, nec consequat ipsum varius. Sed scelerisque, odio a iaculis vulputate, ante justo suscipit ex, at malesuada lectus justo eu ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam vitae tellus in sapien finibus dignissim. Suspendisse lacinia lacinia purus nec ultrices. Sed sit amet quam id nisi facilisis hendrerit. Curabitur facilisis urna non neque iaculis, vel placerat lorem cursus.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen", "Gym", "Pool"],
      hostName: "Michael Johnson",
      rating: 4.7,
      bathrooms: 1.5,
      bedrooms: 3,
      guests: 6,
      price: 20000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "Checked in",
      checkingInDate: "",
      checkingInTime: "",
    },

    {
      destination: "Entire rental unit hosted by Dasola",
      startDate: "2023-07-01",
      endDate: "2023-07-07",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.  neque iaculis, vel placerat lorem cursus.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen", "Gym", "Pool"],
      hostName: "Michael Johnson",
      rating: 4.7,
      bathrooms: 1.5,
      bedrooms: 3,
      guests: 6,
      price: 20000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "checked out",
      checkingInDate: "",
      checkingInTime: "",
    },

    {
      destination: "Entire serviced apartment hosted by Sunday",
      startDate: "2023-07-01",
      endDate: "2023-07-07",
      notes:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pretium eros non ligula scelerisque, eget convallis lorem tincidunt. Maecenas vulputate nulla eget ex malesuada, nec consequat ipsum varius. Sed scelerisque, odio a iaculis vulputate, ante justo suscipit ex, at malesuada lectus justo eu ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam vitae tellus in sapien finibus dignissim. Suspendisse lacinia lacinia purus nec ultrices. Sed sit amet quam id nisi facilisis hendrerit. Curabitur facilisis urna non neque iaculis, vel placerat lorem cursus.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen", "Gym", "Pool"],
      hostName: "Michael Johnson",
      rating: 4.7,
      bathrooms: 1.5,
      bedrooms: 3,
      guests: 6,
      price: 20000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "Reserved",
      checkingInDate: "Thursday, 28 december 2023",
      checkingInTime: "12:00pm",
    },

    {
      destination: "Cancelled Reservation in XYZ",
      startDate: "2023-12-01",
      endDate: "2023-12-07",
      notes: "This reservation has been canceled.",
      image: room,
      amenities: ["Wi-Fi", "Kitchen"],
      hostName: "Jane Doe",
      rating: 4.5,
      bathrooms: 2,
      bedrooms: 2,
      guests: 4,
      price: 15000,
      morePhotos: [room, room2, room],
      contactHost: "/chat",
      comments: [],
      checkedIn: "Cancelled",
      checkingInDate: "2023-11-15",
      checkingInTime: "12:00pm",
    },
    
  ];

  const [filteredTrips, setFilteredTrips] = useState(tripHistory);

  const filterTripsByTab = (tab) => {
    if (tab === "All") {
      setFilteredTrips(tripHistory);
    } else {
      const filtered = tripHistory.filter((trip) => {
        return trip.checkedIn.toLowerCase() === tab.toLowerCase(); // Make it case-insensitive
      });
      setFilteredTrips(filtered);
    }
    setSelectedTab(tab);
  };

  return (
    <div className=" h-[100vh]  overflow-auto example">
      <Header />
      <div className="mx-auto md:w-[90%]">
        <header className="text-4xl pl-6 py-6 font-bold">Trips History</header>
        <div className="flex flex-wrap  p-4">
          <button
            className={`${
              selectedTab === "All"
                ? "bg-orange-400  text-white"
                : "bg-gray-200 text-gray-600"
            } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("All")}
            title="Show all trips" // Add the title attribute

          >
            All
          </button>
          <button
            className={`${
              selectedTab === "Reserved"
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
            className={`${
              selectedTab === "Checked in"
                ? "bg-orange-400 text-white"
                : "bg-gray-200 text-gray-600"
            } px-4 py-2 rounded-full m-2`}
            onClick={() => filterTripsByTab("Checked in")}
            title="The booking is confirmed, and the check-in date is approaching. This status is typically used for upcoming trips."

          >
            Checked In
          </button>
          <button
            className={`${
              selectedTab === "Checked Out"
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
  className={`${
    selectedTab === "Cancelled"
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
        <div className="flex flex-wrap">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip, index) => (
              <div
                key={index}
                className="md:w-2/5 m-5 cursor-pointer w-full   rounded-lg"
              >
                <div className="relative">
                  <div className="absolute p-4 uppercase text-white bg-orange-400">
                    {trip.checkedIn}
                  </div>
                  <img
                    src={trip.image}
                    alt=""
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="font-bold text-xl">{trip.destination}</h2>
                  <div className="flex flex-wrap  my-1">
                    <p className="flex items-center mr-2 text-sm">
                      <img src={calender} className="w-4 mr-3" alt="" />{" "}
                      {trip.startDate}
                    </p>
                    <p className="flex items-center text-sm">
                      <img src={calender} className="w-4 mr-3" alt="" />{" "}
                      {trip.endDate}
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
                    ₦{trip.price}
                  </div>
                  <div>
                    <span>{trip.checkingInDate}</span>
                  </div>
                  <div>
                    <button
                      className="bg-orange-400 p-4 rounded-full mt-7 text-white text-lg"
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
                  planning your next adventure.
                </p>
              </div>

              <button className="bg-orange-400 p-4 rounded-full mt-7 text-white text-lg">
                Start Searching
              </button>
            </div>
          )}
        </div>
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
                  className="mt-2 w-full h-2/5 object-cover rounded-lg"
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
                      className={`cursor-pointer ${
                        selectedPhotoIndex === index
                          ? "border-2 border-orange-400"
                          : ""
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-20 md:w-32 m-2 md:h-32 object-cover rounded-lg"
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
                  {selectedTrip.price}
                </div>

                <div className="text-base text-black  mt-2">
                  {selectedTrip.notes}
                </div>

                <div className="my-4">
                  <h1 className="font-bold text-2xl">Amenities</h1>
                  {selectedTrip.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </div>
              </div>
            </div>
            <div className="mb-10 flex space-x-3">
            <div>
                <button className="bg-orange-400 px-4 py-2 rounded-full   text-white text-sm"
                            onClick={openCancellationModal} // Step 3: Open the cancellation modal
                            >
                  Cancel Reservation
                </button>
              </div>
              {selectedTrip.contactHost && (
                <Link
                  to={selectedTrip.contactHost}
                  className="bg-orange-400 px-4 py-2 rounded-full text-center   text-white text-sm"
                >
                  Contact Host
                </Link>
              )}

             
            </div>
          </div>
        </div>
      )}

{isCancellationModalOpen && (
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
              {selectedTrip.destination}? Please provide a reason for
              cancellation:
            </p>
            <textarea
              rows="3"
              className="w-full mt-2 p-2 border rounded"
              placeholder="Reason for cancellation"
            ></textarea>
            <button
              className="bg-orange-400 p-4 rounded-full text-white mt-4"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      )}
      <div className="my-10 pb-32">
        {tripHistory.length > 0 && <PaginationExample />}
      </div>
      <BottomNavigation />
    </div>
  );
}
