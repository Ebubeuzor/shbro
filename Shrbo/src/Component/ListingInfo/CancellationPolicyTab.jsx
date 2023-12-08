import React ,{ useState } from "react";
import { Link } from "react-router-dom";


//Ebube check the Cancellation Policy pages to get the write up for each type of cancellation chosen by the Host
const cancellationPolicy=[
  {id: 1,name:"Flexible Cancellation Policy (can cancel anytime and be refunded their full amount)",text:"We offer a flexible cancellation policy that allows you to cancel your reservation free of charge within 48 hours of booking, provided that the check-in date is at least 10 days away. We believe in giving our guests the freedom to plan their trips without financial stress in the early stages of booking."},
  {id: 2,name:" Moderate Cancellation Policy (if a guest cancels within 10 days of the booking, they will be refunded only 50% of their money)",text:" If you need to cancel your reservation within 7 days of the check-in date, you are eligible for a refund of 50% of the total booking amount." },
  {id: 3,name:" Strict Cancellation Policy (if a guest cancels within 5 days, they will refunded only 50% of their booking amount)",text:"Cancellations made within 5 days of the check-in date are non-refundable"},
 

  
]





const CancellationPolicyTab=()=>{

    

        return(
              <div className=" py-1 mb-1 max-w-lg    " >
               
                <div className=" px-2 space-y-3 ">
                  <p className="cancellation-type font-medium text-lg  " >Flexible Cancellation</p>
                  <div className="   font-medium " >Free cancellation for 48 hours. </div>
                  <div className="  " >Provided that the check-in date is at least 10 days away. We believe in giving our guests the freedom to plan their trips without financial stress in the early stages of booking.</div>
                  <div className="  underline  "><Link to={"/CancellationPolicy"} className=" hover:font-medium text-xs  transition-all font-normal hover:text-black">learn more about cancellation policies</Link></div>
                </div>
              </div>
        );

 }

export default CancellationPolicyTab;