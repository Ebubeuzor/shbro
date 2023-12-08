import React from "react";
import logo from "../assets/logo.png"
import Footer from "../Component/Navigation/Footer";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HelpNavigation from "../Component/HelpNavigation";
export default function TermsofService() {
    return (

        <div>
             <BottomNavigation/>
        <HelpNavigation/>

        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
     
        <div className="mx-auto grid lg:max-w-4xl max-w-3xl grid-cols-1 gap-x-8 gap-y-16 ">
            
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
                <p className="text-base font-semibold leading-7 text-orange-500">Shrbo terms & conditions</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                 We encourage you to read and understand these terms, as they are a fundamental part of the Shrbo experience.
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

                <h2 className="  text-2xl font-semibold tracking-tight text-gray-900">   Affiliated Companies</h2>
                <p className="mt-6">
                Shortlet Booking (Shrbo) is a subsidiary of shelters - 
                gate investment and properties. We have no affiliations with any other companies. 
                We are dedicated to providing you with a stand-alone platform for booking accommodations with transparency, reliability, and trustworthiness. 
                Our commitment is to ensure that your experience with us is grounded in the highest standards of safety, security, and customer service. 

                </p>

                <h2 className=" mt-8 text-2xl font-semibold tracking-tight text-gray-900"> Cancellation Policy</h2>
                <p className="mt-6">
                Shrbo strictly implements Hosting Standards that ensure if, by any chance, 
                the guest did not stay in the booked apartment due to issues or complications 
                from the host, the guest is entitled to a full refund. The reservation must be 
                cancelled on the host’s behalf, and the following penalties will apply:

                </p>
                <ul role="list" className="mt-6 space-y-2 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                      -
                    <span>
                    A cancellation fee of  <strong className="font-semibold text-orange-400"> N20,000</strong> will be deducted from the host's account.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    -
                    <span>
                       The calendar for the specific dates will be marked as unavailable or blocked until the cancellation fee is cleared.
                    </span>
                  </li>
                </ul>

                <h2 className="mt-8  text-2xl font-semibold tracking-tight text-gray-900">   Guest Cancellation</h2>
                <p className="mt-6">
                Guests have the flexibility to cancel their reservations free of charge within 48 hours of booking, 
                provided that the check-in date is at least 10 days away. We believe in providing our users with the 
                freedom to make informed decisions without incurring undue financial burden

                </p>


                
                <h2 className=" mt-8 text-2xl font-semibold tracking-tight text-gray-900">Refunds</h2>
                <p className="mt-6">
                    In the event of a cancellation, refunds are processed as follows:
                </p>
                <ul role="list" className="mt-6 space-y-2 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                      -
                    <span>
                    Cancellations made within 7 days of the check-in date will result in a refund of 50% of the total booking amount

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    -
                    <span>
                        Cancellations made within 5 days of the check-in date are non-refundable. We recognize that 
                        this allows hosts to better manage their availability and plan for your stay.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    -
                    <span>
                    Please note that early departures or no-shows are not eligible for refunds, and the total booking amount will be charged.
                    </span>
                  </li>


                </ul>

                <h2 className="mt-8  text-2xl font-semibold tracking-tight text-gray-900">   Refund Processing</h2>
                <p className="mt-6">
                    Refunds, when applicable, will be processed within 7-10 business days from the date of cancellation. 
                    These refunds will be issued using the same payment method that was used for the original booking. 
                    We believe in transparency and efficiency when it comes to your finances.

                </p>

                <h2 className=" mt-8 text-2xl font-semibold tracking-tight text-gray-900"> Reservation Modifications</h2>
                <p className="mt-6">
                At Shrbo, we understand that plans can change. Therefore, guests are allowed to request modifications to 
                their reservation dates free of charge. These modifications are subject to availability and potential rate changes, 
                but we aim to make this process as convenient as possible. However, we kindly request that you take note of the following:

                </p>
                <ul role="list" className="mt-6 space-y-2 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                      -
                    <span>
                    Modifications requested within 5-7 days of the check-in date will be treated as cancellations and will follow the cancellation policy outlined above.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    -
                    <span>
                    Confirmation of Check-in and Minimum Stay Requirement: The guest must confirm check-in and stay at the apartment for at least one night before the host receives payment.
                    </span>
                  </li>
                </ul>



                 <h2 className=" mt-8 text-2xl font-semibold tracking-tight text-gray-900"> Termination or Suspension</h2>
                <p className="mt-6">
                At Shrbo, we are committed to fostering a safe and respectful community. We reserve the right to terminate 
                or suspend a user's account under specific circumstances, as outlined below. These measures are implemented 
                to maintain a positive experience for all users, ensuring the highest level of trust and safety.

                </p>

                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Violation of Terms of Service</strong>This includes engaging in 
                      illegal activities, causing property damage, harassment, or any criminal behavior. 
                      We hold a strong commitment to legal compliance and a zero-tolerance policy toward illegal activities.
                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900"> Non-Payment</strong> Users who repeatedly 
                      fail to make the required payments for their bookings, engage in cancellations without valid 
                      reasons, or participate in payment fraud may find their accounts suspended or terminated. 
                      We aim to maintain a fair platform for both guests and hosts.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Misuse of the Platform</strong> Our platform 
                      is built on trust and respect. Users found misusing the platform, such as spamming other users, 
                      posting inappropriate content, or engaging in harmful behavior within the community, may face 
                      suspension or termination. We believe in a community that is built on collaboration and mutual respect.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Health and Safety Concernsm</strong> In cases where a user's 
                      behavior poses a threat to the health and safety of other users or property, we will take appropriate 
                      action to protect our community. We prioritize the well-being of all users.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Multiple Complaints</strong> To ensure a positive 
                      experience for hosts and guests alike, we may suspend or terminate the account of a user who receives 
                      multiple complaints from hosts or other guests regarding their behavior, cleanliness, or adherence to 
                      house rules. This is to maintain a high standard of service for our community.


                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Failure to Verify Identity</strong> Verification is a critical 
                      component of maintaining the trust and security of our platform. If a user fails to complete the necessary identity 
                      verification processes required by the platform, their account may be temporarily suspended until proper verification 
                      is provided. This step is taken to safeguard the community and ensure that all users are who they claim to be.


                    </span>
                  </li>
                  


                </ul>


                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"></h2>
                <p className="mt-6">
                We hope that these terms of service offer a comprehensive overview of our commitment to providing 
                a safe, reliable, and transparent platform for all our users. We encourage you to read and understand 
                these terms, as they are a fundamental part of the Shrbo experience. If you have any questions or require 
                further clarification on any aspect of our terms of service, please don't hesitate to contact us. 
                Your trust and satisfaction are of paramount importance to us.

                </p>
              </div>
            </div>
          </div>
        </div>    
      </div>
      <Footer/>
        </div>
    )
  }
  