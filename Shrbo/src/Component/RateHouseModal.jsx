import React, { useState } from "react";
import { FaStar } from "react-icons/fa";


export default function RateHouseModal({ isOpen, onClose, houseDetails, review, type }) {
  // Check if houseDetails is null or undefined
  if (!houseDetails || houseDetails.length === 0) {
    return null; // Return null if houseDetails is not available yet
  }

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(""); // Add state for comment
  const [error, setError] = useState("");


  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setError("Select a Rating star");
      return;
    } else if (comment.trim() === "") {
      setError("Add a comment to your Review");
      return;
    }
    // Save the rating and comment and perform any necessary actions

    review({ rating, comment });
    onClose();


  };

  return (
    <div
      className={`fixed z-[9999] inset-0 flex items-center justify-center ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
    >
      <div className="bg-white md:w-[500px] p-6 rounded-lg shadow-lg z-50">
        {type == true ?
          <>
            <h2 className="text-2xl font-semibold mb-4">Rate Your Stay?</h2>
            <p className="mb-4">
              You recently stayed at <span className="font-bold">{houseDetails[0].title}</span> in  <span className="font-bold">{houseDetails[0].location}</span>. How would you rate your experience?
            </p>

          </>
          :
          <>
            <h2 className="text-2xl font-semibold mb-4">Rate This Guest?</h2>
            <p className="mb-4">
                <span className="font-bold">{houseDetails[0].guestName}</span> recently stayed at <span className="font-bold">{houseDetails[0].listing}</span>. How would you rate this guest?
            </p>

          </>

        }
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((value) => (
            <FaStar
              key={value}
              className={`cursor-pointer text-xl ${rating >= value ? "text-yellow-500" : "text-gray-400"
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
          <div className=" text-red-600 ml-1 ">{error}</div>
        </form>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            type="button"
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
