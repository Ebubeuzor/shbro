import React, { useState } from "react";
import { useDateContext } from "../../ContextProvider/BookingInfo";
const BookInfoCard = () => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const {
    checkInDate,
    checkOutDate,
    adults,
    setAdults,
    pets,
    priceDetails,
    setPriceDetails,
    hostFees, 
    serviceFee, 
    tax, 
    totalPrice, 
    totalCost,
    housePrice,
    nights,
    cancellationPolicy,
    title,
    address,
    photo,
    securityDeposit,
    appliedDiscounts
  } = useDateContext();

  return (
    <div className=" hidden mt-16 px-4 relative box-border md:block  ">
      <div className="rounded-lg border shadow-md  pt-4  ">
        <div className="sticky z-[100] ">
          <div className=" rounded-lg ">
            <div className=" relative box-border block ">
              <span className=" absolute w-[1px] h-[1px] -m-[1px] overflow-hidden   ">
                Booking information
              </span>
             <div className="flex gap-2 px-4">
             {photo.slice(0, 3).map((item, index) => (
              <div className="image-preview relative" key={index}>
                <div className="flex box-border">
                  <div
                    className=" bg-cover bg-no-repeat overflow-hidden  bg-center rounded-lg  md:rounded-tl-lg md:grow h-[80px] 
                          "
                  >
                    <img
                      className=" w-full h-full"
                      src={item.images}
                      alt={`Image ${index}`}
                    />
                  </div>
                </div>
              </div>
            ))}
             </div>
              <div className=" p-[30px] relative">
                <div className="booking-details block box-border ">
                  <div className=" block relative">
                    <h3 className=" whitespace-nowrap overflow-hidden text-ellipsis text-lg font-medium ">
                        {title}
                        </h3>
                  </div>
                </div>
                <span className="location box-border block ">
                 {address}
                </span>
              </div>
              <div className=" px-[30px] pb-[30px]">
                <div className="relative">
                  {/* 1 */}
                  <div className=" pb-4 border-b">
                    <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>   ₦ {housePrice} x {nights} nights</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                        ₦ {housePrice * nights}
                        </div>
                      </div>
                    </div>

                    <div className=" mb-2 box-border block">
                      <div className=" relative box-border ">
                        <div className=" overflow-hidden max-h-24 relative   ">
                          {/* <div className=" ">
                            <div className=" mb-2 flex justify-between items-end break-words  ">
                              <button
                                className=" overflow-visible m-0 bg-transparent cursor-pointer outline-none   "
                                type="button"
                                onClick={toggleShow}
                              >
                                <span className=" capitalize">Host Fees</span>
                                <span className=" pl-2 box-border ">
                                  <span
                                    className={`w-3 h-3 inline-block stroke-1 stroke-current transition ${
                                      show && "rotate-180 transition-transform"
                                    }`}
                                  >
                                    <svg
                                      focusable="false"
                                      data-id="SVG_CHEVRON_DOWN__12"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11 4L6 9 1 4"
                                      ></path>
                                    </svg>
                                  </span>
                                </span>
                              </button>
                              <div className=" ml-4 ">₦ {Number(hostFees).toLocaleString()}</div>
                            </div>

                            <div
                              className={`px-4 pb-5  rounded bg-slate-200   ${
                                show ? " block  " : " hidden  "
                              } `}
                            >
                              <div className=" flex items-end justify-between break-words mb-2    ">
                                <div>Damage Waiver</div>
                                <div className=" break-normal text-slate-700">
                                  $48
                                </div>
                              </div>
                              <div className=" flex items-end justify-between break-words     ">
                                <div>Cleaning Fee</div>
                                <div className=" break-normal text-slate-700 ">
                                  $148
                                </div>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>
                    {/* <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>Service Fee</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                        ₦  {serviceFee}
                        </div>
                      </div>
                    </div> */}
                    <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>Secuirty Depsoit</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                        ₦  {securityDeposit}
                        </div>
                      </div>
                      
                    </div>
                    <div className=" mb-2 box-border block italic text-sm text-gray-400">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>Applied Discount</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                          {appliedDiscounts}
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div className=" border-b py-4">
                    <div className=" font-bold text-lg flex items-end justify-between break-words    ">
                      <span> Total </span>
                      <div className=" whitespace-nowrap break-normal ">
                      ₦ {totalCost}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfoCard;
