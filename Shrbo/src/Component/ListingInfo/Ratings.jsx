import React from 'react';

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  
  return (
    <div className="flex items-center">
      <span className="text-orange-400 mr-1">&#9733;</span>
      <span className="text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
