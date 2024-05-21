import React, { useState, useRef, useEffect } from "react";
import { message } from "antd";

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
  FaBan,
} from "react-icons/fa";
import { LoadingOutlined } from '@ant-design/icons';

import { useParams, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Spin } from 'antd';

import AddressForm from "../AddressFrom";
import Axios from "../../Axios";
import { data } from "autoprefixer";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import { Link } from "react-router-dom";
export default function HostHomes({ match }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [step, setStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [houseTitle, setHouseTitle] = useState("");
  const [additionalRules, setAdditionalRules] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00 PM");
  const [selectedCheckOutTime, setSelectedCheckOutTime] = useState("12:00 PM");

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPrivacyType, setSelectedPrivacyType] = useState(null);
  const [selectedInstantBookType, setSelectedInstantBookType] = useState(null);
  const [selectedHouseType, setSelectedHouseType] = useState(null);
  const [selectedHostType, setSelectedHostType] = useState(null);
  const [selectedCautionTypes, setSelectedCautionTypes] = useState(["none"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStepValid, setIsStepValid] = useState(true);
  const [isAmenitySelected, setIsAmenitySelected] = useState(false);
  const [uploadedImageCount, setUploadedImageCount] = useState(0);

  const [visiblities, setVisiblities] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState(["none"]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [selectedCautionType, setSelectedCautionType] = useState([]);
  const [isGuestsSelected, setIsGuestsSelected] = useState(false);
  const [isBedroomsSelected, setIsBedroomsSelected] = useState(false);
  const [isBedsSelected, setIsBedsSelected] = useState(false);
  const [isBathroomsSelected, setIsBathroomsSelected] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [houseDescriptionDetails, setHouseDescriptionDetails] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [selectedHouseDescriptions, setSelectedHouseDescriptions] = useState(
    []
  );
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const { token } = useStateContext();

  const goLogin = useRef(null);

  const [formData, setFormData] = useState({
    welcomeTypes: [],
    housePrice: 0,
    houseDiscount: [],
    houseRules: [],
    additionalRules: [], // Add additionalRules field here

    hostType: "",
    propertyFeatures: [],
    checkInTime: "",
    cancellationPolicy: "",
    securityDeposit: 0,
  });

  const [apartment, setApartment] = useState(null);


  useEffect(() => {
    let timeout;
    if (isSubmitting) {
      timeout = setTimeout(() => {
        setShowTimeoutMessage(true);
      }, 10000); // 10 seconds
    } else {
      clearTimeout(timeout);
      setShowTimeoutMessage(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isSubmitting]);

  const { id } = useParams();
  // Rest of your code

  useEffect(() => {
    const apartmentId = id;

    Axios.get(`/hosthomes/${apartmentId}`)
      .then((response) => {
        setApartment(response.data.data);
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log("Error fetching hosthome details:", error);
      });
  }, [id]);

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleTimeChangeCheckOut = (e) => {
    setSelectedCheckOutTime(e.target.value);
  };

  const handleSave = () => {
    // You can send the selected time to your backend or perform any other action here
    console.log("Selected check-in time: ", selectedTime);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      // No file selected
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert("Video size exceeds 20MB limit.");
      return;
    }

    const video = document.createElement("video");

    video.onloadedmetadata = () => {
      if (video.duration > 60) {
        alert("Video duration exceeds 1 minute limit.");
      } else {
        setSelectedVideo(file);
      }
    };

    video.src = URL.createObjectURL(file);
  };

  const handleAddressChange = (address) => {
    setEnteredAddress(address);
  };

  const [housePrice, setHousePrice] = useState(""); // Add this line for the house price
  const [securityDeposit, setSecurityDeposit] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Set the loader state to true

      const photoSrcArray = uploadedImages.map((image) => image.src);
      const videoBase64 = selectedVideo
        ? await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(selectedVideo);
          })
        : null;

      const deposit = securityDeposit || 0;

      const formDetails = {
        property_type: selectedHouseType,
        guest_choice: selectedPrivacyType,
        address: enteredAddress,
        guest: guestDetails.guests,
        bedrooms: guestDetails.bedrooms,
        beds: guestDetails.beds,
        bathrooms: guestDetails.bathrooms,
        amenities: [...selectedAmenities],
        hosthomephotos: photoSrcArray,
        hosthomevideo: videoBase64 ? videoBase64.toString() : "", // Convert to string
        title: houseTitle,
        hosthomedescriptions: selectedHouseDescriptions,
        description: houseDescriptionDetails,
        reservations: visiblities,
        reservation: selectedInstantBookType,
        price: Number(housePrice),
        discounts: selectedDiscounts || " ",
        rules: selectedRules || " ",
        additionalRules: additionalRules || " no additional rules",
        host_type: selectedHostType,
        notice: selectedCautionTypes || ["none"],
        checkin: selectedTime,
        check_out_time: selectedCheckOutTime,

        cancelPolicy: selectedPolicy,
        securityDeposit: deposit, // Use the default value for security deposit
      };
      console.log("Form submitted successfully", formDetails);

      // Example Axios post request
      await Axios.post("/hosthomes", formDetails);

      // Redirect to the homepage after successful submission
      navigate("/Hosting");
      console.log("Form submitted successfully", formDetails);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error submitting form: " + error.response.data.message);

      if (error.response && error.response.status === 401) {
        // Redirect to the hosting page or any other appropriate page for unauthenticated users
        navigate("/hosting");
      }
    } finally {
      setIsSubmitting(false); // Set the loader state back to false, whether the submission was successful or not
    }
  };

  const handleNext = () => {
    let isValid = true;

    switch (step) {
      case 2:
        if (!selectedHouseType) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select a house type.",
          });
          break;
        }
        break;

      case 3:
        if (!selectedPrivacyType) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select a privacy type.",
          });
          break;
        }
        break;
      case 5:
        if (
          !isGuestsSelected ||
          !isBedroomsSelected ||
          !isBedsSelected ||
          !isBathroomsSelected
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please select at least one guest, one bedroom, one bed, and one bathroom before proceeding to the next step.",
          });
        }
        break;

      case 6:
        if (selectedAmenities.length === 0) {
          isValid = false;
          setIsAmenitySelected(false);
          Modal.error({
            title: "Validation Error",
            content:
              "Please select at least one amenity before proceeding to the next step. it is recommended you select up to 10 amenities to boost your apartment",
          });
        } else {
          setIsAmenitySelected(true);
        }
        break;

      case 7:
        if (step === 7 && uploadedImages.length < 5) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please upload at least 5 photos before proceeding to the next step.",
          });
        }
        break;

      case 8:
        if (!selectedVideo) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please upload a video before proceeding to the next step.",
          });
        }
        break;

      case 9:
        if (houseTitle.trim() === "") {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a title for your house before proceeding to the next step.",
          });
        }
        break;

      case 10:
        if (selectedHouseDescriptions.length <= 1) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please choose at least two highlight for your house before proceeding to the next step.",
          });
        }
        break;

      case 11:
        if (
          houseDescriptionDetails.length === 0 ||
          houseDescriptionDetails.length > 750
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a description within the character limit (1-750 characters) before proceeding to the next step.",
          });
        }
        break;
      case 12:
        if (!selectedInstantBookType) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Decide how you’ll confirm reservations before proceeding to the next step",
          });
          break;
        }
        break;

      case 13:
        if (visiblities.length === 0) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
            "Please choose who to welcome for your first reservation before proceeding to the next step",
          });
          break;
        }
        break;

      case 14:
        // Check if housePrice is not a valid number or is less than or equal to 0
        if (isNaN(housePrice) || housePrice.length <= 4) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a valid price before proceeding to the next step",
          });
          break;
        }
        break;

      case 15:
        // Check if at least one discount is selected
        // if (selectedDiscounts.length === 0) {
        //   isValid = false;
        //   Modal.error({
        //     title: "Validation Error",
        //     content:
        //     "Please select a discount before proceeding to the next step",
        //   });
        //   break;
        // }
        break;

      case 16:
        // Check if at least one house rule is selected
        if (selectedRules.length === 0) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select at least one house rule.",
          });
          break;
        }

        
        break;

      case 17:
        // Check if a hosting type is selected
        if (!selectedHostType) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select a hosting type.",
          });
          break;
        }

        // Check if at least one caution type is selected
        if (selectedCautionTypes.length === 0) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select at least one caution type.",
          });
          break;
        }
        break;

      case 19:
        // Check if a cancellation policy is selected
        if (!selectedPolicy) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select a cancellation policy.",
          });
        }
        break;

      case 20:
        // Check if the security deposit is within a valid range and has a valid length (you can adjust the range and length as needed)
        const isValidSecurityDeposit =
          securityDeposit === "" ||
          (parseFloat(securityDeposit) >= 0 &&
            parseFloat(securityDeposit) <= 1000 &&
            securityDeposit.length <= 10); // Adjust the length as needed

        if (!isValidSecurityDeposit) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a valid security deposit amount (or leave it blank) with a maximum length of 10 characters.",
          });
        }
        break;

      default:
        break;
    }

    if (!isValid) {
      // Modal.error({
      //   title: "Validation Error",
      //   content: "Please select an option before proceeding to the next step.",
      // });
      return;
    }

    if (token) {
      setStep((prevStep) => prevStep + 1);
    } else {
      goLogin.current.click();
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleIncrement = (field) => {
    setGuestDetails((prevDetails) => ({
      ...prevDetails,
      [field]: prevDetails[field] + 1,
    }));

    switch (field) {
      case "guests":
        setIsGuestsSelected(true);
        break;
      case "bedrooms":
        setIsBedroomsSelected(true);
        break;
      case "beds":
        setIsBedsSelected(true);
        break;
      case "bathrooms":
        setIsBathroomsSelected(true);
        break;
      default:
        break;
    }
  };

  const handleDecrement = (field) => {
    setGuestDetails((prevDetails) => ({
      ...prevDetails,
      [field]: Math.max(0, prevDetails[field] - 1),
    }));

    // Set corresponding state variable based on the field
    switch (field) {
      case "guests":
        setIsGuestsSelected(true);
        break;
      case "bedrooms":
        setIsBedroomsSelected(true);
        break;
      case "beds":
        setIsBedsSelected(true);
        break;
      case "bathrooms":
        setIsBathroomsSelected(true);
        break;
      default:
        break;
    }
  };

  const [hostingType, setHostingType] = useState("private");
  const [propertyFeatures, setPropertyFeatures] = useState({
    securityCamera: false,
    weapons: false,
    dangerousAnimals: false,
  });

  const handleHostingTypeChange = (type) => {
    setHostingType(type);
  };

  const handlePropertyFeatureChange = (feature) => {
    setPropertyFeatures({
      ...propertyFeatures,
      [feature]: !propertyFeatures[feature],
    });
  };

  const [guestDetails, setGuestDetails] = useState({
    guests: 0,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
  });

  const [discounts, setDiscounts] = useState({
    newListingPromotion: false,
    weeklyDiscount: false,
    monthlyDiscount: false,
  });

  const propertyTypes = [
    { id: "house", label: "House", icon: <FaHome /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "guestHouse", label: "Guest House", icon: <FaBed /> },
    { id: "apartment", label: "Apartment", icon: <FaBuilding /> },
    { id: "office", label: "Office", icon: <FaBuilding /> },
    { id: "art", label: "Art", icon: <FaPalette /> },
    { id: "cityApartments", label: "City Apartments", icon: <FaCity /> },
    {
      id: "petFriendlyRetreats",
      label: "Pet-Friendly Retreats",
      icon: <FaDog />,
    },
    { id: "treehouseRetreats", label: "Treehouse Retreats", icon: <FaTree /> },
    {
      id: "familyFriendlyHomes",
      label: "Family-Friendly Homes",
      icon: <FaUserFriends />,
    },
    { id: "boutiqueVillas", label: "Boutique Villas", icon: <FaShopify /> },
    { id: "lakesideSerenity", label: "Lakeside Serenity", icon: <FaWater /> },
    { id: "desertOases", label: "Desert Oases", icon: <FaLandmark /> },
    { id: "urbanGetaways", label: "Urban Getaways", icon: <FaCity /> },
    { id: "countryside", label: "Countryside", icon: <FaHome /> },
    { id: "luxuryEstate", label: "Luxury Estate", icon: <FaCity /> },
    { id: "trending", label: "Trending", icon: <FaChartBar /> },
    { id: "beachfrontBliss", label: "Beachfront Bliss", icon: <FaLandmark /> },
    {
      id: "mountainRetreats",
      label: "Mountain Retreats",
      icon: <FaMountain />,
    },
  ];

  const privacyTypes = [
    {
      id: "house",
      label: "An entire place",
      icon: <FaHome />,
      description:
        "Enjoy the entire property to yourself, perfect for those who prefer privacy and space.",
    },
    {
      id: "hotel",
      label: "A room",
      icon: <FaHotel />,
      description:
        "Cozy up in your own private room while sharing common spaces with other guests.",
    },

    {
      id: "guestHouse",
      label: "A shared room",
      icon: <FaBed />,
      description:
        "Rent an entire guest house with all the amenities for an exclusive stay.",
    },
  ];

  const houseDescription = [
    {
      id: "peaceful",
      label: "An entire place",
      icon: <FaHome />,
      description: "Guests have the whole place to themselves.",
    },
    {
      id: "unique",
      label: "A room",
      icon: <FaHotel />,
      description: "Guests have the whole place to themselves.",
    },

    {
      id: "family-friendly",
      label: "A shared room",
      icon: <FaBed />,
      description: "Guests have the whole place to themselves.",
    },
    {
      id: "stylish",
      label: "A shared room",
      icon: <FaBed />,
      description: "Guests have the whole place to themselves.",
    },

    {
      id: "central",
      label: "A shared room",
      icon: <FaBed />,
      description: "Guests have the whole place to themselves.",
    },

    {
      id: "spacious",
      label: "A shared room",
      icon: <FaBed />,
      description: "Guests have the whole place to themselves.",
    },
  ];

  const instantBook = [
    {
      id: "Use Instant Book",
      label: "An entire place",
      icon: <FaHome />,
      description: "Guests can book automatically.",
    },
    {
      id: "Approve or decline requests",
      label: "A room",
      icon: <FaHotel />,
      description: "Guests must ask if they can book.",
    },
  ];

  const caution = [
    {
      id: "              Security camera(s) ",
      label: "An entire place",
      icon: <FaCamera />,
      description: "Guests can book automatically.",
    },
    {
      id: "              Weapons      ",
      label: "A room",
      icon: <FaShieldAlt />,
      description: "Guests must ask if they can book.",
    },

    {
      id: "              Dangerous Animal      ",
      label: "A room",
      icon: <FaExclamationTriangle />,
      description: "Guests must ask if they can book.",
    },
    {
      id: "None",
      label: "None",
      icon: <FaBan />, // You can specify null for the icon if needed
      description: "No special cautions apply.",
    },
  ];

  const amenities = [
    {
      id: "Wifi",
      label: "Wifi",
      icon: <FaWifi />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "TV",
      label: "TV",
      icon: <FaTv />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Kitchen",
      label: "Kitchen",
      icon: <FaUtensils />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Washer",
      label: "Washer",
      icon: <FaHandsWash />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Air conditioning",
      label: "Air conditioning",
      icon: <FaSnowflake />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Free parking on premises",
      label: "Free parking on premises",
      icon: <FaParking />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Pool",
      label: "Pool",
      icon: <FaSwimmingPool />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Hot tub",
      label: "Hot tub",
      icon: <FaHotTub />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Fire pit",
      label: "Fire pit",
      icon: <FaFire />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Indoor fireplace",
      label: "Indoor fireplace",
      icon: <FaFire />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Smoke Alarm",
      label: "Smoke Alarm",
      icon: <FaBell />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "First aid kit",
      label: "First aid kit",
      icon: <FaFirstAid />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Fire extinguisher",
      label: "Fire extinguisher",
      icon: <FaFireExtinguisher />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Smoke alarm",
      label: "Smoke alarm",
      icon: <FaSmoking />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Heating",
      label: "Heating",
      icon: <FaTemperatureHigh />,
      description:
        "Ensure your guests stay warm and comfortable during their stay.",
    },
    {
      id: "Essentials",
      label: "Essentials",
      icon: <FaSuitcase />,
      description:
        "Provide basic amenities such as towels, bed sheets, soap, and toilet paper.",
    },
    {
      id: "Shampoo",
      label: "Shampoo",
      icon: <FaShower />,
      description: "Offer shampoo for guests' convenience during their stay.",
    },
    {
      id: "Hair dryer",
      label: "Hair dryer",
      icon: <FaAirFreshener />,
      description: "Include a hair dryer for guests to use during their stay.",
    },
    {
      id: "Iron",
      label: "Iron",
      icon: <FaSnowboarding />,
      description:
        "Ensure guests can keep their clothes wrinkle-free with an available iron.",
    },
    {
      id: "Laptop-friendly workspace",
      label: "Laptop-friendly workspace",
      icon: <FaLaptop />,
      description:
        "Provide a designated workspace for guests who need to work on their laptops.",
    },
    {
      id: "Hangers",
      label: "Hangers",
      icon: <FaPaperclip />,
      description:
        "Include hangers in the wardrobe for guests to hang their clothes.",
    },

    {
      id: "Gym",
      label: "Gym",
      icon: <FaDumbbell />,
      description: "Offer fitness facilities to guests for a healthy stay.",
    },
    {
      id: "Wheelchair accessible",
      label: "Wheelchair accessible",
      icon: <FaWheelchair />,
      description:
        "Ensure accommodation is accessible for guests with mobility challenges.",
    },
    {
      id: "Pets allowed",
      label: "Pets allowed",
      icon: <FaPaw />,
      description:
        "Welcome guests with pets by allowing them in your accommodation.",
    },
    {
      id: "Smoking allowed",
      label: "Smoking allowed",
      icon: <FaSmoking />,
      description: "Permit smoking in designated areas for guests who smoke.",
    },
    {
      id: "Balcony",
      label: "Balcony",
      icon: <FaBuilding />,
      description:
        "Offer a private balcony for guests to enjoy outdoor views and fresh air.",
    },
    {
      id: "Elevator",
      label: "Elevator",
      icon: <FaArrowUp />,
      description: "Convenient access to different floors with an elevator.",
    },

    {
      id: "Coffee maker",
      label: "Coffee maker",
      icon: <FaCoffee />,
      description:
        "Provide a coffee maker for guests to enjoy freshly brewed coffee.",
    },
    {
      id: "Tea kettle",
      label: "Tea kettle",
      icon: <FaUtensils />,
      description: "Include a tea kettle for guests who prefer tea.",
    },
    {
      id: "Dishwasher",
      label: "Dishwasher",
      icon: <FaHandsWash />,
      description: "Offer the convenience of a dishwasher for guests' use.",
    },
    {
      id: "Oven",
      label: "Oven",
      icon: <FaObjectGroup />,
      description:
        "Include an oven for guests who prefer cooking or baking during their stay.",
    },
    {
      id: "Microwave",
      label: "Microwave",
      icon: <FaWaveSquare />,
      description: "Provide a microwave for quick and easy meal preparation.",
    },
    {
      id: "Toaster",
      label: "Toaster",
      icon: <FaHotdog />,
      description:
        "Include a toaster for guests to prepare their favorite toasted snacks.",
    },
    {
      id: "Refrigerator",
      label: "Refrigerator",
      icon: <FaBox />,
      description:
        "Offer a refrigerator for guests to store their perishable items.",
    },

    {
      id: "Books",
      label: "Books",
      icon: <FaBook />,
      description:
        "Offer a selection of books for guests to enjoy during their stay.",
    },
    {
      id: "Board games",
      label: "Board games",
      icon: <FaChessBoard />,
      description: "Provide board games for guests to have fun and relax.",
    },
  ];

  const visiblity = [
    {
      id: "Any Shbro guest",
      label: "An entire place",
      icon: <FaHome />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "An experienced guest",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
  ];

  const HostType = [
    {
      id: "              I'm hosting as a private individual      ",
      label: "An entire place",
      icon: <FaUser />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "              I'm hosting as a business  ",
      label: "A room",
      icon: <FaUserFriends />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
  ];

  const HouseRules = {
    pets: "No pets",
    events: "No parties or events",
    smoking: "No smoking",
    partying: "No parties or events",
  };

  const houseDiscount = [
    {
      id: "     20% New listing promotion",
      label: "An entire place",
      icon: <FaHome />,
      description: "Offer 20% off your first 3 bookings",
    },
    {
      id: "    5% Weekly discount",
      label: "A room",
      icon: <FaHotel />,
      description: "For stays of 7 nights or more",
    },
    {
      id: "   10% Monthly discount",
      label: "A room",
      icon: <FaHotel />,
      description: "For stays of 28 nights or more",
    },
  ];

  const cancellationPolicies = [
    {
      id: 1,
      label: "Moderate Cancellation Policy",
      description:
        "Cancellation  after booking, guest will refunded 70% of their total booking amount",
    },
    {
      id: 2,
      label: "Strict Cancellation Policy",
      description:
        "Cancellation after booking, guest will refunded 50% of their total booking amount",
    },
    {
      id: 3,
      label: "Flexible Cancellation Policy",
      description:
        "Cancelling within 48 hours of booking is free and guest will have a full refund of their total booking amount. Hence, cancellation after 48hours, guest will be refunded 70% of their total booking amount. ",
    },
  ];

  const handleTypeSelection = (typeId) => {
    setSelectedHouseType(typeId);
  };

  const handlePrivacyTypeSelection = (typeId) => {
    setSelectedPrivacyType(typeId);
  };

  const handleAmenitySelection = (id) => {
    // Toggle the selection status
    setSelectedAmenities((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const updateSelection = (array = [], itemId) => {
    // Logic to toggle the selection status of the item in the array
    if (array.includes(itemId)) {
      return array.filter((selectedId) => selectedId !== itemId);
    } else {
      return [...array, itemId];
    }
  };

  const handleRemoveVideo = () => {
    // Implement the logic to remove the selected video
    setSelectedVideo(null); // Set the selectedVideo state to null or an appropriate initial value
  };

  const toggleSelection = (array, itemId) => {
    // Logic to toggle the selection status of the item in the array
    if (array.includes(itemId)) {
      return array.filter((selectedId) => selectedId !== itemId);
    } else {
      return [...array, itemId];
    }
  };
  const handleHouseDescriptionSelection = (selectedId) => {
    // Check if the selectedId is already in the array
    if (selectedHouseDescriptions.includes(selectedId)) {
      // If yes, remove it
      setSelectedHouseDescriptions((prevSelected) =>
        prevSelected.filter((id) => id !== selectedId)
      );
    } else {
      // If no, add it
      setSelectedHouseDescriptions((prevSelected) => [
        ...prevSelected,
        selectedId,
      ]);
    }
  };
  const handleWelcomeVisibilitySelection = (typeId) => {
    setVisiblities((prevVisibility) => {
      // If the selected typeId is already in the array, deselect it
      if (prevVisibility.includes(typeId)) {
        return [];
      } else {
        // If not, select the new typeId
        return [typeId];
      }
    });
  };

  const handleInstantBookSelection = (selectedId) => {
    setSelectedInstantBookType(selectedId);
  };

  const handleCancellationPolicySelection = (policyId) => {
    const selectedPolicy = cancellationPolicies.find(
      (policy) => policy.id === policyId
    );

    if (selectedPolicy) {
      console.log("Selected Cancellation Policy ID:", policyId);
      console.log("Selected Cancellation Policy Label:", selectedPolicy.label);
    }

    setSelectedPolicy(policyId);
  };

  const handleDiscountSelection = (discountId) => {
    setSelectedDiscounts((prevSelectedDiscounts) => {
      if (prevSelectedDiscounts.includes(discountId)) {
        return prevSelectedDiscounts.filter(
          (discount) => discount !== discountId
        );
      } else {
        return [...prevSelectedDiscounts, discountId];
      }
    });
  };

  const handleRuleSelection = (rule) => {
    setSelectedRules((prevSelectedRules) => {
      if (prevSelectedRules.includes(rule)) {
        return prevSelectedRules.filter(
          (selectedRule) => selectedRule !== rule
        );
      } else {
        return [...prevSelectedRules, rule];
      }
    });
  };

  const handleHouseTypeSelection = (typeId) => {
    setSelectedHouseType(typeId);
  };

  const handleHostTypeSelection = (typeId) => {
    setSelectedHostType(typeId);
  };

  const handleCautionTypeSelection = (id) => {
    setSelectedCautionTypes((prevSelectedTypes) => {
      if (prevSelectedTypes.includes(id)) {
        // If already selected, remove it
        return prevSelectedTypes.filter((type) => type !== id);
      } else {
        // If not selected, add it
        return [...prevSelectedTypes, id];
      }
    });
  };

  const addressFields = [
    { id: "street", label: "Street Address" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "zipcode", label: "Zip Code" },
  ];

  // Create state to store address information
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        newImages.push({ id: Date.now(), src: event.target.result });
        if (newImages.length === files.length) {
          // Directly update the hosthomephotos array in the state
          setUploadedImages((prevImages) => [...prevImages, ...newImages]);

          // Update the uploaded image count
          setUploadedImageCount((prevCount) => prevCount + newImages.length);
          console.log(uploadedImageCount);
        }
      };

      reader.readAsDataURL(file);
    }

    // Reset the file input field
    setFileInputKey(fileInputKey + 1);
  };

  const handleImageDelete = (id) => {
    const updatedImages = uploadedImages.filter((image) => image.id !== id);
    setUploadedImages(updatedImages);
  };
  
  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className=" mx-auto  flex justify-center p-4 ">
            <div className=" ">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-28">
                <h1 className="text-6xl">
                  It’s easy to get started on Shortlet Bookings
                </h1>
              </div>
              <div className="">
                <div>
                  <div className="flex border-b-[1px] pb-2 my-4">
                    <div className="text-2xl mr-2">1</div>
                    <div className="flex flex-col">
                      <h2 className="font-medium text-2xl mb-3">
                        Tell us about your place
                      </h2>
                      <h3>
                        Share some basic info, like where it is and how many
                        guests can stay.
                      </h3>
                    </div>
                    <div>
                      <img
                        className="w-32"
                        src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex border-b-[1px] pb-2 my-4">
                    <div className="text-2xl mr-2">2</div>
                    <div className="flex flex-col">
                      <h2 className="font-medium text-2xl mb-3">
                        Make it stand out
                      </h2>
                      <h3>
                        Add 5 or more photos plus a title and description—we’ll
                        help you out.
                      </h3>
                    </div>
                    <div>
                      <img
                        className="w-32"
                        src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="flex pb-32 my-4">
                    <div className="text-2xl mr-2">3</div>
                    <div className="flex flex-col  w-[100%]">
                      <h2 className="font-medium text-2xl mb-3 ">Publish</h2>
                      <h3 className="">
                        Choose if you'd like to start with an experienced guest,
                        set a starting price, and publish your listing.
                      </h3>
                    </div>
                    <div>
                      <img
                        className="w-32"
                        src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">It’s easy to get started on Shbro</h1>
              </div>
              <div className="">
                <div>
                  <div className=" pb-2 my-4">
                    <div className="text-2xl mr-2">Step 1</div>
                    <div className="flex flex-col">
                      <h2 className="font-medium text-2xl mb-3">
                        Tell us about your place
                      </h2>
                      <h3>
                        Share some basic info, like where it is and how many
                        guests can stay.
                      </h3>
                    </div>
                  </div>
                  <div>
                    <img
                      className="w-64"
                      src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  Which of these best describes your place?
                </h1>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <h3 className="text-xl ">Property Types</h3>
                  <div className="flex flex-wrap   w-full">
                    {propertyTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type h-26 w-32 m-3 flex ${
                          selectedHouseType === type.id
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleTypeSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  What type of place will guests have?
                </h1>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="  w-full">
                    {privacyTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type m-3 flex ${
                          selectedPrivacyType === type.id
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handlePrivacyTypeSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl mb-3">{type.icon}</span>
                        {type.label}
                        <p>{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return <AddressForm onAddressChange={handleAddressChange} />;

      case 5:
        return (
          <div className=" mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Share some basics about your place</h1>
                <p className="text-gray-400 text-lg mt-10">
                  You'll add more details later, like bed types.
                </p>
              </div>
              <div className="pb-32">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-col">
                      <span className="text-lg">Guests:</span> <br />
                      <p className="text-gray-400">Max number of guests</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDecrement("guests")}
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="button"
                        className="w-8 text-center"
                        value={guestDetails.guests}
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement("guests")}
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-col">
                      <span className="text-lg">Bedrooms:</span> <br />
                      <p className="text-gray-400">Number of bedrooms</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleDecrement("bedrooms")}
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="button"
                        className="w-8 text-center"
                        value={guestDetails.bedrooms}
                      />
                      <button
                        onClick={() => handleIncrement("bedrooms")}
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-col">
                      <span className="text-lg">Beds:</span> <br />
                      <p className="text-gray-400">Number of beds</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDecrement("beds")}
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="w-8 text-center"
                        value={guestDetails.beds}
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement("beds")}
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-col">
                      <span className="text-lg">Bathrooms:</span> <br />
                      <p className="text-gray-400">Number of bathrooms</p>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleDecrement("bathrooms")}
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="button"
                        className="w-8 text-center"
                        value={guestDetails.bathrooms}
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement("bathrooms")}
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">
                  Tell guests what your place has to offer{" "}
                </h1>
                <p className="text-gray-400 mt-10 text-lg">
                  You can add more amenities after you publish your listing.
                </p>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <h3 className="text-xl font-semibold">Amenities </h3>
                  <div className="flex flex-wrap   w-full">
                    {amenities.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type h-26  w-32 m-3   flex ${
                          selectedAmenities.includes(type.id) // Change this line
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleAmenitySelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl text-center">
                  Add some photos of your house
                </h1>
                <p className="text-gray-400 mt-10 text-center">
                  You can add more or make changes later.
                </p>
              </div>
              <div className="pb-32">
                <div className="text-center">
                  <div className="p-8 my-6">
                    <label
                      htmlFor={fileInputKey}
                      className="cursor-pointer block w-full max-w-md mx-auto bg-orange-300 text-white rounded-md p-4 text-center transition duration-300 hover:bg-orange-600"
                    >
                      <div className="mb-4">
                        <FaCloudUploadAlt className="text-4xl mx-auto" />
                      </div>
                      <p className="mb-2">Click or Drag Photos Here</p>
                      <p className="text-sm">Choose at least 5 photos</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        key={fileInputKey}
                        className="hidden"
                        id={fileInputKey}
                      />
                    </label>
                  </div>
                  <p className="text-gray-400">Choose at least 5 photos</p>
                </div>
                <div className="flex flex-wrap mt-6">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative p-2">
                      <img
                        src={image.src}
                        alt="House"
                        className="w-64 object-cover h-64 rounded-md"
                      />
                      <button
                        onClick={() => handleImageDelete(image.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Upload Video Apartment on Shbro</h1>
                <p className="text-gray-400 mt-10 text-center">
                  Gives you a better chance of getting guests
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 max-w-md mx-auto mt-8">
  {selectedVideo === null && (
    <div className="bg-white border p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
      <label
        htmlFor="videoInput"
        className="grid place-items-center bg-orange-300 text-white rounded-md p-4 cursor-pointer transition duration-300 hover:bg-orange-600"
      >
        <div className="mb-4">
          <FaVideo className="text-4xl mx-auto" />
        </div>
        Click to Upload Video
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoUpload}
          className="hidden"
          id="videoInput"
        />
      </label>
    </div>
  )}
  {selectedVideo === null && (
    <div className="bg-white border p-4 rounded-lg shadow-md mb-24">
      <div>
        <p className="text-slate-500 mt-4">Maximum file size: 20MB</p>
        <p className="text-slate-500">Maximum duration: 1 minute</p>
      </div>
    </div>
  )}
  {selectedVideo && (
    <div className="bg-white border p-4 rounded-lg shadow-md mb-24">
      <div>
        <p className="text-lg font-semibold mb-2">
          Selected Video: {selectedVideo.name}
        </p>
        <p className="text-slate-500">
          Size: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
        </p>
        <video controls className="mt-2">
          <source
            src={URL.createObjectURL(selectedVideo)}
            type="video/mp4"
          />
        </video>
        <button
          onClick={handleRemoveVideo}
          className="bg-red-500 text-white py-2 px-4 mt-4 rounded-full hover:bg-red-600 transition duration-300"
        >
          Remove Video
        </button>
      </div>
    </div>
  )}
</div>

            </div>
          </div>
        );

      case 9: // Step for adding a house title
        const maxCharacterCount = 50;
        const currentCharacterCount = houseTitle.length;
        const remainingCharacterCount =
          maxCharacterCount - currentCharacterCount;

        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Now, let's give your house a title</h1>
                <p className="text-gray-400 mt-10">
                  Short titles work best. Have fun with it—you can always change
                  it later.
                </p>
              </div>
              <div className=" text-center">
                <input
                  type="text"
                  className="border rounded-lg px-4 py-2 w-2/3 text-lg w-full"
                  placeholder="Enter a title for your house"
                  value={houseTitle}
                  onChange={(e) => {
                    const inputText = e.target.value;
                    if (inputText.length <= maxCharacterCount) {
                      setHouseTitle(inputText);
                    }
                  }}
                />
                <p className="text-gray-400 mt-4">
                  {currentCharacterCount}/{maxCharacterCount} characters left
                </p>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Next, let's describe your house</h1>
                <p className="text-gray-400 mt-10">
                  Choose up to 2 highlights. We'll use these to get your
                  description started.
                </p>
              </div>
              <div className="pb-32">
                <div className=" ">
                  <div className="flex flex-wrap   w-full">
                    {houseDescription.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type h-24 w-32 m-3 flex ${
                          selectedHouseDescriptions.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleHouseDescriptionSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 11:
        const maxCharCount = 750;
        const currentCharCount = houseDescriptionDetails.length;
        const remainingCharCount = maxCharCount - currentCharCount;

        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Create your description</h1>
                <p className="text-gray-400 mt-10">
                  Share what makes your place special.
                </p>
              </div>
              <div className="pb-32 text-center">
                <textarea
                  type="text"
                  className="border rounded-lg px-4 py-2 h-[400px] text-lg w-full"
                  placeholder="Enter a description for your house"
                  value={houseDescriptionDetails}
                  onChange={(e) => {
                    const inputText = e.target.value;
                    if (inputText.length <= maxCharCount) {
                      setHouseDescriptionDetails(inputText);
                    }
                  }}
                />
                <p className="text-gray-400 mt-4">
                  {currentCharCount}/{maxCharCount} characters left
                </p>
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  Decide how you’ll confirm reservations
                </h1>
              </div>
              <div className="pb-32">
                <div className="space-y-4">
                  <div className="flex flex-wrap w-full">
                    {instantBook.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type m-3 flex ${
                          selectedInstantBookType === type.id
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleInstantBookSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 13:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  Choose who to welcome for your first reservation
                </h1>
                <p className="text-gray-400 mt-10">
                  After your first guest, anyone can book your place.
                </p>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="flex flex-wrap   w-full">
                    {visiblity.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type  m-3   flex ${
                          visiblities.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => {
                          handleWelcomeVisibilitySelection(type.id);
                        }}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.description}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 14:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Now, set your price</h1>
                <p className="text-gray-400 mt-10">
                  You can change it anytime.
                </p>
              </div>
              <div className="pb-32">
                <div className="text-center">
                  <input
                    type="number"
                    className="border rounded-lg px-4 py-2 w-full text-lg"
                    placeholder="Price per night"
                    value={housePrice}
                    onChange={(e) => setHousePrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 15: // Step for adding discounts
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Add discounts</h1>
                <p>
                  Help your place stand out to get booked faster and earn your
                  first reviews.
                </p>
              </div>
              <div className="pb-32">
                <div className=" ">
                  <div className="flex flex-wrap   w-full">
                    {houseDiscount.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type  m-3   flex ${
                          selectedDiscounts.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => {
                          handleDiscountSelection(type.id);
                        }}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                        <div>{type.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 16: // Step for hosting type and property features
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Rules</h1>
                <p className="text-gray-400 mt-10">
                  You can change it anytime.
                </p>
              </div>
              <div className="flex">
                {Object.keys(HouseRules).map((rule) => (
                  <div
                    key={rule}
                    className={`property-type  m-3   flex ${
                      selectedRules.includes(rule)
                        ? "bg-orange-300 border-2 border-black text-white"
                        : "bg-gray-200 text-black"
                    } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                    onClick={() => handleRuleSelection(rule)}
                  >
                    <span className="mr-2 text-2xl">{rule}</span>
                    {HouseRules[rule]}
                  </div>
                ))}
              </div>

              <div className="md:flex md:justify-center md:flex-col">
                <h1 className="text-2xl">Additional Rules</h1>
              </div>
              <div className="pb-32">
                <div className="space-y-4">
                  <div className="flex flex-wrap w-full">
                    <textarea
                      className="property-type m-3 bg-gray-200 text-black px-4 py-2 rounded-md w-full"
                      placeholder="Add additional rules as bullet points (one rule per line)..."
                      onChange={(e) => setAdditionalRules(e.target.value)}
                    />
                  </div>
                </div>
                <div className="px-4">
                  <ul className="list-disc">
                    {/* Split the text into lines and create list items */}
                    {additionalRules.split("\n").map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 17: // Step for hosting type and property features
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">How are you hosting on Shbro?</h1>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="flex flex-wrap   w-full">
                    {HostType.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type  m-3   flex ${
                          selectedHostType === type.id
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleHostTypeSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:flex md:justify-center md:flex-col ">
                <h1 className="text-2xl">
                  {" "}
                  Does your place have any of these?
                </h1>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="flex flex-wrap   w-full">
                    {caution.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type  m-3   flex ${
                          selectedCautionTypes.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleCautionTypeSelection(type.id)}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 18: // Step for hosting type and property features
        return (
          <div className=" mx-auto   flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  When do you want Guests checking in on Shbro?
                </h1>
              </div>
              <div className="max-w-md mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">
                  Set Check-In Time
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="checkInTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Check-In Time:
                  </label>
                  <select
                    id="checkInTime"
                    name="checkInTime"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="mt-1 p-2 border rounded-md w-full"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>

                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00PM">4:00PM</option>
                    {/* Add more time options as needed */}
                  </select>
                </div>
              </div>
              <div className="max-w-md mx-auto p-4">
                <h2 className="text-2xl font-semibold mb-4">
                  Set Check-Out Time
                </h2>
                <div className="mb-4">
                  <label
                    htmlFor="checkOutTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Check-In Time:
                  </label>
                  <select
                    id="checkOutTime"
                    name="checkOutTime"
                    value={selectedCheckOutTime}
                    onChange={handleTimeChangeCheckOut}
                    className="mt-1 p-2 border rounded-md w-full"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>

                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00PM">4:00PM</option>
                    {/* Add more time options as needed */}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 19:
        return (
          <div className="mx-auto md:w-3/4 flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Choose Your Cancellation Policy</h1>
                <p className="text-gray-400 mt-10">
                  When you host your home, select the cancellation policy that
                  suits your needs.
                </p>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="w-full">
                    {cancellationPolicies.map((policy) => (
                      <div
                        key={policy.id}
                        className={`property-type   m-3   flex ${
                          selectedPolicy === policy.label
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() =>
                          handleCancellationPolicySelection(policy.label)
                        }
                      >
                        <span className="mr-2 text-2xl mb-3">
                          {policy.icon}
                        </span>
                        <h1 className="font-bold text-lg my-3">
                          {policy.label}
                        </h1>
                        <p>{policy.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 20:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            {isSubmitting && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white  bg-opacity-90 z-50">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 54, color: 'orange' }} spin />} />
        </div>
      )}

      {showTimeoutMessage && (
        <div className="fixed bottom-0 left-0 w-full p-4 bg-red-500 text-white text-center">
          Please be patient while the form is submitting.
        </div>
      )}

            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Now, set your Security Deposit</h1>
                <p className="text-gray-400 mt-10">
                  You can change it anytime.
                </p>
                <p className="text-gray-400 mt-10">
                  Adding security depsoit is optional you can choose to leave it
                  blank
                </p>
              </div>
              <div className="pb-32">
                <div className="text-center">
                  <input
                    type="number"
                    className="border rounded-lg px-4 py-2 w-full text-lg"
                    placeholder="Security Deposit"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderContent()}
      <div className="bg-orange-400 flex fixed bottom-0 w-full text-center">
        {step > 0 && (
          <button
            type="button"
            onClick={handlePrevious}
            className="text-white  bg-orange-200 w-full p-4"
          >
            Previous
          </button>
        )}
        {step < 20 && (
          <button
            type="button" // Add this line to prevent form submission
            onClick={handleNext}
            className={`text-white text-center bg-orange-400 w-full p-4 ${
              !isStepValid && "opacity-50 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        )}
        {step === 20 && (
          <button
            type="button" // Add this line to prevent form submission
            onClick={handleSubmit}
            className="text-white text-center bg-orange-400 w-full p-4"
          >
            Submit
          </button>
        )}
      </div>
      <Link ref={goLogin} to={"/Login"} />
    </form>
  );
}
