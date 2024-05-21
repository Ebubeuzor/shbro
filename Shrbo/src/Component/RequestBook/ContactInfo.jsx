import React, { useEffect, useId, useState } from "react";
import { FaPlus, FaPlusCircle, FaTimes, FaTimesCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDateContext } from "../../ContextProvider/BookingInfo";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { message } from "antd";

import Axios from "../../Axios";
export default function Example() {
  const [showExistingCardModal, setShowExistingCardModal] = useState(false);
  const [showAddNewCardModal, setShowAddNewCardModal] = useState(false);
  const [existingCard, setExistingCard] = useState(null);
  const [showPayNowModal, setShowPayNowModal] = useState(false); // State for Pay Now modal
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [existingCards, setExistingCards] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [bookNowDisabled, setBookNowDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingExistingCards, setCheckingExistingCards] = useState(false);

  const navigate = useNavigate();

  const {
    checkInDate,
    checkOutDate,
    adults,
    setAdults,
    pets,

    hostFees,
    serviceFee,
    tax,
    totalPrice,
    totalCost,
    housePrice,
    nights,
    cancellationPolicy,
    title,
    address,
    apartment,

    securityDepsoit,
  } = useDateContext();

  const storedUserId = localStorage.getItem("receiverid");
  console.log(storedUserId);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setCheckingExistingCards(true); // Set loading state
        const response = await Axios.get(`/getUserCards/${storedUserId}`);
        const transformedData = response.data.data.map((item) => ({
          name: item.cardtype,
          cardNumber: item.card_number.replace(/(\d{4})(?=\d)/g, "$1 "),
          expiryDate: item.expiry_data.replace(/(\d{2})(\d{2})/, "$1/$2"),
          cvv: item.CVV,
        }));
        setExistingCards(transformedData);
        console.log(transformedData); // Log the transformed data
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setCheckingExistingCards(false); // Reset loading state
      }
    };

    fetchUser();
  }, [storedUserId]);

  console.log(storedUserId);
  console.log(apartment);

  const [showModal, setShowModal] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const openExistingCardModal = () => {
    setShowExistingCardModal(true);
  };

  const closeExistingCardModal = () => {
    setShowExistingCardModal(false);
  };

  const openAddNewCardModal = () => {
    setShowAddNewCardModal(true);
  };

  const closeAddNewCardModal = () => {
    setShowAddNewCardModal(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { cardNumber } = newCardDetails;
    const existingCard = existingCards.find(
      (card) => card.cardNumber === cardNumber
    );
    if (existingCard) {
      setExistingCard(existingCard);
      openExistingCardModal();
    } else {
      openAddNewCardModal();
    }
  };

  const handleAddNewCard = () => {
    setExistingCard(null);
    closeExistingCardModal();
    openAddNewCardModal();
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setNewCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCvvChange = (e) => {
    const { value } = e.target;
    setNewCardDetails((prev) => ({
      ...prev,
      cvv: value,
    }));
  };

  const addNewCard = (e) => {
    e.preventDefault();
    // Process the new card details here
    console.log(newCardDetails);
    // Close the modal
    setShowAddNewCardModal(false);
  };

  const handleBookNow = (event) => {
    event.preventDefault(); // Prevent the default behavior of the event
    if (!checkInDate || !checkOutDate) {
      // If checkInDate or checkOutDate is empty, disable the button and show a message
      setBookNowDisabled(true);
      setMessage("Please select both check-in and check-out dates.");
      return; // Exit the function early
    }
    if (existingCards.length === 0) {
      setShowAddNewCardModal(true);
      setBookNowDisabled(false); // Enable the button when there are no existing cards
    } else {
      setShowExistingCardModal(true);
      setBookNowDisabled(false); // Enable the button when there are existing cards
    }
  };

  const handleCardSelect = (card) => {
    setExistingCard(card);
    setShowPayNowModal(true); // Set showPayNowModal to true when a card is selected
  };

  const handleBooking = async (event) => {
    event.preventDefault(); // Prevent the default behavior of form submission

    setShowLoader(true);

    const formatDate = (date) => {
      // Ensure date is not null or undefined
      if (!date) return "";

      // Convert date string to Date object
      const dateObject = new Date(date);

      // Extract day, month, and year
      const day = String(dateObject.getDate()).padStart(2, "0");
      const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const year = dateObject.getFullYear();

      // Construct the formatted date string
      return `${day}/${month}/${year}`;
    };

    let payload = {
      adults: adults,
      children: "1",
      pets: pets,
      infants: "1",
      check_in: formatDate(checkInDate),
      check_out: formatDate(checkOutDate),
    };

    if (
      !existingCard &&
      newCardDetails.cardNumber &&
      newCardDetails.expiryDate &&
      newCardDetails.cvv
    ) {
      // If new card details are provided, use them in the payload
      payload.card_number = newCardDetails.cardNumber.replace(
        /(\d{4})/g,
        "$1 "
      ); // Format with spaces
      payload.expiry_data = newCardDetails.expiryDate.split("/").join("");
      payload.CVV = newCardDetails.cvv;
      payload.option = 1; // Set option to 1 for new card
    } else if (existingCard) {
      // If an existing card is selected, include its details in the payload
      payload.card_number = existingCard.cardNumber;
      payload.expiry_data = existingCard.expiryDate.split("/").join("");
      payload.CVV = existingCard.cvv;
      payload.option = 2; // Set option to 2 for existing card
    } else {
      // Handle case where no card details are provided
      console.error("No card details provided");
      return; // Exit the function early
    }

    console.log("Form data:", payload);
    setLoading(true);

    try {
      const response = await Axios.post(
        `/payment/initiate-multiple/${apartment}/${storedUserId}`,
        payload
      );
      console.log("Payment initiated:", response.data.payment_link.url);

      // Navigate to the payment link within the current window
      window.location.href = response.data.payment_link.url;

      setLoading(false);
      setShowLoader(false);

      // Show success message to the user
      // Handle success: redirect user to payment link or show success message
      console.log("Payment initiated successfully");
      // Show success message to the user
      // navigate("/trip");
    } catch (error) {
      console.error("Error initiating payment:", error.response.data);
      message.error(error.response.data.message);

      // Handle error: show error message to user
      console.log("Error initiating payment:", error.response.data);
      // Show error message to the user
      setLoading(false);
      setShowLoader(false);
    }
  };

  {
    bookNowDisabled && <p className="text-red-500 text-sm">{message}</p>;
  }

  const isValidDate = (value) => {
    // Check if the value matches the MM/YY format (e.g., 12/24)
    return /^\d{2}\/\d{2}$/.test(value);
  };
  const handleDateChange = (e) => {
    let { name, value } = e.target;
    // Add slash after entering the first two numbers
    if (value.length === 2 && !value.includes("/")) {
      value += "/";
    }
    setNewCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className=" bg-white  lg:py-4 ">
      {/* <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 text-left sm:text-2xl">
          Contact details
        </h2>
        <p className="mt-2 text-lg text-left leading-8 text-gray-600">
          Aute magna irure deserunt veniam aliqua magna enim voluptate.
        </p>
      </div> */}

      {/* <form
        action="#"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="first-name"
                id="first-name"
                autoComplete="given-name"
                className="block w-full rounded-md border px-3.5 py-2 text-gray-900 shadow-sm 0 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="last-name"
                id="last-name"
                autoComplete="family-name"
                className="block w-full rounded-md border px-3.5 py-2 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border px-3.5 py-2 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="h-full rounded-md border bg-transparent bg-none py-0 pl-4 pr-4 text-gray-400 sm:text-sm"
                >
                  <option>US</option>
                  <option>CA</option>
                  <option>EU</option>
                </select>
              </div>
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                className="block w-full rounded-md  border px-3.5 py-2 pl-20 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border px-3.5 py-2 text-gray-900 shadow-sm focus:outline-gray-400  placeholder:text-gray-400 sm:text-sm sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>
        </div>
      </form> */}
      <div className="mt-10">
        <button
          type="button"
          disabled={bookNowDisabled || checkingExistingCards} // Disable button when checking existing cards
          onClick={handleBookNow}
          className="block w-full rounded-md  px-3.5 bg-orange-500 py-2.5 text-center text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 "
        >
          {checkingExistingCards ? "Checking..." : "Book now"}
        </button>
      </div>
      {showExistingCardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="bg-white pb-10 px-1 rounded-2xl  overflow-hidden shadow-xl h-full md:h-1/2 md:max-w-2xl w-full relative">
            <div className="flex items-center justify-between text-lg font-medium leading-6 text-center bg-white border-b-2 py-5 sticky top-0 z-50">
              <div
                onClick={closeExistingCardModal}
                className="  rounded-md   sm:w-auto sm:text-sm"
              >
                <FaTimesCircle size={25} />
              </div>{" "}
              <div>
                <p className="text-orange-400"> Select Existing Card</p>
              </div>
              <div
                onClick={handleAddNewCard}
                className="flex items-center gap-3  rounded-md border border-transparent cursor-pointer  px-4 py-2 text-orange-400  text-base font-medium  "
              >
                <FaPlusCircle />
                Add a new bank card
              </div>
            </div>
            <div className="px-7 py-4">
              <h1 className="text-orange-400 font-bold">Use Debit Card</h1>
              <p>
                Select a payment provider to add your debit card for payment
              </p>
            </div>
            <div className="px-6 pb-20 md:pb-12 h-3/4 relative overflow-scroll example">
              <div className="pb-10">
                {existingCards.map((card, index) => (
                  <div key={index} className="flex w-full items-center mb-3">
                    <input
                      type="radio"
                      id={`card-${index}`}
                      name="existing-card"
                      value={card.cardNumber}
                      className="hidden focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                      onChange={() => {
                        setExistingCard(card);
                        handleCardSelect(card); // Make sure handleCardSelect is called when the radio button changes
                      }}
                    />
                    <label
                      htmlFor={`card-${index}`}
                      className={`ml-2 text-sm w-full cursor-pointer ${
                        existingCard &&
                        existingCard.cardNumber === card.cardNumber
                          ? "border-8 border-orange-400 rounded-2xl"
                          : ""
                      }`}
                    >
                      <div className="relative w-full h-28  rounded-lg text-black border-[1px] flex justify-center items-center">
                        <div className="absolute inset-0 flex flex-col  px-4">
                          <div className="flex justify-between items-center py-2">
                            <div className="text-sm "> {card.name}</div>
                            <div className="text-sm "></div>
                            <div className="text-sm ">
                              {card.cardNumber && (
                                <>
                                  {card.cardNumber.substr(0, 4)}{" "}
                                  {"*".repeat(card.cardNumber.length - 8)}{" "}
                                  {card.cardNumber.substr(-4)}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between mt-2 py-2">
                            <div className="text-xs ">
                              Exp: {card.expiryDate.split("/").join("")}
                            </div>
                            <div className="text-xs ">
                              CVV: {"*".repeat(card.cvv.length)}
                            </div>
                          </div>
                          <p className="text-orange-400">
                            Click to pay with this card
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {/* <div className="bg-white h-10 hidden md:block fixed bottom-[14.5rem] w-[35%] z-10 px-6 py-3 flex justify-between"></div> */}
            </div>
            {/* Modal footer */}
            {/* <div className="bg-gray-200 h-10 px-6 py-3 flex justify-between"></div> */}
          </div>
        </div>
      )}
      {showPayNowModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div
            className="fixed inset-0 transition-opacity"
            onClick={() => setShowPayNowModal(false)}
          >
            <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
          </div>
          {loading ? (
            <div className="z-50">
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{ fontSize: 40, color: "#FB923C" }}
                    spin
                  />
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden shadow-xl z-50 w-full max-w-md p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Pay Now
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to pay now?
                </p>
              </div>
              <div className="mt-4 flex  w-full">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="mr-2 inline-flex justify-center  rounded-md border border-transparent px-4 py-2 bg-orange-500 text-base font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Pay Now
                </button>
                <button
                  onClick={() => setShowPayNowModal(false)}
                  className="inline-flex justify-center  rounded-md border border-gray-300 px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for adding new card */}
      {showAddNewCardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          {/* Modal content */}
          <div className="bg-white rounded-lg text-left overflow-hidden shadow-xl sm:max-w-lg w-full">
            {/* New card form */}
            <form onSubmit={addNewCard}>
              <div className="bg-gray-50 px-4 py-3 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Add New Card
                </h3>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                {/* Card Number */}
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  value={newCardDetails.cardNumber}
                  onChange={handleCardDetailsChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  maxLength="16"
                  pattern="\d{16}"
                  autoComplete="off" // Disable automatic card filling
                />
                {/* CVV */}
                <label
                  htmlFor="cvv"
                  className="block mt-4 text-sm font-medium text-gray-700"
                >
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={newCardDetails.cvv}
                  onChange={handleCvvChange}
                  id="cvv"
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  maxLength="3"
                  pattern="\d{3}"
                  autoComplete="off" // Disable automatic card filling
                />
                {/* Date */}
                <label
                  htmlFor="date"
                  className="block mt-4 text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  id="expiryDate"
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                  maxLength="5"
                  pattern="\d{2}\/\d{2}"
                  value={newCardDetails.expiryDate}
                  onChange={handleDateChange}
                  autoComplete="off" // Disable automatic card filling
                />
              </div>
              {/* Modal footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleBooking} // Call handleBooking when the button is clicked
                  className="mr-2 inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-orange-500 text-base font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Pay Now
                </button>

                <button
                  onClick={closeAddNewCardModal}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLoader && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-25">
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 40, color: "#FB923C" }}
                spin
              />
            }
          />
        </div>
      )}
    </div>
  );
}
