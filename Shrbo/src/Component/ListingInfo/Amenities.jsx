import React, { useState } from "react";
import Popup from "../../hoc/Popup";
import PopupFull from "../../hoc/PopupFull";
import {
  FaHome,
  FaHotel,
  FaBed,
  FaBuilding,
  FaTrash,
  FaVideo,
  FaPalette,
  FaCity,
  FaDog,
  FaTree,
  FaUserFriends,
  FaShopify,
  FaWater,
  FaLandmark,
  FaChartBar,
  FaMountain,
  FaWifi,
  FaTv,
  FaUtensils,
  FaHandsWash,
  FaSnowflake,
  FaParking,
  FaSwimmingPool,
  FaHotTub,
  FaFire,
  FaBell,
  FaFirstAid,
  FaFireExtinguisher,
  FaSmoking,
  FaTemperatureHigh,
  FaSuitcase,
  FaShower,
  FaDumbbell,
  FaWheelchair,
  FaPaw,
  FaCoffee,
  FaBook,
  FaChessBoard,
  FaLaptop,
  FaAirFreshener,
  FaPaperclip,
  FaSnowboarding,
  FaArrowUp,
  FaObjectGroup,
  FaWaveSquare,
  FaHotdog,
  FaBox,
  FaUser,
  FaCamera,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaUtensilSpoon,
  FaSmog,
} from "react-icons/fa";
const Amenities = ({ amenities }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // const [open, setOpen] = useState(false);
  const [drawer,setDrawer]=useState(false);

  const openPopup = () => {
    setDrawer(false);
    setIsPopupOpen(true);
    
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    // setOpen(false);
  };

  const showDrawer = () => {
    setDrawer(true)
    setIsPopupOpen(true);
  };

  // const onClose = () => {
  //   setOpen(false);
  // };

  const amenityIcons = {
    Wifi: <FaWifi />,
    TV: <FaTv />,
    Kitchen: <FaUtensilSpoon />,
    Washer: <FaHandsWash />,
    "Air conditioning": <FaSnowflake />,
    // Add icons for the remaining amenities
    "Hot tub": <FaHotTub />,
    "fire extinguisher": <FaFireExtinguisher />,
    "first aid kit": <FaFirstAid />,
    Pool: <FaSwimmingPool />,
    "Free parking on premises": <FaParking />,
    Essentials: <FaSuitcase />,
    Gym: <FaDumbbell />,
    "Wheelchair accessible": <FaWheelchair />,
    "Board games": <FaChessBoard />,
    Books: <FaBook />,
    Refrigerator: <FaBox />,
    Toaster: <FaHotdog />,
    Microwave: <FaWaveSquare />,
    Oven: <FaObjectGroup />,
    "Smoking allowed": <FaSmoking />,
    Balcony: <FaBuilding />,
    Elevator: <FaArrowUp />,
    "Coffee maker": <FaCoffee />,
    "Tea kettle": <FaUtensils />,
    Dishwasher: <FaHandsWash />,
    "Pets allowed": <FaPaw />,
    Hangers: <FaPaperclip />,
    "Laptop-friendly workspace": <FaLaptop />,
    Iron: <FaSnowboarding />,
    "Fire pit": <FaFire />,
    "Indoor fireplace": <FaFire />,
    "Smoke alarm": <FaSmog />,
    Heating: <FaTemperatureHigh />,
    Shampoo: <FaShower />,
    "Hair dryer": <FaShower />,
    // "Smoke alarm": <FaBell />,
  };

  // Display only the first 10 amenities
  const displayAmenities = amenities.slice(0, 10);

  const amenityElements = displayAmenities.map((amenity, index) => (
    <div key={amenity.id} className="relative px-[6px] w-full md:w-1/2 md:px-2">
    <div className="flex items-center md:max-w-[83.33%] pb-4 justify-end flex-row-reverse">
  <div>{amenity.offer}</div>
  <div className="mr-4 min-w-[24px]">
  {amenityIcons[amenity.offer] || <FaTv />}
  </div>
</div>

    </div>
  ));

  const matchingIcons = displayAmenities.map(
    (amenity) => amenityIcons[amenity.id]
  );

  return (
    <div className="box-border block text-[#222222] font-normal text-base w-full">
      <div className="py-12">
        <section>
          <div className="pb-6">
            <div className="font-semibold text-xl">
              <h2 className="text-2xl font-semibold">Amenities</h2>
            </div>
          </div>
          <div className="flex items-stretch justify-start flex-wrap w-full h-[238px] md:h-full overflow-hidden">
            {amenityElements}
          </div>
          <div className="mt-4 md:mt-6">
            {amenities.length > 10 && (
              <>
                <button
                  type="button"
                  className="rounded-lg hidden md:inline-block relative border transition-shadow py-[13px] px-[23px] text-base font-semibold"
                  onClick={openPopup}
                >
                  Show more {amenities.length} amenities
                </button>

                {/* This button shows the drawer instead of Popup and it is only visible on mobile view */}
                <button
                  type="button"
                  className="rounded-lg inline-block relative border transition-shadow py-[13px] px-[23px] md:hidden text-base font-semibold"
                  onClick={showDrawer}
                >
                  Show more {amenities.length} amenities
                </button>
              </>
            )}

            <Popup
              isModalVisible={isPopupOpen}
              handleCancel={closePopup}
              title={"Amenities"}
              drawer={drawer}
            >
              <div className={`${drawer?"h-full overflow-scroll":"h-96 overflow-scroll"} `}>
              {displayAmenities.length > 0 ? (
                <ul>
                  {amenities.map((amenity) => (
                    <li
                      key={amenity.id}
                      className="flex items-center space-x-3 py-2"
                    >
                      <span className="text-lg">
                        {amenityIcons[amenity.offer] || <FaTv />}
                      </span>
                      <span className="text-base">{amenity.offer}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No amenities available.</p>
              )}

              </div>
            </Popup>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Amenities;
