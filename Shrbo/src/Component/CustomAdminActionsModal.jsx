import React, { useState } from "react";
import Axios from "../Axios";
import { notification, Spin } from "antd";

const permissionsData = [
  { label: "Dashboard", value: "Dashboard" },
  { label: "Edit Homepage", value: "EditHomepage" },
  { label: "Manage Users", value: "ManageUsers" },
  { label: "Property", value: "Property" },
  { label: "Finance", value: "Finance" },
  { label: "Booking Status", value: "BookingStatus" },
  { label: "User Verification Page", value: "UserVerificationPage" },
  { label: "Canceled Reservation Table", value: "CanceledReservationTable" },
  { label: "Admin Roles", value: "AdminRoles" },
  { label: "Apartment Reporting", value: "ApartmentReporting" },
  { label: "Report Damages", value: "ReportDamages" },
  { label: "Announcement Page", value: "AnnouncementPage" },
  { label: "Communication Center", value: "CommunicationCenter" },
  { label: "Review List", value: "ReviewList" },
  { label: "User Verification Dashboard", value: "UserVerificationDashboard" },
  { label: "Service Charge", value: "ServiceCharge" },
  { label: "Security Deposit", value: "SecurityDeposit" },
  { label: "Admin User Reports", value: "AdminUserReports" },
  { label: "Social Link", value: "SocialLink" },

];

const specialPermissions = [
  "UserVerificationDashboard", "ServiceCharge", "AnnouncementPage", "ReportDamages", "CommunicationCenter",
  "ApartmentReporting", "EditHomepage", "ManageUsers", "Property", "Finance",
  "CanceledReservationTable", "UserVerificationPage", "BookingStatus", "AdminRoles", "ReviewList"
];

const CustomAdminActionsModal = ({
  visible,
  onCancel,
  onSubmit,
  selectedPermissions: initialSelectedPermissions = [],
  onPermissionsChange,
  adminRolesPermissions = [],
  userId,
}) => {
  const [permissions, setPermissions] = useState(initialSelectedPermissions);
  const [selectedPermissions, setSelectedPermissions] = useState(initialSelectedPermissions);
  const [loading, setLoading] = useState(false);

  const handlePermissionChange = async (permission) => {
    const isSelected = permissions.includes(permission);
    const isSelectedSpecial = selectedPermissions.includes(permission);
    let updatedPermissions;
    let updatedSelectedPermissions;

    if (isSelectedSpecial) {
      updatedSelectedPermissions = selectedPermissions.filter((p) => p !== permission);
    } else {
      updatedSelectedPermissions = [...selectedPermissions, permission];
    }

    if (isSelected) {
      updatedPermissions = permissions.filter((p) => p !== permission);
    } else {
      updatedPermissions = [...permissions, permission];
    }

    setPermissions(updatedPermissions);
    setSelectedPermissions(updatedSelectedPermissions);
    onPermissionsChange(updatedPermissions);

    const isAdminRolePermission = adminRolesPermissions.includes(permission);
    if (isAdminRolePermission) {
      try {
        if (userId) {
          setLoading(true);
          await unassignPermissionFromAdmin(userId, permission, updatedPermissions, updatedSelectedPermissions);
          setLoading(false);
        } else {
          console.error("Error: userId is not defined");
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    }
  };

  const unassignPermissionFromAdmin = async (userId, permission, updatedPermissions, updatedSelectedPermissions) => {
    try {
      const response = await Axios.delete(`/unassignRolesFromAdmin/${userId}?permission=${permission}`);
      if (response.status === 200) {
        notification.success({
          message: "Permission Removed",
          description: `The permission ${permission} has been removed successfully.`,
        });
        setPermissions(updatedPermissions);
        setSelectedPermissions(updatedSelectedPermissions);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isSpecialPermission = (permission) => specialPermissions.includes(permission);

  return (
    <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center ${visible ? "" : "hidden"}`}>
      <div className="bg-white overflow-scroll h-[90vh] example md:h-fit p-8 rounded shadow-lg md:w-[70%]">
        <h2 className="text-lg font-semibold mb-4">Select Admin Role Permissions</h2>
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
            <Spin size="large" />
          </div>
        )}
        <div className="space-y-2 flex flex-wrap gap-5">
          {permissionsData.map(({ label, value }) => (
            <div
              key={value}
              className={`cursor-pointer p-4 border ${
                permissions.includes(value) || selectedPermissions.includes(value)
                  ? "bg-orange-200"
                  : adminRolesPermissions.includes(value)
                  ? "bg-orange-200"
                  : "bg-white"
              }`}
              onClick={() => handlePermissionChange(value)}
            >
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" onClick={onCancel}>Cancel</button>
          <button className="bg-orange-400 text-white px-4 py-2 rounded" onClick={() => onSubmit(permissions)}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default CustomAdminActionsModal;
