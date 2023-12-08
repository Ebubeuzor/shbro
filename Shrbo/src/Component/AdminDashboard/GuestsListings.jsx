import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { LoadingOutlined } from '@ant-design/icons';

import { Table, Input, Select, Modal, Space, Dropdown,Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axiosClient from "../../axoisClient";

const { confirm } = Modal;

export default function GuestsListings() {

  const [guests, setGuests] = useState([]);  // Add this line
  const [loading, setLoading] = useState(true); // Add loading state

  const getGuest = () => {
    axiosClient
      .get("guests")
      .then(({ data }) => {
        setGuests(data.data);
      })
      .catch((e) => console.log(e))
      .finally(() => setLoading(false)); // Set loading to false when the request is completed
  };

  useEffect(() => {
    getGuest();
  }, []);

  const [filters, setFilters] = useState({
    verified: "Any",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (value) => {
    setFilters({
      verified: value,
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteGuest = (guestId) => {
    confirm({
      title: "Do you want to delete this guest?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const updatedGuests = guests.filter((guest) => guest.id !== guestId);
        setGuests(updatedGuests);
      },
    });
  };

  const items = [
    {
      label: <div>Ban</div>,
      key: "0",
    },
    {
      label: <div>Suspend</div>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <div>No idea</div>,
      key: "3",
    },
  ];

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Guest"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => (verified ? "Yes" : "No"),
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "dateCreated",
    },
    {
      title: "Last Login",
      dataIndex: "last_login_at",
      key: "lastLogin",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>Edit</Space>
            </a>
          </Dropdown>

            &nbsp;
          <span onClick={() => handleDeleteGuest(record.id)} className="cursor-pointer">Delete</span>
        </div>
      ),
    },
  ];

  const filteredGuests = guests.filter((guest) => {
    const { verified } = filters;

    const matchesVerified =
      verified === "Any" || guest.verified === (verified === "Yes");

      const matchesSearch =
  (guest.firstName && guest.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (guest.lastName && guest.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase()));


    return matchesVerified && matchesSearch;
  });

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block bg-orange-400 text-white md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Guest Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4 flex justify-end">
              <Input
                type="text"
                name="searchQuery"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search by name or email"
                className="border p-1 rounded-full mr-2"
              />
              <Select
                style={{ width: 120 }}
                value={filters.verified}
                onChange={handleFilterChange}
              >
                <Select.Option value="Any">Verified</Select.Option>
                <Select.Option value="Yes">Verified</Select.Option>
                <Select.Option value="No">Not Verified</Select.Option>
              </Select>
            </div>
            <div className="overflow-x-auto">
              {loading ? ( // Show the spinner when loading is true
                <div className="mx-auto flex justify-center items-center h-[40vh]">
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
                <Table columns={columns} dataSource={filteredGuests} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

