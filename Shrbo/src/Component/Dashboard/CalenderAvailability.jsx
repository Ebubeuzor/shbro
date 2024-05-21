import React, { useState, useEffect } from "react";
import ArrowDown from "../../assets/line-angle-down-icon.svg";
import axios from "../../Axios";
import { message, notification } from 'antd';

const CalendarAvailability = ({ minNight, maxNight, availabilityWindow, prepTime, advanceNotice, houseId,isHouseLoading }) => {
  const [advanceNoticeModalVisible, setAdvanceNoticeModalVisible] = useState(false);
  const [preparationTimeModalVisible, setPreparationTimeModalVisible] = useState(false);

  const [availabilityWindowModalVisible, setAvailabilityWindowModalVisible] = useState(false);//d
  const [minNightsModalVisible, setMinNightsModalVisible] = useState(false);
  const [maxNightsModalVisible, setMaxNightsModalVisible] = useState(false);

  const [selectedAdvanceNotice, setSelectedAdvanceNotice] = useState("");
  const [inputedAdvanceNotice, setInputedAdvanceNotice] = useState("");

  const [selectedPreparationTime, setSelectedPreparationTime] = useState("");
  const [inputedPreparationTime, setInputedPreparationTime] = useState("");

  const [selectedAvailabilityWindow, setSelectedAvailabilityWindow] = useState("");
  const [inputedAvailabilityWindow, setInputedAvailabilityWindow] = useState("");

  const [selectedMinNights, setSelectedMinNights] = useState("");
  const [inputedMinNights, setInputedMinNights] = useState("");

  const [selectedMaxNights, setSelectedMaxNights] = useState("");
  const [inputedMaxNights, setInputedMaxNights] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedAvailabilityWindow(availabilityWindow ?? "");
    setSelectedMaxNights(maxNight ?? 365);
    setSelectedMinNights(minNight ?? 1);
    setSelectedPreparationTime(prepTime ?? "");
    setSelectedAdvanceNotice(advanceNotice ?? "");
  }, [maxNight, availabilityWindow, prepTime, advanceNotice, minNight]);


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
    setInputedAdvanceNotice(option);
  };

  const handlePreparationTimeSelection = (option) => {
    setInputedPreparationTime(option);
  };

  const handleAvailabilityWindowSelection = (option) => {
    setInputedAvailabilityWindow(option);
  };

  const handleMinNightsInput = (value) => {


    if (/^\d*$/.test(value) && value.length <= 4) {
      setInputedMinNights(value);

    }
  };

  const handleMaxNightsInput = (value) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setInputedMaxNights(value);
    }
  };
  ///////////////////

  const handleAdvanceNoticeSubmit = async () => {
    const id = houseId;

    console.log(inputedAdvanceNotice)
    setLoading(true);

    await axios.put(`schdulerEditHostHomeAdvanceNotice/${id}`, { notice: inputedAdvanceNotice }).then(response => {
      setSelectedAdvanceNotice(inputedAdvanceNotice);

      message.success("Updated Advance Notice")

      setLoading(false);
      // console.log(response);

    }).catch(err => {
      message.error("Couldn't Update Advance Notice")
      setLoading(false);
      console.log(err)
      // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
    }).finally(() => {
      setAdvanceNoticeModalVisible(false);

    });
  };//d

  const handlePreparationTimeSubmit = async () => {
    setLoading(true)
    const id = houseId;
    await axios.put(`/schdulerEditHostHomePreparationTime/${id}`, { preparation_time: inputedPreparationTime }).then(response => {
      setSelectedPreparationTime(inputedPreparationTime);
      message.success("Updated Preparation Time ")
      // console.log(response);
      setLoading(false)
      
    }).catch(err => {
      message.error("Couldn't Update Preparation Time ")
      setLoading(false)
      console.log(err)
      // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
    }).finally(() => {
      setPreparationTimeModalVisible(false);
      
      
    });


  };//d

  const handleAvailabilityWindowSubmit = async () => {
    
    setLoading(true);
    const id = houseId;
    await axios.put(`/schdulerEditHostHomeAvailabilityWindow/${id}`, { availability_window: inputedAvailabilityWindow }).then(response => {
      setSelectedAvailabilityWindow(inputedAvailabilityWindow);
      message.success("Updated Availability Window ")
      // console.log(response);
      setLoading(false);
      
    }).catch(err => {
      message.error(" Couldn't Update Availability Window ")
      setLoading(false);
      console.log(err)
      // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
    }).finally(() => {
      setAvailabilityWindowModalVisible(false);
      
      

    });



  };//d

  const handleMinNightsSubmit = async () => {

    if (inputedMinNights.length === 0) {
      setErrorMessage("Min Nights can't be empty")
      return;
    }

    if (inputedMinNights > selectedMaxNights) {
      setErrorMessage("Min Nights can't be higher than Max Nights")
      return;
    }

    if (inputedMinNights < 1) {
      setErrorMessage("lowest Min Nights allowed is 1")
      return;
    }

    setErrorMessage("");
    setInputedMaxNights("")

    
    setLoading(true);
    
    const id = houseId;
    await axios.put(`/schdulerEditHostHomeMinNights/${id}`, { night: inputedMinNights }).then(response => {
      setSelectedMinNights(inputedMinNights);
      message.success("Updated Min Nights ")
      setLoading(false);
      // console.log(response);
      
    }).catch(err => {
      setLoading(false);
      message.error("Couldn't Update Min Nights ")
      console.log(err)
      // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
    }).finally(()=>{
      setMinNightsModalVisible(false);
      
    });
  };//d

  const handleMaxNightsSubmit = async () => {
    const id = houseId;
    console.log(inputedMaxNights)


    if (inputedMaxNights.length === 0) {
      setErrorMessage("Max Nights can't be empty")
      return;
    }

    if (inputedMaxNights < selectedMinNights) {
      setErrorMessage("Max Nights can't be lower than Min Nights")
      return;
    }

    setErrorMessage("");
    setInputedMaxNights("")
    setLoading(true);
    
    await axios.put(`/schdulerEditHostHomeMaxNights/${id}`, { night: inputedMaxNights }).then(response => {
      setSelectedMaxNights(inputedMaxNights)
      message.success("Updated Max Nights ")
      setLoading(false);
      // console.log(response);
      
    }).catch(err => {
      setLoading(false);
      message.error("Couldn't Update Max Nights ")
      console.log(err)
      // setWeekendPrice(selectedApartment.customWeekendPrice != null ? selectedApartment.customWeekendPrice : selectedApartment.basePrice)
    }).finally(()=>{
      setMaxNightsModalVisible(false);
      
    });
  };//d

  return (
    <>
    {!isHouseLoading?
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
                  <div className=" font-semibold " >{selectedMinNights || ""}</div>
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
                  <div className=" font-semibold " >{selectedMaxNights || ""}</div>
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
                  <div className=" font-semibold " >{selectedAdvanceNotice || ""}</div>
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
                  <div className=" font-semibold " >{selectedPreparationTime || ""}</div>
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
                  <div className=" font-semibold " >{selectedAvailabilityWindow || ""}</div>
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
            <h2 className="text-5xl text-gray-700 font-semibold mb-2">Advance notice</h2>
            <p className=" font-light md:text-sm mb-4 ">How much advance notice do you require between a guest's booking and their arrival?</p>
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
                className="bg-orange-400 w-full hover:bg-orange-400 text-white relative font-bold py-2 px-4 rounded mr-2"
                onClick={handleAdvanceNoticeSubmit}
                disabled={loading}
              >
                Save
                {loading && <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                  <div className="dot-pulse1 w-12">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                  {/* </div> */}
                </div>}
              </button>
              <button
                className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
                onClick={() => setAdvanceNoticeModalVisible(false)}
                disabled={loading}
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
            <h2 className="text-5xl font-semibold text-gray-700 mb-3">Preparation time</h2>
            <p className=" font-light md:text-sm mb-4 ">How many nights do you need to block off before and after each reservation?</p>
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
                className="bg-orange-400 w-full hover:bg-orange-400 relative text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handlePreparationTimeSubmit}
                disabled={loading}
              >
                Save
                {loading && <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                  <div className="dot-pulse1 w-12">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                  {/* </div> */}
                </div>}
              </button>
              <button
                className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
                onClick={() => setPreparationTimeModalVisible(false)}
                disabled={loading}
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
            <h2 className="text-5xl font-semibold text-gray-700 mb-4">Availability window</h2>
            <p className=" font-light md:text-sm mb-4 ">What is the maximum time frame within which guests can make a reservation in advance?</p>
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
                className="bg-orange-400 w-full relative hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleAvailabilityWindowSubmit}
                disabled={loading}
                >
                Save
                {loading && <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                  <div className="dot-pulse1 w-12">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                  {/* </div> */}
                </div>}
              </button>
              <button
                className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
                onClick={() => setAvailabilityWindowModalVisible(false)}
                disabled={loading}
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
                // type="number"
                value={inputedMinNights}
                onChange={(e) => handleMinNightsInput(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-400"
              />
              <label className=" text-red-600">{errorMessage}</label>
            </div>
            <div className="my-5 space-y-2">
              <button
                className="bg-orange-400 w-full relative hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleMinNightsSubmit}
                disabled={loading}
                >
                Save

                {loading && <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                  <div className="dot-pulse1 w-12">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                  {/* </div> */}
                </div>}
              </button>
              <button
                className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
                onClick={() => { setMinNightsModalVisible(false); setInputedMinNights(""); setErrorMessage(""); }}
                disabled={loading}
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

                value={inputedMaxNights}
                onChange={(e) => handleMaxNightsInput(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-400"
              />
              <label className=" text-red-600">{errorMessage}</label>
            </div>
            <div className="my-5 space-y-2">
              <button
                className="bg-orange-400 w-full relative hover:bg-orange-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleMaxNightsSubmit}
                disabled={loading}
                >
                Save

                {loading && <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                  <div className="dot-pulse1 w-12">
                    <div className="dot-pulse1__dot"></div>
                  </div>
                  {/* </div> */}
                </div>}
              </button>
              <button
                className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
                onClick={() => { setMaxNightsModalVisible(false); setInputedMaxNights(""); setErrorMessage(""); }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    :
    <>
        
        <div>
          <div className=" skeleton-loader w-28 rounded h-6 mt-5 "></div>

          <div className=" skeleton-loader w-full  h-16 mt-7 "></div>
          <div className=" skeleton-loader w-full  h-16 mt-2 "></div>


          <div className=" skeleton-loader w-28 rounded h-6 mt-7 "></div>
         

          <div className=" skeleton-loader w-full  h-16 mt-2 "></div>
          <div className=" skeleton-loader w-full  h-16 mt-2 "></div>
          <div className=" skeleton-loader w-full  h-16 mt-2 "></div>

        </div>

      </>}

    </>
   

    
    
  );
}





export default CalendarAvailability;