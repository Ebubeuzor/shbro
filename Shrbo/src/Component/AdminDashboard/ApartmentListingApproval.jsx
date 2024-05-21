import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table, Button, Input, Modal, Spin, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axoisInstance from "../../Axios";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";


const { confirm } = Modal;

export default function ApartmentListingApproval() {
  const [apartments, setApartments] = useState([]);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Initialize with an empty string
  const [loading, setLoading] = useState(true);

  // Sample data for demonstration purposes
  const sampleApartments = [];

  useEffect(() => {
    axoisInstance
      .get("/notVerified")
      .then((response) => {
        setApartments(response.data.data);
        // console.log(response.data.data);
        // console.log(apartments);
        setLoading(false);
      })

      .catch((error) => {
        console.log("Error fetching hosts:", error);
        setLoading(false);
      });
  }, []);

  const showDeclineModal = (apartmentId) => {
    setDeclineModalVisible(true);
    setSelectedApartmentId(apartmentId);
  };

  const hideDeclineModal = () => {
    setDeclineModalVisible(false);
    setSelectedApartmentId(null);
    setDeclineReason("");
  };

  const handleDeclineReasonChange = (event) => {
    setDeclineReason(event.target.value);
  };

  const handleDecline = async () => {
    try {
      // Check if a decline reason is provided
      if (!declineReason) {
        // If no reason is provided, show a message and prevent further action
        notification.warning({
          message: "Warning",
          description: "Please provide a reason for declining.",
        });
        return;
      }

      // Find the selected apartment based on its ID
      const selectedApartment = apartments.find(
        (apt) => apt.id === selectedApartmentId
      );

      // Extract necessary values from the selected apartment object
      const { user, id: apartmentId } = selectedApartment;
      console.log("User ID:", user.id);


      // Send a request to decline the apartment
      await axoisInstance.put(`/disapproveHome/${user.id}/${apartmentId}`, {
        message: declineReason,
      });

      // Hide the decline modal and update the apartment status if needed
      hideDeclineModal();

      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Reload the page
      window.location.reload();

      // Optionally, you can update the local state to reflect the declined status
      setApartments((prevApartments) =>
        prevApartments.map((apt) =>
          apt.id === apartmentId ? { ...apt, status: "Declined" } : apt
        )
      );

      // Show a success notification
      notification.success({
        message: "Apartment Declined",
        description: "The apartment has been successfully declined.",
      });
    } catch (error) {
      // Display an error notification and log the error for debugging
      console.error("Error declining apartment:", error);
      notification.error({
        message: "Decline Failed",
        description:
          "Failed to decline the apartment. Please try again later.",
      });
    }
  };
  

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredApartments = apartments.filter((apartment) => {
    // Check if the structure of apartment is as expected
    if (apartment && apartment.user && apartment.property_type) {
      // Filter apartments based on property name
      return apartment.property_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
    return false;
  });

  const handleApprove = async (apartmentId) => {
    try {
      await axoisInstance.get(`/approveHome/${apartmentId}`);
      notification.success({
        message: "Home Approved",
        description: "The home has been successfully approved.",
      });
  
      // Wait for 1 second before reloading the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      // Display an error notification
      notification.error({
        message: "Approval Failed",
        description: "Failed to approve the home. Please try again later.",
      });
    }
  };
  

  const columns = [
    {
      title: "Property Name",
      dataIndex: "title",
      key: "propertyName",
    },
    {
      title: "Property ID",
      dataIndex: "id",
      key: "propertyID",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <span>
          ₦{new Intl.NumberFormat().format(price)}
        </span>
      ),
    },
    
    {
      title: "Added By",
      dataIndex: ["user", "name"],
      key: "addedBy",
    },
    {
      title: "Created On",
      dataIndex: "created_on",
      key: "createdOn",
      sorter: (a, b) => moment(b.created_on).diff(moment(a.created_on)),
      sortOrder: "descend", 
      
    },
  
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "User Verified",
      dataIndex: "userVerified",
      key: "userVerified",
      render: (verified) => (verified ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleApprove(record.id)}>
            Approve
          </Button>{" "}
          <Button type="danger" onClick={() => showDeclineModal(record.id)}>
            Decline
          </Button>
          <Link to={`/HostHome/${record.id}`}>
  <Button type="default">View Details</Button>
</Link>
        </div>
      ),
    },
  ];

  const sortedApartments = filteredApartments.sort((a, b) =>
  moment(b.created_on).diff(moment(a.created_on))
);
  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block overflow-scroll example bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Approve Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <p className="text-sm text-gray-400">
              The Approve Listings section displays properties that are awaiting approval for publication on your platform. Each entry includes the property name, property ID, price, who added the property, when it was created, its current status (published or not), and whether the user is verified.
              </p>
            </div>
            <Input
              placeholder="Search by Property Name"
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: 200, marginBottom: "1rem" }}
            />
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex justify-center h-52 items-center">
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 24,
                        }}
                        spin
                      />
                    }
                  />
                </div>
              ) : (
                <Table
                  columns={columns}
                  dataSource={sortedApartments}    
                                rowKey={(record) => record.id}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Provide a reason for declining"
        open={declineModalVisible}
        onOk={handleDecline}
        onCancel={hideDeclineModal}
        okText="Submit"
        cancelText="Cancel"
      >
        <Input.TextArea
          value={declineReason}
          onChange={handleDeclineReasonChange}
          placeholder="Enter your reason here..."
        />
        <Button type="primary" onClick={handleDecline}>
          Submit
        </Button>
      </Modal>
    </div>
  );
}
