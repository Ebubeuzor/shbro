import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SettingsNavigation from "./SettingsNavigation";
import EditLegalNameForm from "./EditLegalFormName";
import EditEmailAddress from "./EditEmailAddress";
import EditPhoneNumber from "./EditPhoneNumber";
import AddressForm from "./AddressForm";
import BottomNavigation from "../Navigation/BottomNavigation";
import Header from "../Navigation/Header";
import Footer from "../Navigation/Footer";
import GoBackButton from "../GoBackButton";
import axiosClient from "../../axoisClient";
import { useStateContext } from "../../context/ContextProvider";
import EditEmergencyNumber from "./EditEmergencyNumber";

export default function Profile() {
  const {user,setUser,token} = useStateContext();
  const [isEditingLegalName, setIsEditingLegalName] = useState(false);
  const [isEditingEmailName, setIsEditingEmailName] = useState(false);
  const [isEditingPhoneNumber, setIsEditingPhoneNumber] = useState(false);
  const [isEditingEnumber, setIsEditingEnumber] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  
  const getUserInfo = () => {
    axiosClient.get('user')
      .then((data) => {
        setUser(data.data);
      })
  }

  useEffect(() => {
    getUserInfo();
  },[]);

  const updateUserInfo = (data) =>{
    axiosClient.put(`/userDetail/${user.id}`,data)
    .then(() => {
      getUserInfo();
      console.log("done");
    }).catch((e) =>{
      console.log(e);
    })
  };

  const handleSaveLegalName = (updatedLegalName) => {
    console.log("Legal Name Updated:", updatedLegalName);
    updateUserInfo(updatedLegalName);
    setIsEditingLegalName(false);
  };

  const handleSaveEmailAddress = (updatedEmailAddress) => {
    console.log("Email Address Updated:", updatedEmailAddress);
    updateUserInfo(updatedEmailAddress)
    setIsEditingEmailName(false);
  };

  const handleSavePhoneNumber = (updatedPhoneNumber) => {
    console.log("Phone number Updated:", updatedPhoneNumber);
    updateUserInfo(updatedPhoneNumber)
    setIsEditingPhoneNumber(false);
  };

  const handleSaveENumber = (updatedPhoneNumber) => {
    console.log("Phone number Updated:", updatedPhoneNumber);
    updateUserInfo(updatedPhoneNumber)
    setIsEditingEnumber(false);
  };

  const handleSaveAddress = (updatedAddress) => {
    console.log("Address Updated:", updatedAddress);
    updateUserInfo(updatedAddress)
    setIsEditingAddress(false);
  };

  const government_id = user.government_id != null ? "Provided" : "Not Provided";
  const useraddress = user.country != null ? "Provided" : "Not Provided";
  const emergency_no = user.emergency_no != null ? "Provided" : "Not Provided";

  const detailsArray = [
    {
      title: "Legal name",
      value: user.name,
      action: "Edit",
      link: "/edit-name",
    },
    {
      title: "Email address",
      value: user.email,
      action: "Edit",
      link: "/edit-email",
    },
    {
      title: "Phone number",
      value: user.phone,
      action: "Edit",
      link: "/edit-phone-number",
    },
    {
      title: "Government ID",
      value: government_id,
      action: "Add",
      link: "/AddGovvernmentId",
    },
    {
      title: "Address",
      value: useraddress,
      action: "Edit",
      link: "/edit-address",
    },
    {
      title: "Emergency contact",
      value: emergency_no,
      action: "Edit",
      link: "/add-emergency-contact",
    },
  ];

  return (
    <div>
      <div className="pb-48">
      <Header/>
      <div className="max-w-2xl mx-auto  p-4">
        <GoBackButton/>
        <SettingsNavigation title="Personal Info" text="Personal info" />

        <div>
          <p className="text-gray-400 font-normal text-base my-4">Here, you can manage your personal information and account preferences for a tailored experience with Shrbo.</p>
          <div className="tab">
            {isEditingLegalName && (
              <div className="max-w-2xl mx-auto p-4 shadow-md">
                <h2 className="text-2xl font-medium mb-4">Edit Legal Name</h2>
                <EditLegalNameForm
                  onCancel={() => setIsEditingLegalName(false)}
                  onSave={handleSaveLegalName}
                />
              </div>
            )}

            {isEditingEmailName && (
              <div className="max-w-2xl mx-auto p-4 shadow-md">
                <h2 className="text-2xl font-medium mb-4">
                  Edit Email Address
                </h2>
                <EditEmailAddress
                  onCancel={() => setIsEditingEmailName(false)}
                  onSave={handleSaveEmailAddress}
                />
              </div>
            )}

            {isEditingPhoneNumber && (
              <div className="max-w-2xl mx-auto p-4 shadow-md">
                <h2 className="text-2xl font-medium mb-4">Edit Phone Number</h2>
                <EditPhoneNumber
                  onCancel={() => setIsEditingPhoneNumber(false)}
                  onSave={handleSavePhoneNumber}
                />
              </div>
            )}

            {isEditingEnumber && (
              <div className="max-w-2xl mx-auto p-4 shadow-md">
                <h2 className="text-2xl font-medium mb-4">Edit Emergency Number</h2>
                <EditEmergencyNumber
                  onCancel={() => setIsEditingEnumber(false)}
                  onSave={handleSaveENumber}
                />
              </div>
            )}

            {isEditingAddress && (
              <div className="max-w-2xl mx-auto p-4 shadow-md">
                <h2 className="text-2xl font-medium mb-4">Edit Address</h2>
                <AddressForm
                  onCancel={() => setIsEditingAddress(false)}
                  onSave={handleSaveAddress}
                />
              </div>
            )}

            {detailsArray.map((detail, index) => (
              <div
                className="flex justify-between items-center py-5 border-b"
                key={index}
              >
                <div>
                  <div>
                    <section>
                      <h2>{detail.title}</h2>
                    </section>
                  </div>
                  <div>
                    <span>{detail.value}</span>
                  </div>
                </div>
                <div>
                  {detail.action === "Edit" ? (
                    <button
                      className="underline"
                      onClick={() => {
                        if (detail.link === "/edit-name") {
                          setIsEditingLegalName(true);
                        } else if (detail.link === "/edit-email") {
                          setIsEditingEmailName(true);
                        } else if (detail.link === "/edit-phone-number") {
                          setIsEditingPhoneNumber(true);
                        } else if (detail.link === "/edit-address") {
                          setIsEditingAddress(true);
                        } else if (detail.link === "/add-emergency-contact") {
                          setIsEditingEnumber(true);
                        }
                      }}
                    >
                      Edit
                    </button>
                  ) : (
                    <Link className="underline" to={detail.link}>
                      Add
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      <BottomNavigation/>
      <Footer/>
    </div>
  );
}
