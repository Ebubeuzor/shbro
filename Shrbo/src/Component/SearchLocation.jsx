import React, { useState } from "react";
import Select, { components } from "react-select"; 
import { Modal, Button } from "antd";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import DateIcon from "../assets/svg/date-icon.svg";
import GuestIcon from "../assets/svg/couple-icon.svg";
import LocationIcon from "../assets/svg/maps-pin-black-icon.svg";
import SearchIcon from "../assets/svg/search-icon.svg"


const options = [
  { value: "Lekki", label: "Lekki" },
  { value: "Victoria Island", label: "Victoria Island" },
  { value: "Satellite town", label: "Satellite town" },
];

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

  const handleIncrease = (setter, value) => {
    setter(parseInt(value, 10) + 1);
  };
  return (
    <Modal
      title="Select Guests"
      open={visible}
      onCancel={onCancel}
      onOk={() => onOk(adultCount, childCount, petCount, infantCount)}
    >
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
      </div>
    </Modal>
  );
}

export default function SearchLocation() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [dates, setDates] = useState([]);
  const [guestModalVisible, setGuestModalVisible] = useState(false);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [infants, setInfants] = useState(0);

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null); 

  const handleGuestModalOk = (newAdults) => {
    setGuestModalVisible(false);
    setAdults(newAdults);
  };

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <img src={LocationIcon} className="w-5" alt="" />
      </components.DropdownIndicator>
    );
  };

  return (
    <form className="absolute -bottom-32  md:-bottom-10 md:w-3/4 mx-auto   left-0 right-0 w-[90%]   justify-center text-gray-400  hidden md:block">
      <div className="">
        <div className=" flex   justify-center flex-col md:flex-row bg-orange-400 md:rounded-full rounded-3xl  md:p-10 p-4 items-center text-center md:space-x-4  space-y-4 md:space-y-0">
          <div className="search md:w-[450px] flex items-center justify-between md:rounded-full w-full md:h-[80px] border border-gray-300 shadow-sm p-2 bg-white rounded-full">
            <Select
              className="text-black"
              defaultValue={selectedOption}
              onChange={setSelectedOption}
              options={options}
              placeholder={"Choose Location"}
              components={{ DropdownIndicator }} 
            />
          </div>
          <div className="date flex flex-col  md:flex-row w-full md:w-auto  md:space-x-4 space-y-3 md:space-y-0 ">
            <div className=" border md:rounded-full  border-gray-300 shadow-sm p-3 bg-white  px-6 md:h-[80px] flex items-center  justify-between rounded-full">
              <DatePicker
                selected={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                placeholderText="Check-in "
                minDate={new Date()}
                className="text-black"
              />
              <img src={DateIcon} className="w-4" alt="" />
            </div>
            <div className="  border md:rounded-full border-gray-300 shadow-sm p-3  bg-white  px-6 flex items-center justify-between rounded-full">
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                placeholderText="Check-out "
                className="text-black"
              />
              <img src={DateIcon} className="w-4" alt="" />
            </div>
          </div>
          <div className="guest md:w-[200px] w-full border md:rounded-full border-gray-300 shadow-sm p-3 px-6 bg-white flex justify-between  md:h-[80px] items-center rounded-full">
            <div
              onClick={() => setGuestModalVisible(true)}
              className="w-full text-start"
            >
              Guest
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
            <img src={GuestIcon} className="w-5" alt="" />
          </div>
          <div className="submit md:w-[200px] w-full md:rounded-full border border-orange-400 shadow-sm p-3 px-6 bg-orange-500  md:h-[80px] items-center  text-center text-white   rounded-full flex justify-between">
            <div>
            <img src={SearchIcon} className="w-5"  alt="" />

            </div>
            <button type="submit">Search</button>
          </div>
        </div>
      </div>
    </form>
  );
}
