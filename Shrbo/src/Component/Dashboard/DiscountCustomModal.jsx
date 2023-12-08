import React, { useState } from "react";

const DiscountCustomModal = ({ visible, onClose, onSubmit }) => {
  const [discountDuration, setDiscountDuration] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");

  const handleCancel = () => {
    onClose();
  };

  const handleOK = () => {
    // Calculate and set the discount based on the selected duration and percentage
    const discount = `${discountPercentage}%`;

    if (discountDuration === "7") {
      // Weekly discount
      // Calculate and set the weekly discount
      // For example, update the state or make an API request
    } else if (discountDuration === "28") {
      // Monthly discount
      // Calculate and set the monthly discount
      // For example, update the state or make an API request
    }

    onSubmit(discount);
    onClose();
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
        <h2 className="text-5xl text-gray-700 mb-4 font-extrabold">Set Discounts</h2>
        <div className="mb-4">
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
        </div>
        <div className="mb-4">
          <p className="text-base">Discount percentage:</p>
          <input
            type="number"
            placeholder="Enter discount percentage"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="my-5 py-5">
          <button
            onClick={handleOK}
            className="bg-orange-400 w-full text-white p-2 rounded cursor-pointer"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
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
