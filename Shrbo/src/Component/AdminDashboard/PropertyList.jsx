import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table, Button, Input, Modal, Spin, notification } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import axiosInstance from "../../Axios";
import moment from "moment";

const { confirm } = Modal;

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const showConfirm = (propertyId) => {
    confirm({
      title: "Do you want to delete this property?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        console.log(propertyId);
        axiosInstance
          .delete(`/hosthomes/${propertyId}`)
          .then(() => {
            const updatedProperties = properties.filter(
              (property) => property.id !== propertyId
            );
            setProperties(updatedProperties);

            notification.success({
              message: "Property Deleted",
              description: "This property has been successfully deleted.",
            });
          })
          .catch((error) => {
            console.error("Error deleting property:", error);

            notification.error({
              message: "Error Deleting Property",
              description: "Failed to delete the property. Please try again later.",
            });
          });
      },
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProperties = properties.filter((property) => {
    return (
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (property.user &&
        property.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const columns = [
    {
      title: "Property Name",
      dataIndex: "title",
      key: "propertyName",
    },
    {
      title: "Property ID",
      dataIndex: "id",
      key: "propertyId",
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
      dataIndex: "user", // Access the 'user' object
      key: "addedBy",
      render: (user) => user.name, // Render the 'name' property of the 'user' object
    },
    {
      title: "Created On",
      dataIndex: "created_on", // Assuming 'createdOn' is stored in the 'created_at' property
      key: "created_on",
      render: (createdAt) => moment(createdAt).format("MMMM Do, YYYY, h:mm:ss a"), // Format the date using moment.js

    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Verified",
      dataIndex: ["user", "verified"], // Nested property path
      key: "Verified",
      render: (verified) => (verified ? "Yes" : "No"), // Render 'Yes' if true, 'No' if false
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Link to={`/HostHome/${record.id}`}>
            <Button type="primary">View Details</Button>
          </Link>
          &nbsp;
          <Button type="danger" onClick={() => showConfirm(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Fetch properties from the API when the component mounts
    axiosInstance
      .get("/allHomes")
      .then((response) => {
        // Sort properties in descending order based on creation date
        const sortedProperties = response.data.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setProperties(sortedProperties.reverse()); // Reverse the order of the sorted properties
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setLoading(false);
      });
  }, []);
  
  

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block  example  example overflow-scroll example bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Property Listings</h1>
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
            The Property Listings section provides a detailed overview of all the properties listed on your platform. Each entry includes the property name, property ID, price, who added the property, when it was created, its current status (published or not), and whether it’s verified.
            </p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Input
              placeholder="Search by Property Name or Added By"
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
                  dataSource={filteredProperties}
                  rowKey={(record) => record.id} // Set the rowKey to the guest's id
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
