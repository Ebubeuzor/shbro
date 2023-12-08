import React ,{ useState } from "react";
import { Tabs } from 'antd';
import { Link } from "react-router-dom";





const DamagesTab=()=>{


        

        return(
              <div className=" py-0 px-2 mb-3 max-w-xl  " >
                <div className="mb-"></div>
                <h1 className="mt-0 text-lg font-medium tracking-tight text-gray-900 ">You need to know</h1>
                {/* <p className="mt-1">
                We want your stay with us to be as pleasant as possible. However, accidents and unexpected events can occur. To ensure clarity and transparency, please review our policies regarding damages and incidentals:
                </p>
                   */}
                <ul role="list" className="mt-2 space-y-2 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Security Deposit </strong>A security deposit 
                      may be required during the booking process. This amount is held to cover any potential damages or incidentals during your stay.


                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Damage Assessments</strong>Our team will conduct a thorough 
                      inspection before and after your stay. Any damages or missing items will be documented and assessed.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Guest Responsibility</strong>As a guest, you are responsible 
                      for the property and its contents during your stay. Please report any damages or issues promptly to our support team.
                      If you notice any damages or incidentals upon check-in, please inform us within the first 24 hours to avoid any misunderstanding.



                    </span>
                  </li>
                
                 
                          
                </ul>
                <div className=" mt-2 cursor-pointer underline  "><Link to={"/DamagesAndIncidentals"} className=" hover:font-medium text-xs  transition-all font-normal hover:text-black">learn more damage and incidentals </Link></div>

              </div>
        );

 }

export default DamagesTab;