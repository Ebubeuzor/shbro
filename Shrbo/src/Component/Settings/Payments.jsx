import React, { useState } from "react";
import { Link } from "react-router-dom";
import SettingsNavigation from "./SettingsNavigation";
import ChangePassword from "./ChangePassword";
import ATMCardForm from "./AtmCardForm";
import GoBackButton from "../GoBackButton";

export default function Payments() {
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isConfirmDeactivation, setIsConfirmDeactivation] = useState(false);
  const [isCardRemoved, setIsCardRemoved] = useState(false);

  const detailsArray = [
    {
      title: "Payment Cards",
      value: "Add New Payment Method",
      action: "Add",
      link: "/edit-name",
    },
    {
      title: "MasterCard ****4567",
      value: "Expiration: 02/24",
      action: "Remove Payment Method",
      link: "",
    },
  ];

  const removeCard = () => {
   
    setIsCardRemoved(true);
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4">
        <GoBackButton/>
        <SettingsNavigation title="Payments & payouts" text="Payments & payouts" />
        

        <div>
        <p className="text-gray-400 font-normal text-base my-4">Manage your payment methods and view your transaction history.
</p>

          <div className="tab">

            {isChangePassword && (
              <div className="max-w-2xl mx-auto p-4">
                <h2 className="text-2xl font-medium mb-4">Payment Card</h2>
                <ATMCardForm />
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
                  {detail.action === "Add" ? (
                    <button
                      className="underline"
                      onClick={() => setIsChangePassword(true)}
                    >
                      {detail.action}
                    </button>
                  ) : detail.action === "Remove" ? (
                    <>
                      <button className="underline" onClick={removeCard}>
                        {detail.action}
                      </button>
                      {isCardRemoved && (
                        <p className="text-green-500">Card removed successfully.</p>
                      )}
                    </>
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
