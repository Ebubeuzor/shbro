import React from "react";

const AdminAnalysisCard = ({ title, value, currency }) => {
  return (
    <div className="bg-white rounded p-4 shadow flex flex-col mr-4">
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-xl font-bold text-orange-400">
        {currency && currency === "₦" ? `${currency}${value}` : value}
      </p>
    </div>
  );
};

export default AdminAnalysisCard;
