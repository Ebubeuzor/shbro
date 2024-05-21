import React, { useState, useRef, useEffect } from "react";
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
  FaBan,
} from "react-icons/fa";

import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";

import { Spin } from "antd";
import { useParams } from "react-router-dom";

import AddressForm from "../AddressFrom";
import Axios from "../../Axios";
import { data } from "autoprefixer";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import { Link } from "react-router-dom";
import { Modal } from "antd";

export default function HostHome({ match }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [step, setStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(true);

  const [uploadedImages, setUploadedImages] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [houseTitle, setHouseTitle] = useState("");
  const [additionalRules, setAdditionalRules] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00 PM");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPrivacyType, setSelectedPrivacyType] = useState(null);
  const [selectedInstantBookType, setSelectedInstantBookType] = useState(null);
  const [initiallySelectedType, setInitiallySelectedType] = useState(null);
  const [selectedCheckOutTime, setSelectedCheckOutTime] = useState("12:00 PM");
  const [isGuestsSelected, setIsGuestsSelected] = useState(false);
  const [isBedroomsSelected, setIsBedroomsSelected] = useState(false);
  const [isBedsSelected, setIsBedsSelected] = useState(false);
  const [isBathroomsSelected, setIsBathroomsSelected] = useState(false);
  const [selectedHouseType, setSelectedHouseType] = useState(null);
  const [selectedHostType, setSelectedHostType] = useState(null);
  const [selectedCautionTypes, setSelectedCautionTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [visiblities, setVisiblities] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [selectedCautionType, setSelectedCautionType] = useState([]);
  const [selectedWelcomeVisibility, setSelectedWelcomeVisibility] = useState(
    []
  );
  const [isAmenitySelected, setIsAmenitySelected] = useState(false);

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [houseDescriptionDetails, setHouseDescriptionDetails] = useState("");
  const [enteredAddress, setEnteredAddress] = useState("");
  const [selectedHouseDescriptions, setSelectedHouseDescriptions] = useState(
    []
  );
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedCancellationPolicy, setSelectedCancellationPolicy] =
    useState("");

  const [isLoading, setIsLoading] = useState(true);

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
  const navigate = useNavigate();

  const [apartment, setApartment] = useState(null);

  const { id } = useParams();
  // Rest of your code

  useEffect(() => {
    const apartmentId = id;

    setIsLoading(true); // Set loading to true when starting to fetch data

    Axios.get(`/hosthomes/${apartmentId}`)
      .then((response) => {
        setApartment(response.data.data);
        // console.log(response.data.data);
        setHouseDescriptionDetails(response.data.data.description || ""); // Corrected this line
        setHousePrice(response.data.data.price || ""); // Corrected this line
        setSelectedHostType(response.data.data.host_type || null);
        setSelectedCautionType(response.data.data.notices[0].notice || []);

        setSelectedCancellationPolicy(response.data.data.cancelPolicy || "");
        setSecurityDeposit(response.data.data.securityDeposit || "");
        console.log(response.data.data);
      })

      .catch((error) => {
        console.log("Error fetching hosthome details:", error);
      })
      .finally(() => {
        setIsLoading(false); // Set loading to false regardless of success or error
      });
  }, [id]);

  const deleteAmenity = async (id) => {
    try {
      const response = await Axios.delete(`/deleteOfferById/${id}`);
      if (response.status === 200) {
        console.log(`Amenity with id ${id} deleted successfully`);
      } else {
        console.error("Failed to delete amenity");
      }
    } catch (error) {
      console.error("Error deleting amenity:", error);
    }
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
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
        setApartment((prev) => ({
          ...prev,
          hosthomevideo: URL.createObjectURL(file),
        }));
        setSelectedVideo(file);

        // Remove existing video if there is one
        if (prev.hosthomevideo) {
          // Assuming hosthomevideo is a URL, you may need to adjust accordingly
          URL.revokeObjectURL(prev.hosthomevideo);
        }
      }
    };

    video.src = URL.createObjectURL(file);
  };

  const handleAddressChange = (address) => {
    setEnteredAddress(address);
  };

  const handleTimeChangeCheckOut = (e) => {
    setSelectedCheckOutTime(e.target.value);
  };

  const [housePrice, setHousePrice] = useState(""); // Add this line for the house price
  const [securityDeposit, setSecurityDeposit] = useState("");

  const handleSubmit = async () => {
    console.log(selectedCautionTypes);

    try {
      setIsSubmitting(true);

      async function getBase64ImageFromUrl(imageUrl) {
        var res = await fetch(imageUrl);
        var blob = await res.blob();

        return new Promise((resolve, reject) => {
          var reader = new FileReader();
          reader.addEventListener(
            "load",
            function () {
              resolve(reader.result);
            },
            false
          );

          reader.onerror = () => {
            return reject(this);
          };
          reader.readAsDataURL(blob);
        });
      }

      // getBase64ImageFromUrl(  apartment.hosthomephotos.map((photo) => photo.images))
      //     .then(result => console.log(result))
      //     .catch(err => console.error(err));
      // console.log(
      //   "Image URLs from hosthomephotos:",
      //   apartment.hosthomephotos.map((photo) => photo.images)
      // );
      const existingPhotosUrls = apartment.hosthomephotos.map(
        (photo) => photo.images
      );

      // Extract base64 data from newly uploaded images
      const newPhotosBase64 = uploadedImages.map((image) => image.src);

      // Combine existing photos URLs with newly uploaded photos base64 data
      const allPhotos = [...existingPhotosUrls, ...newPhotosBase64];

      const videoBase64 = apartment.hosthomevideo
        ? await new Promise((resolve) => {
            const reader = new FileReader();
            const videoBlob = new Blob([apartment.hosthomevideo], {
              type: "video/mp4",
            }); // Create a Blob from the video data
            reader.onload = (event) => resolve(event.target.result);
            reader.readAsDataURL(videoBlob); // Read the Blob as Data URL
          })
        : null;

      const selectedDescriptions = apartment.hosthomedescriptions.map(
        (item) => item.description
      );

      // const selectedRules = apartment.rules.map((item) => item.rule);

      const selectedReservations = apartment.reservations.map(
        (item) => item.reservation
      );

      const formDetails = {
        property_type: selectedHouseType || apartment.property_type,
        guest_choice: selectedPrivacyType || apartment.guest_choice,
        address: apartment.address,
        guest: apartment.guest,
        bedrooms: apartment.bedroom,
        beds: apartment.beds,
        bathrooms: apartment.bathrooms,
        amenities: selectedAmenities,
        hosthomephotos: newPhotosBase64,
        hosthomevideo: videoBase64, // Use the Object URL
        title: apartment.title,
        hosthomedescriptions: selectedDescriptions,
        description: houseDescriptionDetails,
        reservations: visiblities || [],
        reservation: selectedInstantBookType || [],
        price: housePrice || apartment.price,
        discounts: selectedDiscounts || apartment.discounts,
        rules: selectedRules || [],
        additionalRules: additionalRules || "none",
        host_type: selectedHostType,
        notice: selectedCautionTypes || [],
        checkin: selectedTime,
        cancelPolicy: selectedCancellationPolicy,
        securityDeposit: parseInt(securityDeposit),
        check_out_time: selectedCheckOutTime,
        host_home_id: parseInt(id),
      };
      console.log("Form submitted successfully", formDetails);

      // Example Axios post request
      console.log(id);
      const apartmentId = parseInt(id);
      await Axios.put(`/hosthomes/${apartmentId}`, formDetails);

      console.log("Form submitted successfully", formDetails);
      navigate("/hosting");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false); // Set the loader state back to false, whether the submission was successful or not
    }
  };

  const handleNext = () => {
    let isValid = true;

    switch (step) {
      case 2:
        if (!selectedHouseType && !apartment.property_type) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content: "Please select a house type.",
          });
          break;
        }
        break;

      case 3:
        if (!selectedPrivacyType && !apartment.guest_choice) {
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
          (!isGuestsSelected && apartment.guest < 1) ||
          (!isBedroomsSelected && apartment.bedroom < 1) ||
          (!isBedsSelected && apartment.beds < 1) ||
          (!isBathroomsSelected && apartment.bathrooms < 1)
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
        if (selectedAmenities.length === 0 && apartment.amenities === 0) {
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
        if (uploadedImages < 5 && apartment.hosthomephotos < 5) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please upload at least 5 photos before proceeding to the next step.",
          });
        }
        break;

      case 8:
        if (!selectedVideo && !apartment.hosthomevideo) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please upload a video before proceeding to the next step.",
          });
        }
        break;

      case 9:
        if (houseTitle.trim() === "" && apartment.title === "") {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a title for your house before proceeding to the next step.",
          });
        }
        break;

      case 10:
        if (
          selectedHouseDescriptions.length < 2 &&
          apartment.hosthomedescriptions.length < 2
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please choose at least two highlights for your house before proceeding to the next step.",
          });
        }
        break;
      case 11:
        if (
          houseDescriptionDetails.length === 0 ||
          (houseDescriptionDetails.length > 750 &&
            apartment.description.length === 0)
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a description within the character limit (1-750 characters) before proceeding to the next step.",
          });
          break;
        }
          break;

      case 12:
        // Check if housePrice is not a valid number or is less than or equal to 0
        if (
          isNaN(housePrice) ||
          (housePrice.length <= 4 && apartment.price.length <= 4)
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please enter a valid price before proceeding to the next step",
          });
          break;
        }
        break;

      case 13:
        // Check if at least one discount is selected
        if (
          selectedDiscounts.length === 0 &&
          apartment.discounts.length === 0 
        ) {
          isValid = false;
          Modal.error({
            title: "Validation Error",
            content:
              "Please select at least one discount before proceeding to the next step",
          });
          break;
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

  const handleDecrement = (property) => {
    setApartment((prev) => ({
      ...prev,
      [property]: Math.max(prev[property] - 1, 0),
    }));
  };

  const handleIncrement = (property) => {
    setApartment((prev) => ({
      ...prev,
      [property]: prev[property] + 1,
    }));
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
      id: "Security camera(s)",
      label: "An entire place",
      icon: <FaCamera />,
      description: "Guests can book automatically.",
    },
    {
      id: "Weapons",
      label: "A room",
      icon: <FaShieldAlt />,
      description: "Guests must ask if they can book.",
    },

    {
      id: "Dangerous Animal",
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
      id: "I'm hosting as a private individual",
      label: "An entire place",
      icon: <FaUser />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "I'm hosting as a business",
      label: "A room",
      icon: <FaUserFriends />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
  ];

  const HouseRules = {
    guests: "2 guests maximum",
    pets: "No pets",
    events: "No parties or events",
    smoking: "No smoking",
    partying: "No parties or events",
  };

  const houseDiscount = [
    {
      id: "20% New listing promotion",
      label: "An entire place",
      icon: <FaHome />,
      description: "Offer 20% off your first 3 bookings",
    },
    {
      id: "5% Weekly discount",
      label: "A room",
      icon: <FaHotel />,
      description: "For stays of 7 nights or more",
    },
    {
      id: "10% Monthly discount",
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

  const handleTypeSelection = (selectedType) => {
    setApartment((prev) => ({
      ...prev,
      property_type: selectedType,
    }));

    setSelectedHouseType(selectedType);
  };

  const handlePrivacyTypeSelection = (selectedType) => {
    setApartment((prev) => ({
      ...prev,
      guest_choice: selectedType,
    }));
    setSelectedPrivacyType(selectedType);
  };

  const handleAmenitySelection = (amenityId, apartmentId) => {
    setApartment((prev) => {
      const isAmenitySelected = prev.amenities.some(
        (amenity) => amenity.offer === amenityId
      );

      if (isAmenitySelected) {
        // If amenity is already selected, remove it
        const updatedAmenities = prev.amenities.filter(
          (amenity) => amenity.offer !== amenityId
        );
        console.log("Amenity unselected:", amenityId);
        // Send DELETE request to API
        Axios.delete(`deleteOfferById/${apartmentId}`)
          .then((response) => {
            console.log("Delete response:", response);
          })
          .catch((error) => {
            console.error("Error deleting offer:", error);
          });
        setSelectedAmenities((prevSelected) =>
          prevSelected.filter((selectedId) => selectedId !== amenityId)
        );
        return {
          ...prev,
          amenities: updatedAmenities,
        };
      } else {
        // If amenity is not selected, add it
        const updatedAmenities = [...prev.amenities, { offer: amenityId }];
        console.log("Amenity selected:", amenityId);
        setSelectedAmenities((prevSelected) => [...prevSelected, amenityId]);
        return {
          ...prev,
          amenities: updatedAmenities,
        };
      }
    });
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
  const handleHouseDescriptionSelection = (selectedType) => {
    // Check if the selectedType is already in the descriptions array
    const isAlreadySelected = apartment?.hosthomedescriptions.some(
      (description) => description.description === selectedType
    );

    // Track the unselected ID
    let unselectedId = null;

    // If it's already selected, remove it. Otherwise, add it.
    setApartment((prev) => {
      const updatedDescriptions = isAlreadySelected
        ? prev.hosthomedescriptions.filter((description) => {
            if (description.description === selectedType) {
              unselectedId = description.id; // Set the unselected ID
              return false; // Remove the selected description
            } else {
              return true; // Keep other descriptions
            }
          })
        : [...prev.hosthomedescriptions, { description: selectedType }];

      console.log("Unselected ID:", unselectedId);

      // Send DELETE request to API to delete description
      if (unselectedId) {
        Axios.delete(`deleteDescriptionById/${unselectedId}`)
          .then((response) => {
            console.log("Description deleted:", response);
          })
          .catch((error) => {
            console.error("Error deleting description:", error);
          });
      }

      return { ...prev, hosthomedescriptions: updatedDescriptions };
    });
  };

  useEffect(() => {
    // Set initially selected visibility from API
    // Assuming `apartment` is your API data structure
    if (apartment && apartment.reservations) {
      const initiallySelected = apartment.reservations.map(
        (reservation) => reservation.reservation
      );
      setSelectedWelcomeVisibility(initiallySelected);
    }
  }, [apartment]);

  const handleWelcomeVisibilitySelection = (selectedId) => {
    setSelectedWelcomeVisibility([selectedId]); // Set the selected item as the only item in the array
    setVisiblities([selectedId]); // Update apartment state accordingly
  };

  useEffect(() => {
    // Set initially selected type from API
    // Assuming `apartment` is your API data structure
    if (apartment && apartment.reservation) {
      setInitiallySelectedType(apartment.reservation);
      setSelectedInstantBookType(apartment.reservation);
    }
  }, [apartment]);

  const handleInstantBookSelection = (typeId) => {
    if (selectedInstantBookType !== null) {
      // Delete the previously selected reservation
      Axios.delete(`deleteReservationById/${selectedInstantBookType}`)
        .then((response) => {
          console.log("Previous reservation deleted:", response);
        })
        .catch((error) => {
          console.error("Error deleting previous reservation:", error);
        });
    }

    setSelectedInstantBookType(typeId);

    // Handle the selected instant booking option
    // For example, you can update state or perform other actions here
  };

  const handleCancellationPolicySelection = (selectedPolicy) => {
    setSelectedCancellationPolicy(selectedPolicy);
  };

  const handleDiscountSelection = (
    discountId,
    isSelected,
    matchingDiscount
  ) => {
    if (isSelected) {
      // If the discount is already selected, remove it
      const updatedDiscounts = apartment.discounts.filter(
        (discount) => discount.discount !== discountId
      );
      console.log("Discount unselected:", discountId);
      // Send DELETE request to API
      Axios.delete(`deleteDiscountById/${matchingDiscount.id}`)
        .then((response) => {
          console.log("Delete response:", response);
        })
        .catch((error) => {
          console.error("Error deleting discount:", error);
        });
      setApartment((prev) => ({
        ...prev,
        discounts: updatedDiscounts,
      }));
      setSelectedDiscounts([discountId]);
    } else {
      // If the discount is not selected, add it
      const updatedDiscounts = [
        ...apartment.discounts,
        { discount: discountId },
      ];
      console.log("Discount selected:", discountId);
      // Send POST request to API to add discount
      Axios.post("api/addDiscount", { discount: discountId })
        .then((response) => {
          console.log("Add response:", response);
        })
        .catch((error) => {
          console.error("Error adding discount:", error);
        });
      setApartment((prev) => ({
        ...prev,
        discounts: updatedDiscounts,
      }));
      setSelectedDiscounts([discountId]);
    }
  };

  const handleRuleSelection = (selectedRule) => {
    setSelectedRules((prevSelectedRules) => {
      const isRuleSelected = prevSelectedRules.includes(selectedRule);

      if (isRuleSelected) {
        // Deselect the rule if it was selected
        return prevSelectedRules.filter((rule) => rule !== selectedRule);
      } else {
        // Select the rule if it was not selected
        return [...prevSelectedRules, selectedRule];
      }
    });
  };

  const handleHostTypeSelection = (typeId) => {
    setSelectedHostType(typeId);
  };
  useEffect(() => {
    if (apartment && apartment.notices) {
      const notices = apartment.notices.map((notice) => notice.notice);
      const initialSelectedCautionTypes = caution.filter((type) =>
        notices.includes(type.id)
      );
      const initialSelectedIds = initialSelectedCautionTypes.map(
        (type) => type.id
      );
      setSelectedCautionTypes(initialSelectedIds);
    }
  }, [apartment]);

  // Function to handle caution type selection
  // Function to handle caution type selection
  const handleCautionTypeSelection = (id) => {
    setSelectedCautionTypes((prevSelectedCautionTypes) => {
      if (prevSelectedCautionTypes.includes(id)) {
        // If already selected, remove it
        return prevSelectedCautionTypes.filter((typeId) => typeId !== id);
      } else {
        // If not selected, add it
        return [...prevSelectedCautionTypes, id];
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

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const uploadedPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        uploadedPhotos.push({
          id: Date.now() + i, // Generate a unique id for each photo
          src: reader.result, // Base64 representation of the image
        });

        // Add the uploaded photo to the state
        setUploadedImages([...uploadedImages, ...uploadedPhotos]);
        // Add the uploaded photo to the newPhotos state
        setNewPhotos([...newPhotos, reader.result]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleImageDeletes = (id) => {
    // Filter out the deleted image from uploadedImages state
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image.id !== id)
    );

    // If apartment.hosthomephotos is an array, filter out the deleted image from it
    setApartment((prevApartment) => {
      if (Array.isArray(prevApartment.hosthomephotos)) {
        const updatedPhotos = prevApartment.hosthomephotos.filter(
          (photo) => photo.id !== id
        );
        return { ...prevApartment, hosthomephotos: updatedPhotos };
      }
      return prevApartment;
    });
  };

  const handleImageDelete = async (hostHomephotoId, e) => {
    try {
      e.preventDefault();
  
      // Make DELETE request to delete the image
      await Axios.delete(`/deleteHostHostHomeImages/${hostHomephotoId}`);
  
      // Remove the deleted image element from the DOM
      const imageElement = document.getElementById(`image-${hostHomephotoId}`);
      if (imageElement) {
        imageElement.remove();
      }
  
      // Show success notification
      notification.success({
        message: "Image Deleted",
        description: "The image has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
  
      // Show error notification
      notification.error({
        message: "Error Deleting Image",
        description: "There was an error deleting the image. Please try again.",
      });
    }
  };
  

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="mx-auto flex justify-center p-4">
            {isLoading ? (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bottom-0  z-50">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 50,
                      }}
                      spin
                    />
                  }
                />
              </div>
            ) : (
              // Render your component once data is loaded
              <div className="overflow-auto">
                <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                  <h1 className="text-6xl">
                    Which of these best describes your place?
                  </h1>
                </div>
                <div className="pb-32">
                  <div className="space-y-4">
                    <h3 className="text-xl">Property Types</h3>
                    <div className="flex flex-wrap w-full">
                      {propertyTypes.map((type) => (
                        <div
                          key={type.id}
                          className={`property-type h-26 w-32 m-3 flex ${
                            apartment?.property_type === type.id
                              ? "bg-orange-300 border-2 border-black text-white"
                              : "bg-gray-200 text-black"
                          } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                          onClick={() =>
                            handleTypeSelection(
                              type.id === apartment?.property_type
                                ? null
                                : type.id
                            )
                          }
                        >
                          <span className="mr-2 text-2xl">{type.icon}</span>
                          {type.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1:
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
                          apartment?.guest_choice === type.id
                            ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() =>
                          handlePrivacyTypeSelection(
                            type.id === apartment?.guest_choice ? null : type.id
                          )
                        }
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

      case 2:
        return (
          <AddressForm
            onAddressChange={handleAddressChange}
            defaultAddress={apartment?.address}
            
          />
        );

      case 3:
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
                        onClick={() => handleDecrement("guest")}
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="button"
                        x
                        className="w-8 text-center"
                        value={apartment.guest}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => handleIncrement("guest")}
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
                        onClick={() => handleDecrement("bedroom")}
                        type="button"
                        className="bg-gray-200 text-gray-700 rounded-full px-2"
                      >
                        -
                      </button>
                      <input
                        type="button"
                        className="w-8 text-center"
                        value={apartment.bedroom}
                        readOnly
                      />
                      <button
                        onClick={() => handleIncrement("bedroom")}
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
                        value={apartment.beds}
                        readOnly
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
                        value={apartment.bathrooms}
                        readOnly
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

      case 4:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">
                  Tell guests what your place has to offer
                </h1>
                <p className="text-gray-400 mt-10 text-lg">
                  You can add more amenities after you publish your listing.
                </p>
              </div>
              <div className="pb-32">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Amenities</h3>
                  <div className="flex flex-wrap w-full">
                    {amenities.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type h-26 w-32 m-3 flex ${
                          apartment?.amenities.some(
                            (amenity) => amenity.offer === type.id
                          )
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => {
                          console.log("Type ID:", type.id);
                          const selectedAmenity = apartment?.amenities.find(
                            (amenity) => amenity.offer === type.id
                          );
                          if (selectedAmenity) {
                            console.log(
                              "Amenity selected:",
                              selectedAmenity.id
                            );
                            handleAmenitySelection(type.id, selectedAmenity.id);
                          } else {
                            handleAmenitySelection(type.id, null); // Pass null or a non-existing id to indicate selection
                          }
                        }}
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

      case 5:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Add some photos of your house</h1>
                <p className="text-gray-400 mt-10">
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
                      <p className="text-sm font-bold text-xl">
                        Choose at least 5 photos
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        key={fileInputKey}
                        id={fileInputKey}
                      />
                    </label>
                  </div>

                  <p className="text-gray-400 font-bold">
                    Choose at least 5 photos
                  </p>
                </div>
                <div className="flex flex-wrap mt-6">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative p-2">
                      <img
                        src={image.src}
                        alt="Houses"
                        className="w-64 object-cover h-64"
                      />
                      <button
                        onClick={(e) => handleImageDeletes(image.id, e)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-300"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}

                  {Array.isArray(apartment?.hosthomephotos) &&
                    apartment.hosthomephotos.map((photo) => (
                      <div key={photo.id} className="relative p-2">
                        <img
                          src={photo.images}
                          alt="Houses"
                          className="w-64 object-cover h-64"
                        />
                        <button
                          onClick={(e) => handleImageDelete(photo.id, e)}
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

      case 6: // Step for hosting type and property features
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Upload Video Apartment on Shbro</h1>
                <p className="text-gray-400 mt-10">
                  Gives you a better chance of getting guests
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 max-w-md mx-auto mt-8">
                <div className="bg-white border p-4 rounded-lg shadow-md max-w-md mx-auto mt-8">
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

                  <p className="text-slate-500">Maximum file size: 20MB</p>
                  <p className="text-slate-500">Maximum duration: 1 minute</p>

                  {selectedVideo && (
                    <div className="mt-4">
                      <p className="text-lg font-semibold mb-2">
                        Selected Video: {selectedVideo.name}
                      </p>
                      <p className="text-slate-500">
                        Size: {(selectedVideo.size / (1024 * 1024)).toFixed(2)}{" "}
                        MB
                      </p>
                      <video controls className="mt-2">
                        <source
                          src={apartment.hosthomevideo}
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
                  )}

                  {/* Display existing video from fetched data */}
                  {apartment.hosthomevideo && (
                    <div className="mt-4">
                      <p className="text-lg font-semibold mb-2">
                        Existing Video: <br />
                        <p className="break-words">
                          {" "}
                          {apartment.hosthomevideo}
                        </p>
                      </p>
                      <video controls className="mt-2">
                        <source
                          src={apartment.hosthomevideo}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 7: // Step for adding a house title
        const maxCharacterCount = 50;
        const currentCharacterCount = apartment.title.length;
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
                <label htmlFor="houseTitle" className="sr-only">
                  Enter a title for your house
                </label>
                <input
                  type="text"
                  id="houseTitle"
                  className="border rounded-lg px-4 py-2 w-2/3 text-lg w-full"
                  placeholder="Enter a title for your house"
                  value={apartment.title}
                  onChange={(e) => {
                    const inputText = e.target.value;
                    if (inputText.length <= maxCharacterCount) {
                      setApartment((prev) => ({
                        ...prev,
                        title: inputText,
                      }));
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

      case 8:
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
                          apartment?.hosthomedescriptions.some(
                            (description) => description.description === type.id
                          )
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

      case 9:
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

      case 10:
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

      case 11:
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
                        className={`property-type m-3 flex ${
                          selectedWelcomeVisibility.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() =>
                          handleWelcomeVisibilitySelection(type.id)
                        }
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

      case 12:
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
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
                    onChange={(e) => setHousePrice(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 13: // Step for adding discounts
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Add discounts</h1>
                <p>
                  Help your place stand out to get booked faster and earn your
                  first reviews.
                </p>
              </div>
              <div className="pb-32">
                <div className="flex flex-wrap w-full">
                  {houseDiscount.map((type) => {
                    const cleanedTypeId = type.id.trim(); // Remove extra spaces

                    const isSelected = apartment?.discounts.some(
                      (discount) => discount.discount.trim() === cleanedTypeId
                    );

                    const matchingDiscount = apartment?.discounts.find(
                      (discount) => discount.discount.trim() === cleanedTypeId
                    );

                    return (
                      <div
                        key={type.id}
                        className={`property-type m-3 flex ${
                          isSelected
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => {
                          handleDiscountSelection(
                            type.id,
                            isSelected,
                            matchingDiscount
                          );
                        }}
                      >
                        <span className="mr-2 text-2xl">{type.icon}</span>
                        {type.id}
                        <div>{type.description}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 14: // Step for hosting type and property features
        const additionalRulesFromApartment =
          apartment?.rules.map((r) => r.rule) || [];

        const noRulesSelected = selectedRules.length === 0;

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
                {Object.keys(HouseRules).map((rule) => {
                  const isRuleSelected = selectedRules.includes(rule);
                  const isSelectedFromApi = apartment?.rules.some(
                    (r) => r.rule === rule
                  );

                  return (
                    <div
                      key={rule}
                      className={`property-type m-3 flex ${
                        isRuleSelected || isSelectedFromApi
                          ? "bg-orange-300 border-2 border-black text-white"
                          : "bg-gray-200 text-black"
                      } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                      onClick={() => {
                        console.log(`Clicked rule: ${rule}`);
                        handleRuleSelection(rule);
                      }}
                    >
                      <span className="mr-2 text-2xl">{rule}</span>
                      {HouseRules[rule]}
                    </div>
                  );
                })}
              </div>

              <div className="md:flex md:justify-center md:flex-col">
                <h1 className="text-2xl">Additional Rules</h1>
              </div>
              <div className="pb-32">
                {noRulesSelected ? (
                  <p className="text-gray-400">No additional rules selected</p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap w-full"></div>
                  </div>
                )}
                {additionalRulesFromApartment.length >
                  additionalRules.length && (
                  <div className="px-4">
                    <ul className="list-disc">
                      {/* Display additional rules only if there are more in the apartment object */}
                      {additionalRulesFromApartment
                        .slice(additionalRules.length)
                        .map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 15: // Step for hosting type and property features
        return (
          <div className="mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">How are you hosting on Shbro?</h1>
              </div>
              <div className="pb-32">
                <div className="space-y-4">
                  <div className="flex flex-wrap w-full">
                    {HostType.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type m-3 flex ${
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

              <div className="md:flex md:justify-center md:flex-col">
                <h1 className="text-2xl">Does your place have any of these?</h1>
              </div>
              <div className="pb-32">
                <div className="space-y-4">
                  <div className="flex flex-wrap w-full">
                    {caution.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type m-3 flex ${
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

      case 16: // Step for hosting type and property features
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
                    <option value={apartment.checkInTime}>2:00 PM</option>
                    {/* Add more time options as needed */}
                  </select>
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
          </div>
        );

      case 17:
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
                          selectedCancellationPolicy === policy.label
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
      case 18:
        return (
          <div className=" mx-auto  flex justify-center p-4">
            {isSubmitting && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-400 bg-opacity-80 z-50">
                <p className="text-xl text-gray-800">Loading...</p>
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
        {step < 18 && (
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
        {step === 18 && (
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
