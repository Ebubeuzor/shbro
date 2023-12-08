import React from "react";
import { Link } from "react-router-dom";

const InfoCard = ({ title, description, link, image }) => {
  return (
    <div className="flex space-x-5">
      <div className=" cursor-pointer relative justify-between border rounded-lg p-4 h-64 items-center space-x-4  w-64">
        <div className="">
          <div>
            <h1 className="text-sm font-medium mb-2">{title}</h1>
          </div>
          <div>
            <span className="text-sm">{description}</span>
          </div>
          {/* <div>
            <span className="text-gray-600 text-sm">House Title</span>
          </div> */}
        
        </div>
        <div className="absolute bottom-4 left-1">
            <Link to={link}>
              <span className="text-orange-500 cursor-pointer underline-offset-4 underline">
                Get started
              </span>
            </Link>
          </div>
      </div>
    </div>
  );
};

export default InfoCard;
