import React from "react";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HelpNavigation from "../Component/HelpNavigation";
import Footer from "../Component/Navigation/Footer";

const DamagesIncidentals=()=>{


        

        return(
            <div>
            <BottomNavigation/>
       <HelpNavigation/>

       <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
    
       <div className="mx-auto grid max-w-3xl lg:max-w-4xl grid-cols-1 gap-x-8 gap-y-16 ">
           
       {/* <div className=" absolute top-6 ">
       <img
             className=" w-[70px] h-[70px] max-w-none   "
             src={logo}
             alt=""
           />
       </div> */}

         <div className="">
           <div className="lg:pr-4">
             <div className="lg:max-w-2xl max-w-xl">
               <p className="text-base font-semibold leading-7 text-orange-500">Shrbo damage policy</p>
               <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Damage and Incidentals</h1>
               <p className="mt-6 text-xl leading-8 text-gray-700">
               We want your stay with us to be as pleasant as possible. However, 
               accidents and unexpected events can occur. To ensure clarity and 
               transparency, please review our policies regarding damages and incidentals:

               </p>
             </div>
           </div>
         </div>

          {/* <div className="-ml-12 -mt-12 p-12 lg:overflow-hidden">
           <img
             className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
             src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
             alt=""
           />
         </div>  */}
         
         <div className="">
           <div className="lg:pr-4">
             <div className="max-w-lg text-base leading-7 text-gray-700 lg:max-w-2xl">
               <ul role="list" className="mt-4 space-y-8 text-gray-600">
                 <li className="flex gap-x-3">
                   {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900">Security Deposit</strong>A security deposit may be 
                     required during the booking process. This amount is held to cover any potential damages or incidentals during your stay.

                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900">Damage Assessment</strong> Our team will conduct a 
                     thorough inspection before and after your stay. Any damages or missing items will be documented and assessed.


                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900">Guest Responsibility</strong> As a guest, you are responsible 
                     for the property and its contents during your stay. Please report any damages or issues promptly to our support team.



                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900">Reporting Damages</strong>If you notice any damages or 
                     incidentals upon check-in, please inform us within the first 24 hours to avoid any misunderstanding.


                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900"> Incidentals</strong>Certain incidentals, 
                     such as lost keys, may incur additional charges. Details about these charges will be provided in your booking confirmation.

                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900">Security and Safety</strong>For the safety and security of 
                     all guests, any damages resulting from non-compliance with safety rules or malicious actions will be subject to charges.

                   </span>
                 </li>
                 <li className="flex gap-x-3">
                   {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                   <span>
                     <strong className="font-semibold text-gray-900"> Resolution Process</strong>In the unfortunate event of damages, 
                     our team will work with you to assess and resolve the situation promptly. Charges will be transparently communicated and discussed.


                   </span>
                 </li>
                         
               </ul>


           
     
             








               <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"></h2>
               <p className="mt-6">
               By booking with us, you agree to adhere to these policies. We appreciate your understanding and cooperation in 
               maintaining a safe and enjoyable environment for all our guests. If you have any questions or concerns, 
               please contact our support team. Thank you for choosing Shrbo for your accommodation needs.


               </p>
             </div>
           </div>
         </div>
       </div>    
     </div>
     <Footer/>
       </div>
        );

 }

export default DamagesIncidentals;