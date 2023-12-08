import React, { useState } from "react";
import { FaHome, FaHotel, FaBed, FaBuilding, FaTrash } from "react-icons/fa";
import AddressForm from "../AddressFrom";
import axiosClient from "../../axoisClient";
export default function HostHomes() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [firstReservation, setFirstReservation] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [step, setStep] = useState(0);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedImagesUrl, setUploadedImagesUrl] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [houseTitle, setHouseTitle] = useState("");
  const [hosttype, setHosttype] = useState("");
  const [houseDescriptions, setHouseDescriptions] = useState("");
  const [hosthomedescriptions, setHosthomedescriptions] = useState([]);
  const [additionalRules, setAdditionalRules] = useState("");
  const [rules, setRules] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedTime, setSelectedTime] = useState("12:00 PM");
  const [selectedHouseTypeLabel, setSelectedHouseTypeLabel] = useState("");
  const [selectedPrivacyTypeLabel, setSelectedPrivacyTypeLabel] = useState("");
  const [confirmReservations, setConfirmReservations] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [offers, setOffers] = useState([]);

  const [error, setError] = useState({__html: ""});

  const handleAdditionalRules = (newValue) => {
    setAdditionalRules(newValue);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
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
      e.target.value = null;
      return;
    }
  
    const reader = new FileReader();
    const video = document.createElement("video");
  
    reader.onloadend = () => {
      video.onloadedmetadata = () => {
        if (video.duration > 60) {
          alert("Video duration exceeds 1 minute limit.");
          e.target.value = null;
          setSelectedVideo(null);
          setSelectedVideoUrl(null);
        } else {
          setSelectedVideo(file);
          setSelectedVideoUrl(reader.result);
        }
      };
  
      video.src = reader.result;
    };
  
    reader.readAsDataURL(file);
  };
  

  const [housePrice, setHousePrice] = useState(""); // Add this line for the house price
  const [securityDeposit, setSecurityDeposit] = useState(""); 
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Log the submitted data when the submit button is clicked

    console.log("Submitted Data:");
    
    const data = {
      "property_type" : selectedHouseTypeLabel,
      "guest_choice" : selectedPrivacyTypeLabel,
      "address" : address,
      "guest" : guestDetails.guests,
      "bedrooms" : guestDetails.bedrooms,
      "beds" : guestDetails.beds,
      "bathrooms" : guestDetails.bathrooms,
      "amenities" : selectedAmenities,
      "hosthomevideo" : selectedVideo,
      "title" : houseTitle,
      "hosthomedescriptions" : hosthomedescriptions,
      "description" : houseDescriptions,
      "reservation" : confirmReservations,
      "reservations" : firstReservation,
      "price" : housePrice,
      "discounts" : discounts,
      "rules" : rules,
      "additionalRule" : additionalRules,
      "host_type" : hosttype,
      "hosthomephotos" : uploadedImages,
      "hosthomevideo" : selectedVideo,
      selectedVideoUrl,
      "notice" : offers,
      "checkin" : selectedTime,
      "cancelPolicy" : selectedPolicy,
      "securityDeposit" : securityDeposit,

    }

    data.hosthomevideo = data.selectedVideoUrl;

    if (uploadedImages.length > 0) {
      data.hosthomephotos = uploadedImages;
    } else {
      delete data.hosthomephotos;
      data.hosthomephotos = [];
    }
    console.log(data);
    axiosClient.post("hosthomes",data)
    .then((d) => {
      console.log(d);
    })
    .catch((error) => {
      if (error.response && error.response.status === 422) {
        if (error.response.data.errors) {
          const finalError = Object.values(error.response.data.errors).reduce((accum, next) => [
            ...accum, ...next
          ], []);
          setError({ __html: finalError.join("<br/>") });
        } else {
          const finalError = Object.values(error.response.data.message).reduce((accum, next) => [
            ...accum, ...next
          ], []);
          setError({ __html: finalError.join("") });
        }
      }
    });
  };

  console.log(selectedVideo);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleIncrement = (field) => {
    setGuestDetails({ ...guestDetails, [field]: guestDetails[field] + 1 });
  };

  const handleDecrement = (field) => {
    if (guestDetails[field] > 0) {
      setGuestDetails({ ...guestDetails, [field]: guestDetails[field] - 1 });
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

  // Function to handle changes in guest details
  const handleGuestDetailsChange = (field, value) => {
    setGuestDetails({ ...guestDetails, [field]: value });
  };

  const propertyTypes = [
    { id: "house", label: "House", icon: <FaHome /> },
    { id: "hotel", label: "Hotel", icon: <FaHotel /> },
    { id: "guestHouse", label: "Guest House", icon: <FaBed /> },
    { id: "apartment", label: "Apartment", icon: <FaBuilding /> },
  ];

  const privacyTypes = [
    {
      id: "house",
      label: "An entire place",
      icon: <FaHome />,
      description: "Guests have the whole place to themselves.",
    },
    {
      id: "hotel",
      label: "A room",
      icon: <FaHotel />,
      description: "Guests have the whole place to themselves.",
    },

    {
      id: "guestHouse",
      label: "A shared room",
      icon: <FaBed />,
      description: "Guests have the whole place to themselves.",
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
      id: "Security camera(s) ",
      label: "An entire place",
      icon: <FaHome />,
      description: "Guests can book automatically.",
    },
    {
      id: "Weapons",
      label: "A room",
      icon: <FaHotel />,
      description: "Guests must ask if they can book.",
    },

    {
      id: "Dangerous Animal",
      label: "A room",
      icon: <FaHotel />,
      description: "Guests must ask if they can book.",
    },
  ];

  const amenities = [
    {
      id: "Wifi",
      label: "An entire place",
      icon: <FaHome />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "TV",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Kitchen",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Washer",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },

    {
      id: "Air conditioning",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Free parking on premises",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },

    {
      id: "Pool",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Hot tub",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },

    {
      id: "Fire pit",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "Indoor fireplace",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },

    {
      id: "Smoke Alarm",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "first aid kit",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },

    {
      id: "fire extinguisher",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
    {
      id: "smoke alarm",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
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
      icon: <FaHome />,
      description:
        "Get reservations faster when you welcome anyone from the Shbro community.",
    },
    {
      id: "              I'm hosting as a business  ",
      label: "A room",
      icon: <FaHotel />,
      description:
        "For your first guest, welcome someone with a good track record on Shbro who can offer tips for how to be a great Host.",
    },
  ];

  const HouseRules = {
    guests: "2 guests maximum",
    pets: "No pets",
    events: "No events",
    smoking: "No smoking",
    partying: "No parties ",
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
    const selectedType = propertyTypes.find((type) => type.id === typeId);
    setSelectedHouseTypeLabel(selectedType ? selectedType.label : "");
    setSelectedTypes([typeId]);
  };

  const handleHosttype = (typeId) => {
    setSelectedTypes([typeId]);
    setHosttype(typeId);
  };

  const handlePrivacyTypeSelection = (typeId) => {
    setSelectedTypes([typeId]);
    setSelectedPrivacyTypeLabel(
      privacyTypes.find((type) => type.id === typeId)?.label || ""
    );
  };

  const handleCancellationPolicySelection = (policyId) => {
    console.log("Selected Cancellation Policy ID:", policyId);
    setSelectedPolicy(policyId);
  };

  const handleTypeSelections = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter((type) => type !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleOffers = (typeId) => {
    if (offers.includes(typeId)) {
      setOffers(offers.filter((type) => type !== typeId));
    } else {
      setOffers([...offers, typeId]);
    }
  };
  
  const handleRulesSelections = (typeId) => {
    if (rules.includes(HouseRules[typeId])) {
      setRules(rules.filter((type) => type !== HouseRules[typeId]));
    } else {
      setRules([...rules, HouseRules[typeId]]);
    }
  };

  const handleDiscountChange = (typeId) => {
    if (discounts.includes(typeId)) {
      setDiscounts(discounts.filter((type) => type !== typeId));
    } else {
      setDiscounts([...discounts, typeId]);
    }
  };

  const handleTypeAmenities = (typeId) => {
    if (selectedAmenities.includes(typeId)) {
      setSelectedAmenities(selectedAmenities.filter((type) => type !== typeId));
    } else {
      setSelectedAmenities([...selectedAmenities, typeId]);
    }
  };

  const handlehosthomedescriptions = (typeId) => {
    if (hosthomedescriptions.includes(typeId)) {
      setHosthomedescriptions(hosthomedescriptions.filter((type) => type !== typeId));
    } else {
      setHosthomedescriptions([...hosthomedescriptions, typeId]);
    }
  };
  
  const handleWelcomeSelection = (selectedId) => {
    // Check if the selected option is already in the selectedTypes state
    if (firstReservation.includes(selectedId)) {
      // If it's already selected, remove it from the firstReservation state
      setFirstReservation(firstReservation.filter((id) => id !== selectedId));
    } else {
      // If it's not selected, add it to the firstReservation state
      setFirstReservation([...firstReservation, selectedId]);
    }
    console.log(selectedId);
  };


  const handlePolicySelection = (id) => {
    setSelectedPolicy(id);
  };

  const logSelectedAmenities = () => {
    console.log("Selected Amenities:");
    amenities.forEach((amenity) => {
      if (selectedTypes.includes(amenity.id)) {
        console.log(amenity.id);
      }
    });
  };

  const logUploadedImages = () => {
    console.log("Uploaded Images:");
    uploadedImages.forEach((image) => {
      console.log("Image ID:", image.id);
      console.log("Image Source:", image.src);
      // Add more image-related data as needed
    });
  };

  const logSelectedVideo = () => {
    if (selectedVideo) {
      console.log("Selected Video Data:");
      console.log("Video Name: " + selectedVideo.name);
      console.log(
        "Video Size (MB): " + (selectedVideo.size / (1024 * 1024)).toFixed(2)
      );
      // Add more video-related data as needed
    }
  };

  function logSelectedHouseDescription(descriptionItems) {
    console.log("Selected House Description:");
    descriptionItems.forEach((type) => {
      if (selectedTypes.includes(type.id)) {
        console.log(type.id);
      }
    });
  }

  const handleConfirmReservationSelection = (typeId) => {
    setSelectedTypes([typeId]);
    // Toggle the selected state of the typeId
    const updatedSelectedType = selectedType === typeId ? null : typeId;


    // Log the selected options
    console.log(firstReservation);

    // Update the selected types state
    setConfirmReservations(updatedSelectedType);
  };

  const addressFields = [
    { id: "street", label: "Street Address" },
    { id: "city", label: "City" },
    { id: "state", label: "State" },
    { id: "zipcode", label: "Zip Code" },
  ];

  // Create state to store address information
  const [address, setAddress] = useState("");

  // Function to handle address field changes
  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        newImages.push( event.target.result);
        if (newImages.length === files.length) {
          setUploadedImages((uploadedImages) => [...uploadedImages, ...newImages]);
          setUploadedImagesUrl((uploadedImages) => [...uploadedImages, ...newImages]);
        }

        e.target.value = '';
      };

      reader.readAsDataURL(file);
    }

    // Reset the file input field
    setFileInputKey(fileInputKey + 1);
  };

  console.log(uploadedImages);

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
                <h1 className="text-6xl">It’s easy to get started on Shbro</h1>
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
                        className={`property-type h-24  w-32 m-3   flex ${
                          selectedTypes.includes(type.id)
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
                        className={`property-type   m-3   flex ${
                          selectedTypes.includes(type.id)
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
        return (
          <AddressForm
            addressFields={addressFields}
            handleAddressChange={handleAddressChange}
          />
        );

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
                        className={`property-type h-24  w-32 m-3   flex ${
                          selectedAmenities.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleTypeAmenities(type.id)}
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
          <div className=" mx-auto flex justify-center p-4">
            <div className="overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-10">
                <h1 className="text-6xl">Add some photos of your house</h1>
                <p className="text-gray-400 mt-10">
                  You can add more or make changes later.
                </p>
              </div>
              <div className="pb-32">
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 p-8 my-6">
                    <p className="text-gray-400 mb-4">Drag your photos here</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      key={fileInputKey}
                    />
                  </div>
                  <p className="text-gray-400">Choose at least 5 photos</p>
                </div>
                <div className="flex flex-wrap mt-6">
                  {uploadedImages.map((image,index) => (
                    <div key={index} className="relative  p-2">
                      <img
                        src={image}
                        alt="House"
                        className="w-64 object-cover h-64"
                      />
                      <button
                        onClick={() => handleImageDelete(index)}
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

      case 8: // Step for hosting type and property features
        return (
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">Upload Video Apartment on Shbro</h1>
                <p className="text-gray-400 mt-10">
                  Gives you a better chance of getting guests
                </p>
              </div>
              <div className="bg-white border p-4 rounded-lg shadow-md max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="mb-4"
                />
                <p className="text-slate-500">Maximum file size: 20MB</p>
                <p className="text-slate-500">Maximum duration: 1 minute</p>

                {selectedVideo && (
                  <div className="mt-4">
                    <p className="text-lg font-semibold mb-2">
                      Selected Video: {selectedVideo.name}
                    </p>
                    <p className="text-slate-500">
                      Size: {(selectedVideo.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <video controls className="mt-2">
                      <source
                        src={selectedVideoUrl}
                        type="video/mp4"
                      />
                    </video>
                    <button
                      // onClick={handleRemoveVideo}
                      className="bg-red-500 text-white py-2 px-4 mt-4 rounded-full hover:bg-red-600"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 9: // Step for adding a house title
        const maxCharacterCount = 32;
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
                        className={`property-type h-24  w-32 m-3   flex ${
                          hosthomedescriptions.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handlehosthomedescriptions(type.id)}
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
        const maxCharCount = 500;
        const currentCharCount = houseDescriptions.length;
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
                  value={houseDescriptions} // Use houseDescription here
                  onChange={(e) => {
                    const inputText = e.target.value;
                    if (inputText.length <= maxCharCount) {
                      setHouseDescriptions(inputText); // Update houseDescription state
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
          <div className=" mx-auto  flex justify-center p-4">
            <div className="  overflow-auto">
              <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                <h1 className="text-6xl">
                  Decide how you’ll confirm reservations
                </h1>
              </div>
              <div className="pb-32">
                <div className=" space-y-4">
                  <div className="flex flex-wrap   w-full">
                    {instantBook.map((type) => (
                      <div
                        key={type.id}
                        className={`property-type  m-3   flex ${
                          selectedTypes.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleConfirmReservationSelection(type.id)}
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
                          firstReservation.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleWelcomeSelection(type.id)}
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
                          discounts.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleDiscountChange(type.id)}
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
              <div className="pb-32">
                <div className="space-y-4">
                  <div className="flex flex-wrap w-full">
                    {Object.keys(HouseRules).map((rule) => (
                      <div
                        key={rule}
                        className={`property-type  m-3   flex ${
                          rules.includes(HouseRules[rule])
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleRulesSelections(rule)}
                      >
                        <span className="mr-2 text-2xl">{rule}</span>
                        {HouseRules[rule]}
                      </div>
                    ))}
                  </div>
                </div>
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
                      onChange={(e) => handleAdditionalRules(e.target.value)}
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
                          selectedTypes.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleHosttype(type.id)}
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
                          offers.includes(type.id)
                            ? "bg-orange-300 border-2 border-black text-white"
                            : "bg-gray-200 text-black"
                        } px-4 py-2 rounded-md cursor-pointer flex-col justify-between`}
                        onClick={() => handleOffers(type.id)}
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
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    {/* Add more time options as needed */}
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  className="bg-orange-400 text-white py-2 px-4 rounded-full hover:bg-orange-600"
                >
                  Save Check-In Time
                </button>
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
                          {" "}
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
              <div className="  overflow-auto">
                <div className="md:flex md:justify-center md:flex-col md:mt-28 mb-20">
                  {
                    error.__html && (
                        <div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>

                        </div>
                    )
                  } 
                  
                  <h1 className="text-6xl">Now, set your Security Deposit</h1>
                  <p className="text-gray-400 mt-10">
                    You can change it anytime.
                  </p>
                  <p className="text-gray-400 mt-10">
                   Adding security depsoit is optional you can choose to leave it blank
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
            className="text-white text-center  bg-orange-400 w-full p-4"
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
    </form>
  );
}
