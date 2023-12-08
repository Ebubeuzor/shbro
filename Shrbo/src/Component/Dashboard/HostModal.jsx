import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsHouseDoor, BsArrowBarRight } from "react-icons/bs"; // Import the icons
import rightArrow from "../../assets/svg/line-angle-right-icon.svg";
import defaultProfile from "../../assets/svg/avatar-icon.svg";
import MenuCard from "../MenuCard";
import HostingCard from "../HostingCard";
import SupportCard from "../SupportCard";

export default function HostModal({ isOpen, onClose }) {
  const [profilePicture, setProfilePicture] = useState(defaultProfile);

  return (
    isOpen && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center md:z-[99] text-black">
        <div className="bg-white w-full   p-4 z-[999] h-full  overflow-auto">
          <div className="text-black md:w-2/4  p-3 pb-32">
            {/* <h1 className="text-2xl ">Menu</h1> */}

            <div>
              <section className="bg-orange-400 p-2 rounded-lg my-10">
                <div>
                  <Link
                    to="/UsersShow"
                    className="flex flex-wrap space-y-2  items-center space-x-4"
                  >
                    <div>
                      <label htmlFor="profilePictureInput" className="w-fit">
                        <div
                          className="cursor-pointer bg-slate-200"
                          style={{
                            backgroundImage: `url(${profilePicture})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                        >
                          {!profilePicture && (
                            <img
                              src={defaultProfile}
                              alt="Default Profile"
                              width="100"
                              height="100"
                            />
                          )}
                        </div>
                      </label>
                    </div>
                    <div>
                      <h1 className="text-white text-2xl">Welcome Endo</h1>
                    </div>
                  </Link>
                </div>
              </section>
              <section>
                <ul>
                  <MenuCard
                    linkTo="/HostHomes"
                    icon={<BsHouseDoor />}
                    title="Create a new listing"
                  />

                  <MenuCard
                    linkTo="/EditHomepage"
                    icon={<BsHouseDoor />}
                    title="Dashboard"
                  />

                  <MenuCard
                    linkTo="/Listings"
                    icon={<BsHouseDoor />}
                    title="Listings"
                  />

                  <MenuCard
                    linkTo="/Profile"
                    icon={<BsHouseDoor />}
                    title="Personal Info"
                  />

                  <MenuCard
                    linkTo="/TransactionHistory"
                    icon={<BsHouseDoor />}
                    title="Transaction History"
                  />

                  <MenuCard
                    linkTo="/Payments"
                    icon={<BsHouseDoor />}
                    title="Payments"
                  />

                  <MenuCard
                    linkTo="/Reservations"
                    icon={<BsHouseDoor />}
                    title="Reservations"
                  />

                  <MenuCard
                    linkTo="/Security"
                    icon={<BsHouseDoor />}
                    title="Security"
                  />
                </ul>
              </section>

              <section>
                <h1 className="text-2xl my-10">Hosting</h1>
                <ul>
                  <HostingCard linkTo="/hosting" title="Manage your listing" />
                  
                </ul>
              </section>

              <section>
                <h1 className="text-2xl my-10">Support</h1>
                <ul>
                  <SupportCard linkTo="/aboutus" title="About Shbro" />

                  <SupportCard linkTo="/SupportAndHelp" title="Customer Support and Information" />

                  <SupportCard linkTo="/ContactSupport" title="Help Center" />

                  <SupportCard linkTo="/CancellationPolicy" title="Cancellation options" />
                  <SupportCard linkTo="/FAQAccordion" title="Frequently Asked Questions (FAQ)" />
                  <SupportCard linkTo="/hosthomes" title="Shrbo Your Space" />


                </ul>
              </section>
              <div className="text-center">
                <button className="border w-full p-2 my-2">Log out</button>
              </div>
            </div>
          </div>
          <button className="text-blue-500" onClick={onClose}>
            Close Modal
          </button>
        </div>
      </div>
    )
  );
}
