import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table, Input, Select, Modal, Space, Dropdown, Spin, notification, Button } from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import axiosInstance from "../../Axios";
import moment from "moment";
import ShbroLogo from "../../assets/shbro logo.png"

const { confirm } = Modal;

export default function HostsListings() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    verified: "Any",
    ban: "Any",
    suspended: "Any",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [banMessage, setBanMessage] = useState("");
  const [showBanMessageModal, setShowBanMessageModal] = useState(false);
  const [suspendMessage, setSuspendMessage] = useState("");
  const [showSuspendMessageModal, setShowSuspendMessageModal] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);

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

  useEffect(() => {
    axiosInstance
      .get("/hosts")
      .then((response) => {
        // Sort the hosts array by created_at date in descending order
        const sortedHosts = response.data.data.sort((a, b) => {
          return new Date(b.user.created_at) - new Date(a.user.created_at);
        });
        console.log(response);

  
        // Set the sorted hosts data
        setHosts(sortedHosts);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching hosts:", error);
        setLoading(false);
      });
  }, []);
  

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

  const handleBanHost = async (record) => {
    setSelectedHost(record);
    setShowBanMessageModal(true);
  };

  const handleSuspendHost = async (record) => {
    setSelectedHost(record);
    setShowSuspendMessageModal(true);
  };

  const handleConfirmBan = async (record) => {
    if (record && record.user && record.user.id) {
      const hostIdString = record.user.id.toString();
      console.log(hostIdString);
      const hostId = record.user.id;
      console.log("Host ID:", hostId);
      const messageObject = { message: banMessage };
  
      const isBanned = record.user.banned;
      const endpoint = isBanned ? `/unbanGuest/${hostIdString}` : `/banGuest/${hostIdString}`;
  
      try {
        await axiosInstance.put(endpoint, messageObject);
  
        const updatedHosts = hosts.map((host) =>
          host.id === hostId ? { ...host, user: { ...host.user, banned: !isBanned } } : host
        );

        notification.success({
          message: isBanned ? "Host UnBanned" : "Host Banned",
          description: `The host has been successfully ${
            isBanned ? "UnBanned" : "Banned"
          }.`,
        });
  
        setHosts(updatedHosts);
  
        // Wait for 1 second before reloading the page
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error("Error changing host ban status:", error);
        notification.error({
          message: `Error ${isBanned ? "UnBanning" : "Banning"} Host`,
          description: `Failed to ${
            isBanned ? "unabn" : "ban"
          } the host. Please try again later.`,
        });
      }
    } else {
      console.error("Invalid record:", record);
    }
  };

  const handleConfirmSuspend = async (record) => {
    if (record && record.user && record.user.id) {
      const hostIdString = record.user.id.toString();
      console.log(hostIdString);
      const hostId = record.user.id;
      console.log("Host ID:", hostId);
      const messageObject = { message: suspendMessage };
  
      // Use isSuspended to determine the action
      const isSuspended = record.user.suspend;
      const endpoint = isSuspended
        ? `/unsuspendGuest/${hostIdString}`
        : `/suspendGuest/${hostIdString}`;
  
      try {
        await axiosInstance.put(endpoint, messageObject);
  
        const updatedHosts = hosts.map((host) =>
          host.id === hostId ? { ...host, user: { ...host.user, suspend: !isSuspended } } : host
        );

        notification.success({
          message: isSuspended ? "Host Unsuspended" : "Host Suspended",
          description: `The host has been successfully ${
            isSuspended ? "Unsuspended" : "Suspended"
          }.`,
        });
  
        setHosts(updatedHosts);
  
        // Wait for 1 second before reloading the page
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error("Error changing host suspend status:", error);
        notification.error({
          message: `Error ${isSuspended ? "Unsuspending" : "Suspending"} Host`,
          description: `Failed to ${
            isSuspended ? "unsuspend" : "suspend"
          } the host. Please try again later.`,
        });
      }
    } else {
      console.error("Invalid record:", record);
    }
  };

  const handleBanMessageChange = (event) => {
    setBanMessage(event.target.value);
  };

  const handleSuspendMessageChange = (event) => {
    setSuspendMessage(event.target.value);
  };

  const getBanLabel = (record) => {
    return record.user.banned === null ? "Ban" : "Unban";
  };

  const getSuspendLabel = (record) => {
    return record.user.suspend === null ? "Suspend" : "Unsuspend";
  };

  const columns = [
    {
      title: "Image",
      dataIndex: ["user", "profilePicture"],
      key: "profilePicture",
      render: (image) => (
        <img
          src={image || ShbroLogo}
          alt="Host"
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      ),
      
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
    },

    {
      title: "Email",
      dataIndex: ["user","email"],
      key: "email",
    },
    {
      title: "Houses Hosted",
      dataIndex: "verified_homes_count",
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
      dataIndex: ["user", "created_at"], // Update this line to access the created_at field nested inside the user object
      key: "created_at",

      render: (created_at) =>
        moment(created_at).format("MMMM Do, YYYY, h:mm:ss a"),
    },
    {
      title: "Last Login",
      dataIndex: ["user", "last_login_at"],
      key: "lastLogin",
      render: (last_login_at) => {
        const formattedDate = moment(last_login_at);
        return formattedDate.isValid()
          ? formattedDate.format("MMMM Do, YYYY, h:mm:ss a")
          : "No Date";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Dropdown
            menu={{
              items: [
                {
                  label: <div>{getBanLabel(record)}</div>,
                  key: "0",
                  onClick: () => handleBanHost(record),
                },
                {
                  label: <div>{getSuspendLabel(record)}</div>,
                  key: "1",
                  onClick: () => handleSuspendHost(record),
                },
                {
                  type: "divider",
                },
                {
                  label: <div>No idea</div>,
                  key: "3",
                },
              ],
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

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block overflow-scroll example overflow-scroll example bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Host Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
              The Host Listings section provides a detailed overview of all the hosts registered on your platform. Each entry includes the host’s name, email, number of houses hosted, verification status, date of account creation, and last login date.
              </p>
            </div>
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
                  dataSource={hosts}
                  rowKey={(record) => `${record.user.id}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Provide a message for banning"
        open={showBanMessageModal}
        onCancel={() => setShowBanMessageModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowBanMessageModal(false)}>
            Cancel
          </Button>,
       
        ]}
      >
        <Input.TextArea
          value={banMessage}
          onChange={handleBanMessageChange}
          placeholder="Enter your message here..."
        />
           <Button key="submit" type="primary" onClick={() => handleConfirmBan(selectedHost)}>
            Submit
          </Button>
      </Modal>

      <Modal
        title="Provide a reason for suspension"
        open={showSuspendMessageModal}
        onCancel={() => setShowSuspendMessageModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSuspendMessageModal(false)}>
            Cancel
          </Button>,
       
        ]}
      >
        <Input.TextArea
          value={suspendMessage}
          onChange={handleSuspendMessageChange}
          placeholder="Enter your reason here..."
        />
           <Button key="submit" type="primary" onClick={() => handleConfirmSuspend(selectedHost)}>
            Submit
          </Button>
      </Modal>
    </div>
  );
}
