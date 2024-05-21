import React, { useState } from "react";
import { Input, Button,notification } from "antd";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "./AdminHeader";
import Axios from "../../../Axios"

const ServiceChargeSettings = () => {
  const [guestServiceCharge, setGuestServiceCharge] = useState(0);
  const [hostServiceCharge, setHostServiceCharge] = useState(0);
  const [taxServiceCharge, setTaxServiceCharge] = useState(0);


  const handleGuestServiceChargeChange = (value) => {
    setGuestServiceCharge(value);
  };

  const handleHostServiceChargeChange = (value) => {
    setHostServiceCharge(value);
  };

  const handleTaxServiceChargeChange = (value) => {
    setTaxServiceCharge(value);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await Axios.post("/updateServiceCharges", {
        guest_services_charge: guestServiceCharge,
        host_services_charge: hostServiceCharge,
        tax: taxServiceCharge,
      });
      notification.success({
        message: "Success",
        description: "Service charges updated successfully",
      });
      console.log("Service charges updated successfully:", response.data);
      // You can update your UI or show a success message here
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update service charges",
      });
      console.error("Failed to update service charges:", error);
      // Handle the error or show an error message to the user
    }
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
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
              The Service Charge Settings section is where you can view and potentially adjust the service charges applied to transactions on your platform.
              </p>
            </div>

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
              <label>Tax Service Charge:</label>
              <Input
                type="number"
                value={taxServiceCharge}
                onChange={(e) => handleTaxServiceChargeChange(e.target.value)}
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
