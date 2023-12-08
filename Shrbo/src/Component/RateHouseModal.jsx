import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify"; // Import toast

export default function RateHouseModal({ isOpen, onClose, houseDetails }) {
  // Check if houseDetails is null or undefined
  if (!houseDetails) {
    return null; // Return null if houseDetails is not available yet
  }

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(""); // Add state for comment

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    // Save the rating and comment and perform any necessary actions
    onClose();

    // Show a toast notification
    toast.success("Thank you for commenting!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  return (
    <div
      className={`fixed z-[9999] inset-0 flex items-center justify-center ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      } transition-opacity duration-300`}
    >
      <div className="bg-white md:w-[500px] p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-2xl font-semibold mb-4">Rate Your Stay?</h2>
        <p className="mb-4">
          You recently stayed at <span className="font-bold">{houseDetails.name}</span> in  <span className="font-bold">{houseDetails.location}</span>. How would you rate your experience?
        </p>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <FaStar
              key={value}
              className={`cursor-pointer text-xl ${
                rating >= value ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => handleRatingClick(value)}
            />
          ))}
        </div>
        <form action="">
          <textarea
            placeholder="Comment..."
            className="w-full bg-slate-200 rounded-2xl p-3"
            value={comment}
            onChange={handleCommentChange}
          ></textarea>
        </form>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-medium mr-4"
          >
            Close
          </button>
          <button
            className="bg-orange-400 text-white py-2 px-4 rounded-full hover:bg-orange-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black opacity-50"
      ></div>
    </div>
  );
}
