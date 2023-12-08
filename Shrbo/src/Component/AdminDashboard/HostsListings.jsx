import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table, Input, Select, Modal, Space, Dropdown } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axiosClient from "../../axoisClient";

const { confirm } = Modal;

export default function HostsListings() {

  
  const getGuest = () => {
    axiosClient.get('hosts')
    .then(({data}) => {
      console.log(data.data);
    })
    .catch(e => console.log(e));
  }

  useEffect(() => getGuest, []);
  const [hosts, setHosts] = useState([
    {
      id: 1,
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@example.com",
      housesHosted: 2,
      image: "https://example.com/alice.jpg",
      verified: true,
      dateCreated: "2023-10-01",
      lastLogin: "2023-10-15",

      banned: false,
      suspended: true,
    },
    {
      id: 2,
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@example.com",
      housesHosted: 4,

      image: "https://example.com/bob.jpg",
      verified: false,
      dateCreated: "2023-09-15",
      lastLogin: "2023-10-14",
      banned: true,
      suspended: false,
    },
    {
      id: 3,
      firstName: "William",
      lastName: "Smith",
      email: "bob@example.com",
      housesHosted: 4,

      image: "https://example.com/bob.jpg",
      verified: true,
      dateCreated: "2023-09-15",
      lastLogin: "2023-10-14",
      banned: true,
      suspended: true,
    },

    {
      id: 4,
      firstName: "James",
      lastName: "Gunn",
      email: "bob@example.com",
      housesHosted: 4,

      image: "https://example.com/bob.jpg",
      verified: true,
      dateCreated: "2023-09-15",
      lastLogin: "2023-10-14",
      banned: false,
      suspended: false,
    },
  ]);

  const [filters, setFilters] = useState({
    verified: "Any",
    ban: "Any",
    suspended: "Any",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (value) => {
    setFilters({
      ...filters,

      verified: value,
    });
  };
  const handleBanFilterChange = (value) => {
    setFilters({
      ...filters,
      ban: value,
    });
  };

  const handleSuspendedFilterChange = (value) => {
    setFilters({
      ...filters,
      suspended: value,
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteHost = (hostId) => {
    confirm({
      title: "Do you want to delete this host?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const updatedHosts = hosts.filter((host) => host.id !== hostId);
        setHosts(updatedHosts);
      },
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Host"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "First Name",
      dataIndex: "firstName",
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
      title: "Houses Hosted",
      dataIndex: "housesHosted",
      key: "housesHosted",
    },
    {
      title: "Verified",
      dataIndex: "verified",
      key: "verified",
      render: (verified) => (verified ? "Yes" : "No"),
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
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
          &nbsp; <span onClick={() => handleDeleteHost(record.id)}>Delete</span>
        </div>
      ),
    },
  ];

  const filteredHosts = hosts.filter((host) => {
    const { verified, ban, suspended } = filters;

    const matchesVerified =
    verified === "Any" || 
    (verified === "Yes" && host.verified) || (verified === "No" && !host.verified);

    const matchesBan =
      ban === "Any" ||
      (ban === "Yes" && host.banned) ||
      (ban === "No" && !host.banned);

    const matchesSuspended =
      suspended === "Any" ||
      (suspended === "Yes" && host.suspended) ||
      (suspended === "No" && !host.suspended);

    const matchesSearch =
      host.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesVerified && matchesBan && matchesSuspended && matchesSearch;
  });

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

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Host Listings</h1>
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
              
            </div>
            <div className="my-4 flex space-x-3">
            <Select
                style={{ width: 120 }}
                value={filters.verified}
                onChange={handleFilterChange}
              >
                <Select.Option value="Any">Any</Select.Option>
                <Select.Option value="Yes">Verified</Select.Option>
                <Select.Option value="No">Not Verified</Select.Option>
              </Select>

              <Select
                style={{ width: 120 }}
                value={filters.ban}
                onChange={handleBanFilterChange}
              >
                <Select.Option value="Any">Any</Select.Option>
                <Select.Option value="Yes">Banned</Select.Option>
                <Select.Option value="No">Not Banned</Select.Option>
              </Select>

              <Select
                style={{ width: 120 }}
                value={filters.suspended}
                onChange={handleSuspendedFilterChange}
              >
                <Select.Option value="Any">Any</Select.Option>
                <Select.Option value="Yes">Suspended</Select.Option>
                <Select.Option value="No">Not Suspended</Select.Option>
              </Select>
            </div>
            <div className="overflow-x-auto">
            <Table columns={columns} dataSource={filteredHosts} rowKey="id" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
