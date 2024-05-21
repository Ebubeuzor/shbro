import React, { useState,useEffect } from "react";
import { Slider } from "antd";
// import "antd/dist/antd.css";

const DiscountCustomModal = ({ visible, onClose, onSubmit, discountType,percentage,loading }) => {
  const [discountDuration, setDiscountDuration] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const handleCancel = () => {
    // setDiscountPercentage(percentage)
    onClose();
  };


  useEffect(()=>{
    setDiscountPercentage(percentage)
  },[percentage]);

  const handleOK = () => {
    // Calculate and set the discount based on the selected duration and percentage
    const discount = `${discountPercentage}%`;

    if (discountType==="Weekly") {
      onSubmit("1 week",discountPercentage);
      // Weekly discount
      // Calculate and set the weekly discount
      // For example, update the state or make an API request
    } else if (discountType==="Monthly") {
      onSubmit("1 month",discountPercentage);
      
    }

    
    // onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 ${
        visible ? "" : "hidden"
      }`}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10  w-[90%] md:w-2/5 rounded shadow-md">
        <span
          className="absolute top-4 right-4 cursor-pointer font-thin text-slate-400 text-4xl"
          onClick={handleCancel}
        >
          &times;
        </span>
        <h2 className="text-5xl text-gray-700 mb-4 font-extrabold">Set {discountType} Discounts</h2>
        {/* <div className="mb-4">
          <p className="text-base ">Select duration:</p>
          <select
            value={discountDuration}
            onChange={(e) => setDiscountDuration(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 week</option>
            <option value="2">2 weeks</option>
            <option value="3">3 weeks</option>
          </select>
        </div> */}
        <div className="mb-5 w-full">
          {/* <p className="text-base ">Discount percentage:</p> */}
          <div className="w-full flex justify-center items-center mt-7 mb-2" >
            <label className=" text-sm">{discountType==="Weekly"? "Discount for a stay of 7-night or more" : "Discount for a stay of 30-night or more "}</label>
          </div>


          <div className="text-center my-4 text-3xl font-bold text-gray-700 min-h-[1lh">{discountPercentage}%</div>
          <Slider
            min={0}
            max={100}
            tooltip={{
              formatter: null,
            }}
            styles={{
              track: {
                background: 'transparent',
                height:'10px'
              },
              tracks: {
                background: `rgb(251 ,146, 60) `,
                height:'5px'
              },
              handle: {
                borderColor: "#FFA500", // Set the border color for the handle
                backgroundColor: "#FFA500",
              
              },
            }}
            
            value={parseFloat(discountPercentage)}
            onChange={(value) => setDiscountPercentage(value.toString())}
          />
        
        </div>
        <div className="my-5 py-5">
          <button
            onClick={handleOK}
            disabled={loading}
            className="bg-orange-400 w-full text-white p-2 rounded cursor-pointer relative"
          >
            Save
            {loading&& <div className=" z-20 bg-slate-100/50 text-black  flex items-center justify-center left-0 top-0 h-full  absolute w-full">
                  {/* <div className="self-start    rounded-lg max-w-[200px]"> */}
                    <div className="dot-pulse1 w-12">
                      <div className="dot-pulse1__dot"></div>
                    </div>
                  {/* </div> */} 
                </div>}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-white border-orange-400 border-[1px] w-full text-orange-400 p-2 rounded cursor-pointer my-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCustomModal;
