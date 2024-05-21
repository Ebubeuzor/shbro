import React, { useState } from "react";
import { Slider } from "antd";
import { FaHome, FaHotel, FaBed, FaBuilding } from "react-icons/fa";
import FilterIcon from "../../assets/svg/sliders-icon.svg";
import close from "../../assets/svg/close-line-icon.svg"


export default function FilterModal({search,clearAll}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBedroom, setSelectedBedroom] = useState(null);
  const [selectedBathroom, setSelectedBathroom] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const Min = 5000;
  const Max = 1000000;

  const [values, setValues] = useState([Min, Max]);

  const handleSliderChange = (newValues) => {
    setValues(newValues);
  };

  const handleRoomOptionChange = (num) => {
    setSelectedRoom(num === selectedRoom ? null : num);
  };

  const handleBedroomOptionChange = (num) => {
    setSelectedBedroom(num === selectedBedroom ? null : num);
  };

  const handleBathroomOptionChange = (num) => {
    setSelectedBathroom(num === selectedBathroom ? null : num);
  };

  const propertyTypes = [
    { id: "house", label: "House", icon: <FaHome /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "guestHouse", label: "Guest House", icon: <FaBed /> },
    { id: "apartment", label: "Apartment", icon: <FaBuilding /> },
  ];

  const handleTypeSelection = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const amenitiesList = [
    "Wifi",
    "Kitchen",
    "Washer",
    "Dryer",
    "Air conditioning",
    "Heating",
    "Dedicated workspace",
    "TV",
    "Hair dryer",
    "Iron",
    "Pool",
    "Hot tub",
    "Free parking",
    "EV charger",
    "Crib",
    "Gym",
    "BBQ grill",
    "Breakfast",
    "Indoor fireplace",
    "Smoking allowed",
    "Beachfront",
    "Waterfront",
    "Smoke alarm",
    "Carbon monoxide alarm",
  ];

  const handleAmenitySelection = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((selected) => selected !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleClearAll = () => {
    setSelectedRoom(null);
    setSelectedBedroom(null);
    setSelectedBathroom(null);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setValues([Min, Max]);
    setShowAllAmenities(false);
    clearAll();
    toggleModal()
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedFilters = {
      selectedRoom,
      selectedBedroom,
      selectedBathroom,
      selectedTypes,
      selectedAmenities,
      priceRange: values,
    };
    console.log(selectedFilters);

    search(selectedFilters,toggleModal);

  };

  function formatAmountWithCommas(amount) {
    // Convert the amount to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = amount.toString().split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts with a dot if there is a decimal part
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    return formattedAmount;
}


  return (
    <div className="flex">
      <button
        onClick={toggleModal}
        className="border  font-bold p-2 px-4  space-x-3 text-white rounded-full  flex items-center justify-between"
      >
        <div className=" w-4">
          <img src={FilterIcon} alt="" />
        </div>
      <div className="hidden md:block text-sm">
      Filters
      </div>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg  p-4 relative z-10 w-[95%] h-[90%] md:w-[70%] ">
            <div className="flex items-center">
              <button
                onClick={toggleModal}
                className=" text-gray-800 font-bold py-2 px-4 rounded"
              >
                <img src={close} className="w-4" alt="" />
              </button>

              <h1 className="mx-auto font-bold text-lg text-black">Filter</h1>
            </div>
            <form onSubmit={handleSubmit} className="h-[inherit] w-full p-4">
              <div className="modal-content overflow-y-auto example h-full w-full">
                <div className="price-container w-full p-2">
                  <h3 className="text-2xl">Price Range</h3>
                  <p className="text-sm text-slate-400">
                    Nightly prices before fees and taxes
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="border w-[40%] p-2">
                      <span className=" text-slate-300" >Min</span>
                      <input type="text" readOnly  placeholder={`₦ ${formatAmountWithCommas(values[0])}`} />
                    </div>{" "}
                    -{" "}
                    <div className="border w-[40%] p-2">
                    <span className=" text-slate-300" >Max</span>
                      <input type="text" readOnly placeholder={`₦ ${formatAmountWithCommas(values[1])}`} />
                    </div>{" "}
                  </div>
                  <small>
                    Current Range: ₦{values[0]} - ₦{values[1]}
                  </small>

                  <Slider
                    range
                    onChange={handleSliderChange}
                    value={values}
                    min={Min}
                    max={Max}
                  />

                  <div className="space-y-4">
                    <h3 className="text-2xl">Rooms & Beds</h3>

                    <div className="room-options ">
                      <h3 className="text-xl text-slate-700">Beds</h3>
                      <div className="flex space-x-3 flex-wrap">
                        {["Any", 1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
                          <div
                            key={num}
                            className={`room-option m-2 ${
                              selectedBedroom === num
                                ? "bg-orange-500 "
                                : "border "
                            }  h-12 w-12 rounded-full text-center`}
                          >
                            <label
                              className={`cursor-pointer p-3 w-full flex  justify-center ${
                                selectedBedroom === num
                                  ? "text-white p-3"
                                  : "text-black p-3"
                              }`}
                            >
                              <input
                                type="radio"
                                name="bedroom"
                                value={num}
                                className="hidden"
                                checked={selectedBedroom === num}
                                onChange={() => handleBedroomOptionChange(num)}
                              />
                              {num} {num !== "8+" && num !== 1 && ""}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="room-options">
                      <h3 className="text-xl text-slate-700">Bedrooms</h3>
                      <div className="flex space-x-3 flex-wrap">
                        {["Any", 1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
                          <div
                            key={num}
                            className={`room-option m-2 ${
                              selectedRoom === num
                                ? "bg-orange-500 "
                                : "border "
                            }  h-12 w-12 rounded-full text-center`}
                          >
                            <label
                              className={`cursor-pointer p-3 w-full flex  justify-center ${
                                selectedRoom === num
                                  ? "text-white p-3"
                                  : "text-black p-3"
                              }`}
                            >
                              <input
                                type="radio"
                                name="room"
                                value={num}
                                className="hidden"
                                checked={selectedRoom === num}
                                onChange={() => handleRoomOptionChange(num)}
                              />
                              {num} {num !== "8+" && num !== 1 && ""}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="room-options">
                      <h3 className="text-xl text-slate-700">Bathrooms</h3>
                      <div className="flex space-x-3 flex-wrap">
                        {["Any", 1, 2, 3, 4, 5, 6, 7, "8+"].map((num) => (
                          <div
                            key={num}
                            className={`room-option m-2 ${
                              selectedBathroom === num
                                ? "bg-orange-500"
                                : "border "
                            }  h-12 w-12 rounded-full text-center`}
                          >
                            <label
                              className={`cursor-pointer p-3 w-full flex  justify-center ${
                                selectedBathroom === num
                                  ? "text-white p-3"
                                  : "text-black p-3"
                              }`}
                            >
                              <input
                                type="radio"
                                name="bathroom"
                                value={num}
                                className="hidden"
                                checked={selectedBathroom === num}
                                onChange={() => handleBathroomOptionChange(num)}
                              />
                              {num} {num !== "8+" && num !== 1 && ""}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className=" space-y-4">
                      <h3 className="text-xl font-semibold ">Property Types</h3>
                      <div className="flex flex-wrap   w-full">
                        {propertyTypes.map((type) => (
                          <div
                            key={type.id}
                            className={`property-type h-20 w-32 m-3   flex ${
                              selectedTypes.includes(type.id)
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-black"
                            } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                            onClick={() => handleTypeSelection(type.id)}
                          >
                            <span className="mr-2">{type.icon}</span>
                            {type.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl">Amenities</h3>
                      <div className="flex flex-wrap w-full">
                        {showAllAmenities
                          ? amenitiesList.map((amenity) => (
                              <div
                                key={amenity}
                                className={`amenity-checkbox m-2 ${
                                  selectedAmenities.includes(amenity)
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-200 text-black"
                                } px-4 py-2 rounded-md cursor-pointer`}
                                onClick={() => handleAmenitySelection(amenity)}
                              >
                                {amenity}
                              </div>
                            ))
                          : amenitiesList.slice(0, 10).map((amenity) => (
                              <div
                                key={amenity}
                                className={`amenity-checkbox m-2 ${
                                  selectedAmenities.includes(amenity)
                                    ? "bg-orange-500 text-white"
                                    : "bg-gray-200 text-black"
                                } px-4 py-2 rounded-md cursor-pointer`}
                                onClick={() => handleAmenitySelection(amenity)}
                              >
                                {amenity}
                              </div>
                            ))}
                        <div
                          className="text-black cursor-pointer flex justify-end items-center"
                          onClick={() => setShowAllAmenities(!showAllAmenities)}
                        >
                          {showAllAmenities ? "View Less" : "View More"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="border text-black font-bold py-2 px-4 rounded"
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    className="border  text-black font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
