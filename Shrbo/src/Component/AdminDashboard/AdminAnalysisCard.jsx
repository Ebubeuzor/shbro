import React from "react";

const AdminAnalysisCard = ({ title, value, currency }) => {
  return (
    <div className="bg-white rounded p-4 shadow flex flex-col justify-between rounded-3xl h-32 mr-4">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-xl font-bold text-orange-400">
        {currency && currency === "₦"
          ? `${currency}${value.toLocaleString()}`
          : value.toLocaleString()}
      </p>
    </div>
  );
};

export default AdminAnalysisCard;
