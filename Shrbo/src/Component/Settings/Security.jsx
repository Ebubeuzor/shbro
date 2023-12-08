import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SettingsNavigation from "./SettingsNavigation";
import ChangePassword from "./ChangePassword";
import GoBackButton from "../GoBackButton";
import axiosClient from "../../axoisClient";
import { useStateContext } from "../../context/ContextProvider";

export default function Security() {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isConfirmDeactivation, setIsConfirmDeactivation] = useState(false);
  const [error, setError] = useState({__html: ""});
  const {user,setUser,token} = useStateContext();
  
  const getUserInfo = () => {
    axiosClient.get('user')
    .then((data) => {
      setUser(data.data);
    })
  }
  
  useEffect(() => {
    getUserInfo();
  },[]);
  const detailsArray = [
    {
      title: "Login",
      value: "Password",
      action: "Update",
      link: "/edit-name",
    },

    {
      title: " Account",
      value: "Deactivate your account",
      action: "Deactivate Account",
    },
  ];

  const changeUserPassword = (updatedPasswordData) => {
    console.log("Updated Password Data:", updatedPasswordData);
    
    axiosClient.post('/changePassword',updatedPasswordData)
    .then((data) => {
      setIsChangePassword(false);
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
  }

  
  const disabled = user.google_id == null ? false : true;


  return (
    <div>
      <div className="max-w-2xl mx-auto p-4">
        <GoBackButton/>
        <SettingsNavigation title="Login & security" text="Login & security" />

        <div>
        <p className="text-gray-400 font-normal text-base my-4">        Enhance the security of your account with password and login management options.
</p>

          <div className="tab">
            {isChangePassword && (
              <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-medium mb-4">Change Password</h2>
                <ChangePassword
                  error={error}
                  onCancel={() => setIsChangePassword(false)}
                  onSave={changeUserPassword}
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
                  {detail.action === "Update" ? (
                    <button
                      className="underline"
                      disabled={disabled}
                      onClick={() => setIsChangePassword(true)}
                    >
                      {detail.action}
                    </button>
                  ) : detail.action === "Deactivate Account" ? (
                    <>
                      <button
                        className="underline"
                        onClick={() => setIsConfirmDeactivation(true)}
                      >
                        {detail.action}
                      </button>
                    </>
                  ) : (
                    <Link className="underline" to={detail.link}>
                      {detail.action}
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {isConfirmDeactivation && (
              <div className="bg-white border rounded-md p-4 mt-2">
                <p>Are you sure you want to deactivate your account?</p>
                <button
                  className="bg-red-500 text-white rounded-md py-2 px-4 mt-2"
                  onClick={() => {
                    console.log("Account Deactivated");
                    setIsConfirmDeactivation(false);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="text-gray-500 ml-2 mt-2"
                  onClick={() => setIsConfirmDeactivation(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
