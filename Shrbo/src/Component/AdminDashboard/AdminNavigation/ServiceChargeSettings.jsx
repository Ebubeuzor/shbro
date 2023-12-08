import React, { useState } from "react";
import { Input, Button } from "antd";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "./AdminHeader";

const ServiceChargeSettings = () => {
  const [guestServiceCharge, setGuestServiceCharge] = useState(0);
  const [hostServiceCharge, setHostServiceCharge] = useState(0);

  const handleGuestServiceChargeChange = (value) => {
    setGuestServiceCharge(value);
  };

  const handleHostServiceChargeChange = (value) => {
    setHostServiceCharge(value);
  };

  const handleSaveChanges = () => {
    // Implement logic to save the updated service charges to the backend
    console.log("Guest Service Charge:", guestServiceCharge);
    console.log("Host Service Charge:", hostServiceCharge);
    // You can make API calls to update the service charges in your backend here
  };

  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h2 className="text-2xl font-semibold mb-4">
              Service Charge Settings
            </h2>

            <div>
              <label>Guest Service Charge:</label>
              <Input
                type="number"
                value={guestServiceCharge}
                onChange={(e) => handleGuestServiceChargeChange(e.target.value)}
              />
            </div>
            <div>
              <label>Host Service Charge:</label>
              <Input
                type="number"
                value={hostServiceCharge}
                onChange={(e) => handleHostServiceChargeChange(e.target.value)}
              />
            </div>
            <div>
              {" "}
              <br />
              <Button type="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceChargeSettings;
