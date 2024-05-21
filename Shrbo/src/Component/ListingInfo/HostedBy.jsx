import React from "react";
import {
  FaHome,
  FaHotel,
  FaBed,
  FaBuilding,
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
  FaRuler,
  FaInfoCircle,
} from "react-icons/fa";

const HostedBy = (props) => {
  const {
    property_type,
    bathrooms,
    beds,
    bedroom,
    cancelPolicy,
    guest_choice,
    guest,
    hostHomeDescriptions, // Add this line to receive the new prop
  } = props;
  const ListingCategory = "Room in a townhouse";
  const Host = "Christi-Anna";

  const room_info = [
    { id: 1, text: property_type },
    { id: 2, text: guest_choice },
    // { id: 4,  text:"Keynotes & Trainings"},
    // { id: 5,  text:"Test, Quizzes & Exams"},

    // it should have a "url" object aswell for Svg images
  ];

  const propertyTypeIcons = {
    home: <FaHome />,
    hotel: <FaHotel />,
    bed: <FaBed />,
    building: <FaBuilding />,
    art: <FaPalette />,
    house: <FaHome />,
    city: <FaCity />,
    dog: <FaDog />,
    tree: <FaTree />,
    userFriends: <FaUserFriends />,
    shopify: <FaShopify />,
    water: <FaWater />,
    landmark: <FaLandmark />,
    chartBar: <FaChartBar />,
    mountain: <FaMountain />,
    guestHouse: <FaBed />,
    apartment: <FaCity />,
    office: <FaCity />,
    cityApartments: <FaCity />,
    petFriendlyRetreats: <FaDog />,
    treehouseRetreats: <FaTree />,
    familyFriendlyHomes: <FaHome />,
    boutiqueVillas: <FaShopify />,
    lakesideSerenity: <FaWater />,
    desertOases: <FaLandmark />,
    urbanGetaways: <FaCity />,
    countryside: <FaHome />,
    luxuryEstate: <FaCity />,
    trending: <FaChartBar />,
    beachfrontBliss: <FaLandmark />,
    mountainRetreats: <FaMountain />,
  };

  const propertyTypeIcon = propertyTypeIcons[property_type];

  const descriptionItems = hostHomeDescriptions.map((description) => (
    <li key={description.id}>{description.description}</li>
  )); // Rooms Like 2 bedroom, living room, 3 bath room , 2 toilet
  const Rooms = room_info.map((amenity) => (
    <li
      className="flex flex-nowrap content-normal flex-col p-4 gap-4 justify-between   
              lg:justify-normal  lg:items-center  lg:flex-row   min-h-[56px]
              rounded-xl border lg:py-4 lg:px-6  "
      key={amenity.id}
    >
      <div className="   ">{propertyTypeIcons[amenity.text]}</div>
      <div className="  overflow-hidden text-ellipsis box-border block  ">
        <div className="text-xs lg:text-sm overflow-clip font-semibold">
          {amenity.text === "property_type" ? `Property Type: ${property_type}` : ""}
          {amenity.text === "guest_choice" ? `Guest Choice: ${guest_choice}` : ""}
         <span className="uppercase"> {amenity.text}</span>
        </div>
      </div>
    </li>
  ));
  

  // Perks Like Khalifa view , Cinema etc

  const perks_info = [
    {
      id: 1,
      text: "Home Descriptions",
      description: descriptionItems,
    },
    {
      id: 2,
      text: guest_choice,
      description: (() => {
        switch (guest_choice) {
          case "house":
            return "Enjoy the entire property to yourself, perfect for those who prefer privacy and space.";
            case "hotel":
              return "Cozy up in your own private room while sharing common spaces with other guests.";
              case "A shared room":
                return "Share a room with other travelers and enjoy a communal living experience.";
                case "guestHouse":
                  return "Rent an entire guest house with all the amenities for an exclusive stay.";
                  default:
            return "Cancellation policy information not available.";
        }
      })(),
    },
    {
      id: 3,
      text: "Cancellation Policy",
      description: (() => {
        switch (cancelPolicy) {
          case "Strict Cancellation Policy":
            return "Cancellation after booking, guest will be refunded 50% of their total booking amount.";
          case "Moderate Cancellation Policy":
            return "Cancellation after booking, guest will be refunded 70% of their total booking amount.";
          case "Flexible Cancellation Policy":
            return "Cancelling within 48 hours of booking is free, and guest will have a full refund of their total booking amount. Cancellation after 48 hours, guest will be refunded 70% of their total booking amount.";
          default:
            return "Cancellation policy information not available.";
        }
      })(),
    },
  ];

  const perks = perks_info.map((perk) => (
    <div key={perk.id} className="flex items-center box-border ">
      <div className="shrink-0 min-w-[24px] block">
        {perk.text === "Home Descriptions" ? (
          <FaInfoCircle size={24}/> // Icon for home description
        ) : perk.text === "Cancellation Policy" ? (
          <FaRuler  size={24}/> // Icon for cancellation policy
        ) : perk.text === "Hotel" ? (
          <FaHotel size={24}/> // Icon for Hotel
        ) : perk.text === "Guest House" ? (
          <FaBed size={24}/> // Icon for Guest House
        ) : perk.text === "Apartment" ? (
          <FaCity size={24}/> // Icon for Apartment
        ) : perk.text === "Office" ? (
          <FaBuilding size={24}/> // Icon for Office
        ) : perk.text === "Art" ? (
          <FaPalette size={24}/> // Icon for Art
        ) : perk.text === "City Apartments" ? (
          <FaCity size={24}/> // Icon for City Apartments
        ) : perk.text === "Pet-Friendly Retreats" ? (
          <FaDog size={24}/> // Icon for Pet-Friendly Retreats
        ) : perk.text === "Treehouse Retreats" ? (
          <FaTree size={24}/> // Icon for Treehouse Retreats
        ) : perk.text === "Family-Friendly Homes" ? (
          <FaHome size={24}/> // Icon for Family-Friendly Homes
        ) : perk.text === "Boutique Villas" ? (
          <FaShopify size={24}/> // Icon for Boutique Villas
        ) : perk.text === "Lakeside Serenity" ? (
          <FaWater size={24}/> // Icon for Lakeside Serenity
        ) : perk.text === "Desert Oases" ? (
          <FaLandmark size={24}/> // Icon for Desert Oases
        ) : perk.text === "Urban Getaways" ? (
          <FaCity size={24}/> // Icon for Urban Getaways
        ) : perk.text === "Countryside" ? (
          <FaHome size={24}/> // Icon for Countryside
        ) : perk.text === "Luxury Estate" ? (
          <FaCity size={24}/> // Icon for Luxury Estate
        ) : perk.text === "Trending" ? (
          <FaChartBar size={24}/> // Icon for Trending
        ) : perk.text === "Beachfront Bliss" ? (
          <FaLandmark size={24}/> // Icon for Beachfront Bliss
        ) : perk.text === "Mountain Retreats" ? (
          <FaMountain size={24}/> // Icon for Mountain Retreats
        ) : (
          <FaHome size={24}/> // Default icon
        )}
      </div>
      <div className="ml-4 block">
        <div className="text-base font-[500]">{perk.text}</div>
        <div className="text-sm list-none text-gray-400 flex flex-wrap space-x-3">
          {perk.description}
        </div>
      </div>
    </div>
  ));
  

  return (
    <div className="w-full">
      <div className=" border-b border-t lg:border-t-0 py-6 lg:pt-0 w-full">
        <div className="flex gap-4 items-start w-full break-words justify-between flex-row mb-4  lg:mb-6 ">
          {/* <div className=" text-2xl w-[90%]  font-semibold block box-border  bg-white "><h1>{ListingCategory} by {Host}</h1></div> */}
          <div className="  block box-border  bg-white ">
            <h1 className="text-2xl   font-semibold">Room & bedding</h1>
            <div className="flex gap-2 font-extralight flex-wrap text-lg text-gray-500">
              <p>{guest} Guest</p>
              <p>{bathrooms} bathrooms</p>
              <p>{beds} beds</p>
              <p className="">{bedroom} bedrooms</p>
            </div>
          </div>

          {/* <div>
                        <div className=" w-[48px] h-[48px]  overflow-hidden rounded-full "> 
                        <img src="https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240"   /> </div> 
                    </div> */}
        </div>
        <ul className=" example flex   w-full gap-2 overflow-x-scroll list-disc box-border    ">
          {Rooms}
        </ul>
      </div>

      <div className="Perks py-8 block box-border  mb-6  ">
        <div className=" flex flex-col gap-6 box-border ">{perks}</div>
      </div>
    </div>
  );
};

export default HostedBy;

// border-radius: 50px;
// overflow: hidden;
// padding: 0px;
// width: 65px;
//   height: 65px;
