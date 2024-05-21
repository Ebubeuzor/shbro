import React from "react";

export default function Card(props) {
  return (
    <div>
      <div className="bg-white border h-40 rounded-lg shadow-md p-4  cursor-pointer">
        <div>

          {!props.svg?<img src={props.icon} alt="" className="w-7 h-7 mb-5" />:props.svg}
        </div>
       <div>
       <div>
          <h1 className="text-lg font-semibold">{props.title}</h1>
        </div>
        <div>
          <p className="text-gray-600 text-sm">{props.text}</p>
        </div>
       </div>
      </div>
    </div>
  );
}
