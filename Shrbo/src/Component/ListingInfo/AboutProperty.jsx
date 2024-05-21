import React, { useState } from "react";
import Popup from "../../hoc/Popup";

const AboutProperty = ({ description,address }) => {


  return (
    <div className=" py-3 mb-6  ">
      <div className=" mb-4 md:mb-6 box-border block ">
        <h2 className=" text-2xl font-semibold">About Property</h2>
      </div>

      <div>
        <div className=" text-xl  break-words w-[100%  mb-2 font-semibold">
          <p>{address}</p>
        </div>
        <div className="break-words w-[100%]">
          <span>
          { description }
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutProperty;
