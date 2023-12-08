import React, { useState } from "react";
import ArrowDown from "../../assets/line-angle-down-icon.svg";

export default function CalendarAvailability() {
  const [advanceNoticeModalVisible, setAdvanceNoticeModalVisible] = useState(false);
  const [preparationTimeModalVisible, setPreparationTimeModalVisible] = useState(false);
  const [availabilityWindowModalVisible, setAvailabilityWindowModalVisible] = useState(false);
  const [minNightsModalVisible, setMinNightsModalVisible] = useState(false);
  const [maxNightsModalVisible, setMaxNightsModalVisible] = useState(false);

  const [selectedAdvanceNotice, setSelectedAdvanceNotice] = useState("");
  const [selectedPreparationTime, setSelectedPreparationTime] = useState("");
  const [selectedAvailabilityWindow, setSelectedAvailabilityWindow] = useState("");
  const [selectedMinNights, setSelectedMinNights] = useState("");
  const [selectedMaxNights, setSelectedMaxNights] = useState("");

  const advanceNoticeOptions = [
    "Same day",
    "At least 1 day",
    "At least 2 days",
    "At least 3 days",
    "At least 7 days",
    "Allow requests with shorter notice",
  ];

  const preparationTimeOptions = [
    "None",
    "1 night before and after each reservation",
    "2 nights before and after each reservation",
  ];

  const availabilityWindowOptions = [
    "24 months in advance",
    "12 months in advance",
    "9 months in advance",
    "6 months in advance",
    "3 months in advance",
    "Dates unavailable by default",
  ];

  const handleAdvanceNoticeSelection = (option) => {
    setSelectedAdvanceNotice(option);
  };

  const handlePreparationTimeSelection = (option) => {
    setSelectedPreparationTime(option);
  };

  const handleAvailabilityWindowSelection = (option) => {
    setSelectedAvailabilityWindow(option);
  };

  const handleMinNightsInput = (value) => {
    setSelectedMinNights(value);
  };

  const handleMaxNightsInput = (value) => {
    setSelectedMaxNights(value);
  };

  const handleAdvanceNoticeSubmit = () => {
    setAdvanceNoticeModalVisible(false);
  };

  const handlePreparationTimeSubmit = () => {
    setPreparationTimeModalVisible(false);
  };

  const handleAvailabilityWindowSubmit = () => {
    setAvailabilityWindowModalVisible(false);
  };

  const handleMinNightsSubmit = () => {
    setMinNightsModalVisible(false);
  };

  const handleMaxNightsSubmit = () => {
    setMaxNightsModalVisible(false);
  };

  return (
    <div>
      <div>

      <div className="mb-10">
        <h1 className="my-5 font-bold text-2xl">Trips Length</h1>
      <div className="mb-4">
          <button
            className="border w-full py-2 px-4 rounded"
            onClick={() => setMinNightsModalVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex text-start flex-col">
                <div>
                  <span>Minimum Nights</span>
                </div>
                <div>{selectedMinNights || ""}</div>
              </div>
              <div>
                <img src={ArrowDown} className="w-3" alt="" />
              </div>
            </div>
          </button>
        </div>


        <div className="mb-4">
          <button
            className="border w-full py-2 px-4 rounded"
            onClick={() => setMaxNightsModalVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex text-start flex-col">
                <div>
                  <span>Maximum Nights</span>
                </div>
                <div>{selectedMaxNights || ""}</div>
              </div>
              <div>
                <img src={ArrowDown} className="w-3" alt="" />
              </div>
            </div>
          </button>
        </div>
      </div>


      <div>
      <h1 className="my-5 font-bold text-2xl">Availability</h1>
      <div className="mb-4">
          <button
            className="border w-full py-2 px-4 rounded"
            onClick={() => setAdvanceNoticeModalVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex text-start flex-col">
                <div>
                  <span>Advance Notice</span>
                </div>
                <div>{selectedAdvanceNotice || ""}</div>
              </div>
              <div>
                <img src={ArrowDown} className="w-3" alt="" />
              </div>
            </div>
          </button>
        </div>
        <div className="mb-4">
          <button
            className="border w-full py-2 px-4 rounded"
            onClick={() => setPreparationTimeModalVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex text-start flex-col">
                <div>
                  <span>Preparation Time</span>
                </div>
                <div>{selectedPreparationTime || ""}</div>
              </div>
              <div>
                <img src={ArrowDown} className="w-3" alt="" />
              </div>
            </div>
          </button>
        </div>
        <div className="mb-4">
          <button
            className="border w-full py-2 px-4 rounded"
            onClick={() => setAvailabilityWindowModalVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div className="flex text-start flex-col">
                <div>
                  <span>Availability Window</span>
                </div>
                <div>{selectedAvailabilityWindow || ""}</div>
              </div>
              <div>
                <img src={ArrowDown} className="w-3" alt="" />
              </div>
            </div>
          </button>
        </div>
      </div>
      



   
      </div>
      {advanceNoticeModalVisible && (
        <div className="fixed  top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white w-full h-full md:h-fit md:w-2/5 p-10 rounded shadow-lg">
            <h2 className="text-5xl text-gray-700 font-semibold mb-4">Advance Notice</h2>
            <div>
              {advanceNoticeOptions.map((option) => (
                <div key={option} className="mb-2">
                  <label className="inline-flex items-center cursor-pointer ">
                    <input
                      type="radio"
                      name="advanceNotice"
                      value={option}
                      onChange={() => handleAdvanceNoticeSelection(option)}
                      className="custom-radio h-5 w-5 focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <button
                className="bg-orange-400 w-full hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleAdvanceNoticeSubmit}
              >
                Save
              </button>
              <button
                className="border w-full  font-bold py-2 px-4 rounded"
                onClick={() => setAdvanceNoticeModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {preparationTimeModalVisible && (
        <div className="fixed  top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white md:w-2/5 w-full h-full md:h-fit p-10 rounded shadow-lg">
            <h2 className="text-5xl font-semibold text-gray-700 mb-4">Preparation Time</h2>
            <div>
              {preparationTimeOptions.map((option) => (
                <div key={option} className="mb-2">
                  <label className="inline-flex items-center cursor-pointer ">
                    <input
                      type="radio"
                      name="preparationTime"
                      value={option}
                      onChange={() => handlePreparationTimeSelection(option)}
                      className="custom-radio h-5 w-5 focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <button
                className="bg-orange-400 w-full hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handlePreparationTimeSubmit}
              >
                Save
              </button>
              <button
                className="border w-full  font-bold py-2 px-4 rounded"
                onClick={() => setPreparationTimeModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {availabilityWindowModalVisible && (
        <div className="fixed  top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white md:w-2/5 w-full h-full md:h-fit p-10 rounded shadow-lg">
            <h2 className="text-5xl font-semibold text-gray-700 mb-4">Availability Window</h2>
            <div>
              {availabilityWindowOptions.map((option) => (
                <div key={option} className="mb-2">
                  <label className="inline-flex items-center cursor-pointer ">
                    <input
                      type="radio"
                      name="availabilityWindow"
                      value={option}
                      onChange={() => handleAvailabilityWindowSelection(option)}
                      className="custom-radio h-5 w-5 focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              <button
                className="bg-orange-400 w-full hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleAvailabilityWindowSubmit}
              >
                Save
              </button>
              <button
                className="border w-full  font-bold py-2 px-4 rounded"
                onClick={() => setAvailabilityWindowModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {minNightsModalVisible && (
        <div className="fixed  top-0 left-0 w-full h-full   flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white md:w-2/5  p-10 rounded shadow-2xl ">
            <h2 className="text-5xl font-semibold mb-4 text-gray-700">Minimum Nights</h2>
            <div>
              <input
                type="number"
                value={selectedMinNights}
                onChange={(e) => handleMinNightsInput(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="my-5 space-y-2">
              <button
                className="bg-orange-400 w-full hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleMinNightsSubmit}
              >
                Save
              </button>
              <button
            className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
            onClick={() => setMinNightsModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {maxNightsModalVisible && (
        <div className="fixed  top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white md:w-2/5  p-10 rounded shadow-2xl">
            <h2 className="text-5xl font-semibold mb-4 text-gray-700">Maximum Nights</h2>
            <div>
              <input
                type="number"
                value={selectedMaxNights}
                onChange={(e) => handleMaxNightsInput(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="my-5 space-y-2">
              <button
                className="bg-orange-400 w-full hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleMaxNightsSubmit}
              >
                Save
              </button>
              <button
            className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
            onClick={() => setMaxNightsModalVisible(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
