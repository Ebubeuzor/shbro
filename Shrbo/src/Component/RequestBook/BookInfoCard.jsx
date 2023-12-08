import React, { useState } from "react";

const BookInfoCard = () => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  return (
    <div className=" hidden mt-16 px-4 relative box-border md:block  ">
      <div className="rounded-lg border shadow-md  pt-4  ">
        <div className="sticky z-[100] ">
          <div className=" rounded-lg ">
            <div className=" relative box-border block ">
              <span className=" absolute w-[1px] h-[1px] -m-[1px] overflow-hidden   ">
                Booking information
              </span>
              <div className="image-preview relative px-[20px] ">
                <div className="flex box-border ">
                  <div
                    className=" bg-cover bg-no-repeat overflow-hidden  bg-center  rounded-tl-lg grow h-[110px] 
                                "
                  >
                    <img
                      className=" w-full h-full"
                      src="https://a0.muscache.com/im/pictures/miso/Hosting-635437605163910390/original/eaf8887f-410f-41e4-be1b-88c2a74fbfcf.jpeg?aki_policy=large"
                    />
                  </div>
                  <div
                    className=" bg-cover bg-no-repeat overflow-hidden px-1  bg-center   grow h-[110px] 
                                "
                  >
                    <img
                      className=" w-full h-full"
                      src="https://a0.muscache.com/im/pictures/miso/Hosting-635437605163910390/original/eaf8887f-410f-41e4-be1b-88c2a74fbfcf.jpeg?aki_policy=large"
                    />
                  </div>
                  <div
                    className=" bg-cover bg-no-repeat overflow-hidden  bg-center  rounded-tr-lg grow h-[110px] 
                                "
                  >
                    <img
                      className=" w-full h-full"
                      src="https://a0.muscache.com/im/pictures/miso/Hosting-635437605163910390/original/eaf8887f-410f-41e4-be1b-88c2a74fbfcf.jpeg?aki_policy=large"
                    />
                  </div>
                </div>
              </div>
              <div className=" p-[30px] relative">
                <div className="booking-details block box-border ">
                  <div className=" block relative">
                    <h3 className=" whitespace-nowrap overflow-hidden text-ellipsis text-lg font-medium ">
                      South Range Vacation Home: 6 Mi to Lake Superior!
                    </h3>
                  </div>
                </div>
                <span className="location box-border block ">
                  South Range, Wisconsin,Us
                </span>
              </div>
              <div className=" px-[30px] pb-[30px]">
                <div className="relative">
                  {/* 1 */}
                  <div className=" pb-4 border-b">
                    <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>$140.00 x 2 nights</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                          $280.00
                        </div>
                      </div>
                    </div>

                    <div className=" mb-2 box-border block">
                      <div className=" relative box-border ">
                        <div className=" overflow-hidden max-h-24 relative   ">
                          <div className=" ">
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
                              <div className=" ml-4 ">$194.00</div>
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>Service Fee</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                          $20.00
                        </div>
                      </div>
                    </div>
                    <div className=" mb-2 box-border block">
                      <div className=" flex items-end justify-between break-words    ">
                        <div className=" block box-border">
                          <span>Tax</span>
                        </div>
                        <div className=" ml-4 whitespace-nowrap block box-border   ">
                          $18.00
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Total */}
                  <div className=" border-b py-4">
                    <div className=" font-bold text-lg flex items-end justify-between break-words    ">
                      <span> Total </span>
                      <div className=" whitespace-nowrap break-normal ">
                        $566.54
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
