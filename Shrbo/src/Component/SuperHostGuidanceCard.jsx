import React from "react";

function SuperHostGuidanceCard(props) {
  const { title, description, buttonText } = props;

  return (
    <div className=" h-fit border p-4 rounded-lg mx-2 cursor-pointer shadow-lg bg-white my-2">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-gray-600">{description}</p>
        <p className="text-blue-500 cursor-pointer underline">
          {buttonText}
        </p>
      </div>
      <div>
      
      </div>
    </div>
  );
}

export default SuperHostGuidanceCard;
