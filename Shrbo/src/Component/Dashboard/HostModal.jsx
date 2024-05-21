import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsHouseDoor, BsArrowBarRight } from "react-icons/bs"; // Import the icons
import rightArrow from "../../assets/svg/line-angle-right-icon.svg";
import defaultProfile from "../../assets/svg/avatar-icon.svg";
import MenuCard from "../MenuCard";
import HostingCard from "../HostingCard";
import SupportCard from "../SupportCard";
import axios from "../../Axios"

export default function HostModal({ isOpen, onClose, userData, hostStatus, adminStatus, coHostStatus }) {
  const [profilePicture, setProfilePicture] = useState(defaultProfile);


  const logOut = () => {

    try {
      axios.get("/logout").then(response => {

        console.log("logout", response);
        localStorage.removeItem("Shbro");
        localStorage.removeItem("A_Status");
        localStorage.removeItem("H_Status");
        localStorage.removeItem("CH_Status");
        localStorage.removeItem("supportAgent")
        localStorage.removeItem("supportUser")
        // setIsLoggedIn(false);;
        window.location.replace('/');
      });
    } catch (error) {

      console.log("Error", error);
    }


  }


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
                            backgroundImage: `url(${`https://shortletbooking.com/${userData.profilePicture}` || profilePicture})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100px",
                            height: "100px",
                            borderRadius: "50%",
                          }}
                        >

                        </div>
                      </label>
                    </div>
                    <div>
                      <h1 className="text-white text-2xl">Welcome {userData.name.split(' ')[0] || ""}</h1>
                    </div>
                  </Link>
                </div>
              </section>
              <section>
                <ul>
                  {(hostStatus === 1 || coHostStatus === 1) && <MenuCard
                    linkTo="/HostHomes"
                    icon={<BsHouseDoor />}
                    title="Create a new listing"
                  />}

                  {adminStatus === "admin" && <MenuCard
                    linkTo="/EditHomepage"
                    icon={<BsHouseDoor />}
                    title="Dashboard"
                  />}

                  {(hostStatus === 1 || coHostStatus === 1) && <MenuCard
                    linkTo="/Listings"
                    icon={<BsHouseDoor />}
                    title="Listings"
                  />}

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

                  {coHostStatus != 1 && <MenuCard
                    linkTo="/Payments"
                    icon={<BsHouseDoor />}
                    title="Payments"
                  />}

                  {(hostStatus === 1 || coHostStatus === 1) && <MenuCard
                    linkTo="/Reservations"
                    icon={<BsHouseDoor />}
                    title="Reservations"
                  />}

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
                  {(hostStatus === 1 || coHostStatus === 1) && <HostingCard linkTo="/hosting" title="Manage your listing" />
                  }
                  {!(hostStatus === 1 || coHostStatus === 1) && <SupportCard linkTo="/hosthomes" title="Shrbo Your Space" />}

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



                </ul>
              </section>
              <div className="text-center">
                <button className="border w-full p-2 my-2" onClick={logOut}>Log out</button>
              </div>
            </div>
          </div>
          {/* <button className="text-blue-500" onClick={onClose}>
            Close Modal
          </button> */}
        </div>
      </div>
    )
  );
}
