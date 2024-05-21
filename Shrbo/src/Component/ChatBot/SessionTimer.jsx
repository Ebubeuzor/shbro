import React, { useState, useEffect } from 'react';

const SessionTimer = ({ expiry }) => {
  const [timeRemaining, setTimeRemaining] = useState(null); // Time remaining in milliseconds

  useEffect(() => {
    // Function to update the time remaining
    const updateRemainingTime = () => {
      if (expiry) {
        const remaining = expiry - Date.now();
        if (remaining <= 0) {
          // Session expired
          setTimeRemaining(0);
          return;
        }
        setTimeRemaining(remaining);
      }
    };

    // Update the time remaining initially
    updateRemainingTime();

    // Update the time remaining every second
    const timer = setInterval(updateRemainingTime, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, [expiry]);

  // Format milliseconds to display as minutes and seconds
  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
    return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
  };

  // You can render the time remaining wherever you need it
  return (
    <div>
      {timeRemaining !== null && (
        <p>session timer: {formatTime(timeRemaining)}</p>
      )}
    </div>
  );
};

export default SessionTimer;
