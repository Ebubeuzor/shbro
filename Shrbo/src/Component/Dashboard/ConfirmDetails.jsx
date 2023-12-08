import React, { useState } from "react";
import room from "../../assets/room.jpeg";

export default function ConfirmDetails() {
  const [verified, setVerified] = useState(false);
  const [listingVerified, setListingVerified] = useState(true);
  const [numberVerified, setNumberVerified] = useState(true);
  const [identityVerified, IdentitysetVerified] = useState(false);

  // chcks if everything is verified so the button can be enabled
  if (listingVerified && numberVerified && identityVerified) {
    setVerified(true);
  }

  return (
    <div className=" h-full ">
      <div className=" p-6 pt-20 flex flex-col md:flex-row  ">
        <div className=" hidden md:block w-1/2 h-full ">
          <div className=" p-44 pt-20  ">
            <div className="block rounded-lg h-full bg-white  border">
              <img className="rounded-t-lg h-full" src={room} alt="" />

              <div className="p-6 h-full">
                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 ">
                  la noir en suiteee
                </h5>
                <p className="mb-4 text-base text-neutral-600 ">
                  ikoyi 106104, Lagos, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className=" mx-auto w-full box-border  text-base ">
            <div className=" pb-8 box-border text-base ">
              <section>
                <div className=" pt-4 md:pt-16  pb-4 flex flex-row items-center box-border">
                  <div className=" text-2xl md:text-3xl font-semibold">
                    <h1 className=" "> Key details to take care of</h1>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className=" flex flex-row  md:hidden border justify-start gap-1 overflow-hidden text-ellipsis whitespace-nowrap   p-2 w-full  h-16 ">
            <div className=" w-[20%] rounded-lg   overflow-hidden   ">
              <img className=" w-full h-full" src={room}></img>
            </div>
            <div className="overflow-hidden flex flex-col justify-between text-ellipsis w-[80%]  whitespace-nowrap">
              <div className="text-sm font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                <span className=" ">
                  la noir en suiteee la noir en suiteeela noir en suiteeela noir
                  en suiteeela noir en suiteeela noir en suiteeela noir en
                  suiteee
                </span>
              </div>

              <div className=" text-xs ">
                <span className="   ">ikoyi 106104, Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          <ul className=" h-full">
            <li
              className="w-full border-b-2  border-opacity-100 py-5 
                        "
            >
              <div className=" flex flex-wrap flex-col justify-between gap-2">
                <div className=" text-sm font-medium">Make your Listing</div>
                {listingVerified ? (
                  <div className=" font-bold  ">
                    <span
                      className=" bg-green-300 text-green-800  
                                    inline-block whitespace-nowrap rounded-full 
                                    bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] 
                                    text-center align-baseline text-[0.75em] font-bold 
                                    leading-none text-success-700"
                    >
                      Success
                    </span>
                    {/* Complete */}
                  </div>
                ) : (
                  <div className=" font-bold text-xs ">
                    <span
                      className=" bg-red-200 text-red-800  inline-block whitespace-nowrap rounded-full 
                                        bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] 
                                        font-bold leading-none text-success-700"
                    >
                      Warning
                    </span>{" "}
                    Please try again. There was a problem with your account
                    info.
                  </div>
                )}
              </div>
            </li>
            <li
              className="w-full border-b-2 
                        border-opacity-100 py-5 "
            >
              <div className=" flex flex-wrap flex-col justify-between gap-2">
                <div className=" text-sm font-medium">
                  Confirm your phone number
                </div>
                <div className=" text-sm  ">
                  We'll call or text to confirm your number. Standard messaging
                  rates apply
                </div>
                {numberVerified ? (
                  <div className=" font-bold  ">
                    <span
                      className=" bg-green-300 text-green-800  
                                    inline-block whitespace-nowrap rounded-full 
                                    bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] 
                                    text-center align-baseline text-[0.75em] font-bold 
                                    leading-none text-success-700"
                    >
                      Success
                    </span>
                    {/* Complete */}
                  </div>
                ) : (
                  <div className=" font-bold text-xs ">
                    <span
                      className=" bg-red-200 text-red-800  inline-block whitespace-nowrap rounded-full 
                                        bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] 
                                        font-bold leading-none text-success-700"
                    >
                      Warning
                    </span>{" "}
                    Please try again. There was a problem with your account
                    info.
                  </div>
                )}
              </div>
            </li>
            <li
              className="w-full border-b-2 
                        border-opacity-100 py-5 "
            >
              <div className=" flex flex-wrap flex-col justify-between gap-2">
                <div className=" text-sm font-medium">Verify your identity</div>
                <div className=" text-sm  ">
                  We'll call or text to confirm your number. Standard messaging
                  rates apply
                </div>
                {identityVerified ? (
                  <div className=" font-bold  ">
                    <span
                      className=" bg-green-300 text-green-800  
                                    inline-block whitespace-nowrap rounded-full 
                                    bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] 
                                    text-center align-baseline text-[0.75em] font-bold 
                                    leading-none text-success-700"
                    >
                      Success
                    </span>
                    {/* Complete */}
                  </div>
                ) : (
                  <div className=" font-bold text-xs ">
                    <span
                      className=" bg-red-200 text-red-800  inline-block whitespace-nowrap rounded-full 
                                        bg-success-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] 
                                        font-bold leading-none text-success-700"
                    >
                      Warning
                    </span>{" "}
                    Please try again. There was a problem with your account
                    info.
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className=" fixed bottom-0 items-end  w-full bg-white   border-t p-6 ">
        <div className=" flex justify-end">
          <button
            type="button"
            disabled={!verified}
            className="block disabled:bg-gray-300  
                w-full md:w-1/5 rounded-md  px-3.5 bg-orange-400 
                py-2.5 text-center text-base font-semibold text-white 
                shadow-sm focus-visible:outline focus-visible:outline-2 
                focus-visible:outline-offset-2 "
          >
            Book now
          </button>
        </div>
      </div>
    </div>
  );
}
