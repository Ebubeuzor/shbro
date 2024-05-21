import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  Table,
  Input,
  Select,
  Modal,
  Space,
  Dropdown,
  Spin,
  notification,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axiosInstance from "../../Axios";
import { LoadingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import ShbroLogo from "../../assets/shbro logo.png"

const { confirm } = Modal;

export default function GuestsListings() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banMessage, setBanMessage] = useState(""); // State for ban message input
  const [showBanMessageModal, setShowBanMessageModal] = useState(false); // State to control visibility of ban message modal
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [suspendMessage, setSuspendMessage] = useState(""); // State for suspension reason input
  const [showSuspendMessageModal, setShowSuspendMessageModal] = useState(false);

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

  const handleBanGuest = (record) => {
    // Set the selectedGuest state to the current guest
    setSelectedGuest(record);
    // Show the modal for providing a message
    setShowBanMessageModal(true);
  };

  // Function to handle the ban confirmation
  const handleConfirmBan = async () => {
    try {
      const endpoint = selectedGuest.banned
        ? `/unbanGuest/${selectedGuest.id}`
        : `/banGuest/${selectedGuest.id}`;
      const message = selectedGuest.banned
        ? "Unbanned"
        : banMessage || "You have been banned."; // Set a default message if unbanning and no message is provided

      const response = await axiosInstance.put(endpoint, {
        message: message, // Pass the message to the API
      });

      const updatedGuests = guests.map((guest) =>
        guest.id === selectedGuest.id
          ? { ...guest, banned: !guest.banned }
          : guest
      );

      setGuests(updatedGuests);

      notification.success({
        message: `Guest ${message}`,
        description: `The guest has been successfully ${message.toLowerCase()}.`,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(`Error ${message.toLowerCase()} guest:`, error);
      notification.error({
        message: `Error ${message.toLowerCase()} Guest`,
        description: `Failed to ${message.toLowerCase()} the guest. Please try again later.`,
      });
    } finally {
      // Hide the ban message modal
      setShowBanMessageModal(false);
      // Clear the ban message
      setBanMessage("");
    }
  };

  const handleSuspendedFilterChange = (value) => {
    setFilters({
      ...filters,
      suspended: value,
    });
  };

  useEffect(() => {
    // Fetch guests from the API when the component mounts
    axiosInstance
      .get("/guests")
      .then((response) => {
        // Sort guests in descending order based on creation date
        const sortedGuests = response.data.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        console.log(response.data);
  
        // Update the 'banned' label for each guest
        const updatedGuests = sortedGuests.map((guest) => {
          return {
            ...guest,
            banLabel: guest.banned === null ? "Ban" : "Unban",
          };
        });
  
        setGuests(updatedGuests);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching guests:", error);
        setLoading(false);
      });
  }, []);
  

  const hideBanMessageModal = () => {
    setShowBanMessageModal(false);
  };

  // Function to handle the ban message input change
  const handleBanMessageChange = (event) => {
    setBanMessage(event.target.value);
  };

  const handleSuspendMessageChange = (event) => {
    setSuspendMessage(event.target.value);
  };

  const handleDecline = () => {
    // Handle the decline action here
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSuspendGuest = (record) => {
    setSelectedGuest(record);
    setShowSuspendMessageModal(true);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <img
          src={image || ShbroLogo}
          alt={`Guest ${record.id}`}
          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
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
      render: (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
      },
    },
    
    {
      title: "Last Login",
      dataIndex: "last_login_at",
      key: "lastLogin",
      render: (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
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
                  onClick: () => handleBanGuest(record),
                },

                {
                  label: <div>{getSuspendLabel(record)}</div>,
                  key: "1",
                  onClick: () => handleSuspendGuest(record),
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
          &nbsp;
          <span
            onClick={() => handleDeleteGuest(record.id)}
            className="cursor-pointer"
          >
            Delete
          </span>
        </div>
      ),
    },
  ];

  // function to delete guests
  const handleDeleteGuest = (guestId) => {
    confirm({
      title: "Do you want to delete this guest?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // Call handleDeleteeGuest directly
        handleDeleteeGuest({ id: guestId });
      },
    });
  };

  const handleDeleteeGuest = (record) => {
    // Make an API call to update the delete status of the guest
    if (record && record.id) {
      const guestIdString = record.id.toString();
      const messageObject = { message: "Hello Your Account has been Deleted" }; // Provide a default message
  
      // Define the API endpoint based on the action (delete/undelete)
      const endpoint = record.banned
        ? `/undeleteGuest/${guestIdString}`
        : `/deleteGuest/${guestIdString}`;
  
      axiosInstance
        .delete(endpoint, { data: messageObject }) // Pass the messageObject as the request body
        .then((response) => {
          // Update the local state with the updated data
          const updatedGuests = guests.map((guest) =>
            guest.id === record.id
              ? { ...guest, banned: !record.banned } // Toggle the delete status
              : guest
          );
  
          notification.success({
            message: record.banned ? "Guest Restored" : "Guest Deleted",
            description: `The Guest has been successfully ${
              record.banned ? "Restored" : "Deleted"
            }.`,
          });
  
          setGuests(updatedGuests);
  
          // Reload the page after the guest has been deleted
          window.location.reload();
  
          // You can also show a success message or perform other actions if needed
        })
        .catch((error) => {
          console.error("Error changing guest delete status:", error);
          notification.error({
            message: `Error ${
              record.banned ? "Restoring" : "Deleting"
            } Guest`,
            description: `Failed to ${
              record.banned ? "restore" : "delete"
            } the guest. Please try again later.`,
          });
          // Handle error scenarios, show an error message, etc.
        });
    } else {
      console.error("Invalid record:", record);
    }
  };
  
  
  


  const handleConfirmSuspend = async (guest) => {
    try {
      const endpoint = guest.suspend
        ? `/unsuspendGuest/${guest.id}`
        : `/suspendGuest/${guest.id}`;
      const message = suspendMessage; // Use suspendMessage as the message
  
      const response = await axiosInstance.put(endpoint, {
        message: message,
      });
  
      console.log('API Response:', response.data); 
  
      // Update the 'suspended' status based on the API response
      const updatedGuests = guests.map((guest) =>
        guest.id === guest.id ? { ...guest, suspend: !guest.suspend } : guest
      );
  
      setGuests(updatedGuests);
  
      notification.success({
        message: guest.suspend ? "Guest Unsuspended" : "Guest Suspended",
        description: `The guest has been successfully ${
          guest.suspend ? "unsuspended" : "suspended"
        }.`,
      });
  
      await new Promise((resolve) => setTimeout(resolve, 3000));
  
      window.location.reload();
    } catch (error) {
      console.error(`Error ${suspendMessage.toLowerCase()} guest:`, error);
      notification.error({
        message: `Error ${suspendMessage.toLowerCase()} Guest`,
        description: `Failed to ${suspendMessage.toLowerCase()} the guest. Please try again later.`,
      });
    } finally {
      setShowSuspendMessageModal(false);
      setSuspendMessage("");
    }
  };
  
  
  
  
  
  

  // function to be able to change the label of guests
  const getBanLabel = (record) => {
    return record.banned === null ? "Ban" : "Unban";
  };

  // function to be able to change the label of guests
  const getSuspendLabel = (record) => {
    return record.suspend === null ? "suspend" : "Unsuspend";
  };

  const items = [
    {
      label: <div>{getBanLabel}</div>,
      key: "0",
      onClick: (record) => handleBanGuest(record),
    },

    {
      label: <div>Suspend</div>,
      key: "1",
      onClick: (record) => handleSuspendGuest(record),
    },
    {
      type: "divider",
    },
    {
      label: <div>No idea</div>,
      key: "3",
    },
  ];

  const filteredGuests = guests.filter((guest) => {
    const { verified, ban, suspended } = filters;

    // Check if the guest is verified or not based on the selected filter
    const matchesVerified =
      verified === "Any" ||
      (verified === "Verified" && guest.verified === "Verified") ||
      (verified === "Not Verified" && guest.verified !== "Verified");

    const matchesSearch =
      (guest.name &&
        guest.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (guest.email &&
        guest.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBan =
      ban === "Any" ||
      (ban === "Yes" && (guest.banned !== null ? guest.banned : false)) ||
      (ban === "No" && (guest.banned !== null ? !guest.banned : true));

    const matchesSuspended =
      suspended === "Any" ||
      (suspended === "Yes" &&
        (guest.suspend !== null ? guest.suspend : false)) ||
      (suspended === "No" && (guest.suspend !== null ? !guest.suspend : true));

    return matchesVerified && matchesBan && matchesSuspended && matchesSearch;
  });

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block overflow-scroll example overflow-scroll example bg-orange-400 text-white md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Guest Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
              The Guest Listings section provides a comprehensive view of all the guests registered on your platform. Each entry includes the guest’s name, email, verification status, date of account creation, and last login date.
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
              <Select
                style={{ width: 120 }}
                value={filters.verified}
                onChange={handleFilterChange}
              >
                <Select.Option value="Any">Any</Select.Option>
                <Select.Option value="Verified">Verified</Select.Option>
                <Select.Option value="Not Verified">Not Verified</Select.Option>
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
                  dataSource={filteredGuests}
                  rowKey={(record) => record.id} // Set the rowKey to the guest's id
                />
              )}
            </div>
          </div>
        </div>
        <Modal
          title="Provide a message for banning"
          open={showBanMessageModal}
          onCancel={hideBanMessageModal}
        >
          <Input.TextArea
            value={banMessage}
            onChange={handleBanMessageChange}
            placeholder="Enter your message here..."
          />
          <Button
            type="primary"
            onClick={() => handleConfirmBan(selectedGuest)}
          >
            Submit
          </Button>
        </Modal>


        <Modal
          title="Provide a reason for suspension"
          open={showSuspendMessageModal}
          onCancel={() => setShowSuspendMessageModal(false)}
        >
          <Input.TextArea
            value={suspendMessage}
            onChange={handleSuspendMessageChange}
            placeholder="Enter your reason here..."
          />
          <Button type="primary" onClick={() => handleConfirmSuspend(selectedGuest)}>
  Submit
</Button>

        </Modal>
      </div>
    </div>
  );
}
