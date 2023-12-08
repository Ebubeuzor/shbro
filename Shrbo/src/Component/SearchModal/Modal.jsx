import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal as AntModal, Button } from "antd"; // Rename the imported Modal
import "react-datepicker/dist/react-datepicker.css";
import FilterModal from "../Filter/FilterModal";
import Select, { components } from "react-select";
import LocationIcon from "../../assets/svg/maps-pin-black-icon.svg";
import GuestIcon from "../../assets/svg/couple-icon.svg";
import { DatePicker, Space } from "antd";
import moment from "moment";
import { AutoComplete, Input } from "antd";

const { RangePicker } = DatePicker;

const SearchModal = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guestCounts, setGuestCounts] = useState({
    adults,
    children,
    pets,
    infants,
  });

  const [guests, setGuests] = useState(1);
  const [selectedOption, setSelectedOption] = useState(null);

  const [displayGuestData, setDisplayGuestData] = useState({
    adults,
    children,
    pets,
    infants,
  });

  const handleGuestModalOk = (newAdults, newChildren, newPets, newInfants) => {
    setGuestModalVisible(false);
    setAdults(newAdults);
    setChildren(newChildren);
    setPets(newPets);
    setInfants(newInfants);

    // Update guestCounts when the modal is confirmed
    setDisplayGuestData({
      adults: newAdults,
      children: newChildren,
      pets: newPets,
      infants: newInfants,
    });
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleCheckInDateChange = (date) => {
    setCheckInDate(date);
  };

  const handleCheckOutDateChange = (date) => {
    setCheckOutDate(date);
  };

  const handleGuestsChange = (e) => {
    setGuests(e.target.value);
  };

  const handleSubmit = () => {
    // Check if checkInDate and checkOutDate are valid Date objects
    const formattedCheckInDate =
      checkInDate instanceof Date ? checkInDate.toLocaleDateString() : "N/A";
    const formattedCheckOutDate =
      checkOutDate instanceof Date ? checkOutDate.toLocaleDateString() : "N/A";

    // Create an object with the details you want to log
    const details = {
      location,
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      adults,
      children,
      pets,
      infants,
      selectedOption,
    };

    // Log the details to the console
    console.log("Search Details:", details);

    // Handle form submission here, e.g., send data to the server

    // Close the modal
    onClose();
  };

  function GuestModal({
    visible,
    onCancel,
    onOk,
    adults,
    children,
    pets,
    infants,
  }) {
    const [adultCount, setAdultCount] = useState(adults);
    const [childCount, setChildCount] = useState(children);
    const [petCount, setPetCount] = useState(pets);
    const [infantCount, setInfantCount] = useState(infants);

    const handleDecrease = (setter, value) => {
      if (value > 0) {
        setter(parseInt(value, 10) - 1);
      }
    };

    const handleSubmitInsideModal = (e) => {
      e.preventDefault(); // Prevent the default form submission behavior
      onOk(adultCount, childCount, petCount, infantCount); // Handle the form submission logic
      onCancel(); // Close the modal
    };

    const handleIncrease = (setter, value) => {
      setter(parseInt(value, 10) + 1);
    };

    // Function to handle the change of check-in date
    const handleCheckInDateChange = (date) => {
      setCheckInDate(date);
      // Automatically set the check-out date to align with the check-in date
      setCheckOutDate(date);
    };

    // Function to handle the change of check-out date
    const handleCheckOutDateChange = (date) => {
      setCheckOutDate(date);
    };

    // Function to disable past dates
    const isDateDisabled = (date) => {
      const currentDate = new Date();
      return date < currentDate;
    };

    return (
      <AntModal // Use AntModal here
        title="Select Guests"
        open={visible}
        onCancel={onCancel}
        onOk={() => onOk(adultCount, childCount, petCount, infantCount)}
      >
        <form onSubmit={handleSubmitInsideModal}>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-col">
                <span className="text-lg">Adults:</span> <br />
                <p className="text-gray-400">Ages 13 or above</p>
              </div>
              <div className="space-x-2">
                <Button
                  shape="circle"
                  onClick={() => handleDecrease(setAdultCount, adultCount)}
                >
                  -
                </Button>
                <span>{adultCount}</span>
                <Button
                  shape="circle"
                  onClick={() => handleIncrease(setAdultCount, adultCount)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-col">
                <span className="text-lg">Children:</span>
                <p className="text-gray-400">Ages 2–12</p>
              </div>
              <div className="space-x-2">
                <Button
                  shape="circle"
                  onClick={() => handleDecrease(setChildCount, childCount)}
                >
                  -
                </Button>
                <span>{childCount}</span>
                <Button
                  shape="circle"
                  onClick={() => handleIncrease(setChildCount, childCount)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-col">
                <span className="text-lg">Pets:</span>
                <p>
                  <Link className="text-gray-400 underline">
                    Bringing a service animal?
                  </Link>
                </p>
              </div>
              <div className="space-x-2">
                <Button
                  shape="circle"
                  onClick={() => handleDecrease(setPetCount, petCount)}
                >
                  -
                </Button>
                <span>{petCount}</span>
                <Button
                  shape="circle"
                  onClick={() => handleIncrease(setPetCount, petCount)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-col">
                <span className="text-lg">Infants:</span>
                <p className="text-gray-400">Under 2</p>
              </div>
              <div className="space-x-2">
                <Button
                  shape="circle"
                  onClick={() => handleDecrease(setInfantCount, infantCount)}
                >
                  -
                </Button>
                <span>{infantCount}</span>
                <Button
                  shape="circle"
                  onClick={() => handleIncrease(setInfantCount, infantCount)}
                >
                  +
                </Button>
              </div>
            </div>

            <button type="submit">submit</button>
          </div>
        </form>
      </AntModal>
    );
  }

  const options = [
    { value: "Lekki", label: "Lekki" },
    { value: "Victoria Island", label: "Victoria Island" },
    { value: "Satellite town", label: "Satellite town" },
  ];

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={LocationIcon} className="w-5" alt="" />
      </components.DropdownIndicator>
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 z-50 w-full h-[100vh] overflow-auto md:h-full flex items-center justify-center bg-slate-900  bg-opacity-90 ${
        isOpen ? "visible " : "invisible"
      }`}
    >
      <div className=" relative bg-white p-4  w-full h-[100vh] overflow-auto md:h-[70vh] md:w-[50%] md:rounded-xl">
        <header>
          <h1 className="text-center text-2xl mb-4">Lorem Ipsum</h1>
        </header>
        <div className=" md:h-2/6">
          <div className="mb-4 border p-4">
            <Select
              className="text-black"
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              placeholder={"Choose Location"}
              components={{ DropdownIndicator }}
            />
          </div>
          <div className="mb-4 overflow-scroll">
            <Space direction="vertical" size={12}>
              <RangePicker
                className="custom-picker"
                value={
                  checkInDate && checkOutDate
                    ? [moment(checkInDate), moment(checkOutDate)]
                    : [null, null]
                }
                onChange={(dates) => {
                  if (dates && dates.length === 2) {
                    const [startDate, endDate] = dates;
                    handleCheckInDateChange(startDate.toDate());
                    handleCheckOutDateChange(endDate.toDate());
                  } else {
                    // Handle the case when the date range is cleared
                    handleCheckInDateChange(null);
                    handleCheckOutDateChange(null);
                  }
                }}
              />
            </Space>
          </div>

          <div className="mb-4">
            <div
              onClick={() => setGuestModalVisible(true)}
              className="w-full text-start  py-4"
            >
              <label className=" bg-orange-400 rounded-2xl py-2 text-white px-2">
                {displayGuestData.adults +
                  displayGuestData.children +
                  displayGuestData.pets +
                  displayGuestData.infants ===
                0
                  ? "Add Guests"
                  : "Guests"}
                :
              </label>
              <br />
              {displayGuestData.adults +
                displayGuestData.children +
                displayGuestData.pets +
                displayGuestData.infants >
                0 && (
                <>
                  <div className="mt-5 text-gray-500">
                    {displayGuestData.adults} Adults,{" "}
                    {displayGuestData.children} Children,{" "}
                    {displayGuestData.pets} Pets, {displayGuestData.infants}{" "}
                    Infants
                  </div>
                </>
              )}
            </div>

            <GuestModal
              visible={guestModalVisible}
              onCancel={() => setGuestModalVisible(false)}
              onOk={handleGuestModalOk}
              adults={adults}
              children={children}
              pets={pets}
              infants={infants}
            />
          </div>
          <div>{/* <FilterModal /> */}</div>
          <div className="absolute bottom-20 md:bottom-7 flex items-center left-0 right-0 w-[90%] mx-auto space-x-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-orange-400 text-white font-semibold py-2 rounded-lg hover:bg-orange-500 transition duration-300"
            >
              Check Availability
            </button>
            <button
              onClick={onClose}
              className="w-full  text-gray-700 font-semibold py-2 border rounded-lg hover:bg-gray-100 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
