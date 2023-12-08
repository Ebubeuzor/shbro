import React from "react";
import { Link } from "react-router-dom";
import { BsHouseDoor } from "react-icons/bs";
import rightArrow from "../assets/svg/line-angle-right-icon.svg";

const SupportCard = ({ title, linkTo }) => {
  return (
    <div className="p-4 my-4">
      <Link to={linkTo} className="flex justify-between cursor-pointer items-center">
        <div className="bg-orange-400 text-white rounded-full p-2">
          <BsHouseDoor />
        </div>
        <div className="text-base text-slate-500 text-center">
          {title}
        </div>
        <div className="text-2xl">
          <img src={rightArrow} className="w-4 h-4" alt="" />
        </div>
      </Link>
    </div>
  );
};

export default SupportCard;
