import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Select, Button, notification } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import Modal from "react-modal";
import PaginationExample from "../PaginationExample";
import Footer from "../Navigation/Footer";
import Header from "../Navigation/Header";
import BottomNavigation from "../Navigation/BottomNavigation";
import HostHeader from "../Navigation/HostHeader";
import Axois from "../../Axios";
import { Pagination, Spin } from "antd"; // Import Pagination component from Ant Design
import { LoadingOutlined } from "@ant-design/icons";
import { Skeleton } from 'antd';

const { Search } = Input;
const { Option } = Select;

Modal.setAppElement('#root'); // Assuming '#root' is the ID of your root element


export default function Listings() {
  const [selectedListings, setSelectedListings] = useState([]);
  const [isEditButtonVisible, setIsEditButtonVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [coHostsModalVisible, setCoHostsModalVisible] = useState(false);
  const [email, setEmail] = useState(""); // Create a state for the email

  // State to store the co-hosts for the selected listing
  const [selectedListingCoHosts, setSelectedListingCoHosts] = useState([]);
  const [filters, setFilters] = useState({
    rooms: "Any",
    beds: "Any",
    baths: "Any",
    amenities: "Any",
    status: "Any",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedHouseTitle, setSelectedHouseTitle] = useState("");
  const [selectedHouseId, setSelectedHouseId] = useState(null);
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coHostModalVisible, setCoHostModalVisible] = useState(false);
  const [coHostEmail, setCoHostEmail] = useState("");
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
  };


 
  
  const fetchListings = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await Axois.get("/getUserHostHomes");
      setListings(response.data.userHostHomes || []);
      console.log(response.data.userHostHomes);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data (whether successful or not)
    }
  };

    
  const fetchUser = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const response = await Axois.get("/user");
      console.log(response.data.email);
      setEmail(response.data.email)
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data (whether successful or not)
    }
  };


  useEffect(() => {
    // Fetch data when the component mounts
    fetchListings();
  }, []);
  useEffect(() => {
    // Fetch data when the component mounts
    fetchUser();
  }, []);
  const columns = [
    {
      title: "Select",
      dataIndex: "id",
      key: "select",
      render: (id) => (
        <input
          className="h-5"
          type="checkbox"
          onChange={() => handleCheckboxChange(id)}
          checked={selectedListings.includes(id)}
        />
      ),
    },
    {
      title: "Image",
      dataIndex: "hosthomephotos",
      key: "hosthomephotos",
      render: (hosthomephotos) => (
        <img
      src={
        hosthomephotos && hosthomephotos.length > 0
          ? hosthomephotos[0].images
          : ""
      }
      alt="Listing"
      className="w-14 h-14 object-cover rounded-lg"
    />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => <Link to={``}>{title}</Link>,
    },
    {
      title: "Listing Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Instant Book",
      dataIndex: "instantBook",
      key: "instantBook",
    },
    {
      title: "Bedrooms",
      dataIndex: "bedroom",
      key: "bedroom",
    },
    {
      title: "Bathrooms",
      dataIndex: "bathrooms",
      key: "bathrooms",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },

 
    
    
  ];




  
  
  
  const handleCheckboxChange = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter((id) => id !== listingId));
    } else {
      setSelectedListings([listingId]);
    }

    // Update the state to determine whether to show the "Edit" button
    setIsEditButtonVisible(selectedListings.length === 0);
    setSelectedHouseId(listingId);

  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const openDeleteModal = (listingId, title) => {
    setSelectedHouseTitle(title);
    setSelectedHouseId(listingId);
    setDeleteModalIsOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false);
    setSelectedHouseTitle("");
    setSelectedHouseId(null);
  };

  const handleDeleteButtonClick = async () => {
    try {
      // Check if the user's email is in the list of co-host emails
      const isCoHost = selectedListingCoHosts.some(cohost => cohost.email === email);
  
      if (isCoHost) {
        // Show a message indicating that co-hosts cannot delete the apartment
        notification.warning({
          message: "Permission denied",
          description: "Co-hosts cannot delete the apartment.",
        });
        return;
      }
  
      // Send a DELETE request to delete the host home
      await Axois.delete(`/hosthomes/${selectedHouseId}`);
  
      // After successful deletion, close the modal
      closeDeleteModal();
  
      // Fetch updated listings
      await fetchListings();
  
      // Show success notification
      notification.success({
        message: "Deleted successfully",
        description: "The listing has been deleted successfully.",
        placement: "topRight",
        duration: 0, // Make the notification persist until manually closed
        btn: (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notification.destroy(); // Close the notification when the button is clicked
              window.location.reload();
            }}
          >
            Close
          </Button>
        ),
      });
    } catch (error) {
      console.error("Error deleting the listing:", error);
      // Handle errors as needed (e.g., display an error message to the user)
      notification.error({
        message: "Error deleting",
        description:
          "There was an error deleting the listing. Please try again.",
      });
    }
  };
  

  // Define your listings data

  const filteredListings = listings.filter((listing) => {
    const { rooms, beds, baths, amenities, status } = filters;

    const matchesFilters =
      (rooms === "Any" || listing.bedroom === parseInt(rooms, 10)) &&
      (beds === "Any" || listing.bedroom === parseInt(beds, 10)) &&
      (baths === "Any" || listing.bathrooms === parseFloat(baths)) &&
      (amenities === "Any" || listing.amenities.includes(amenities)) &&
      (status === "Any" || listing.status === status);

    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilters && matchesSearch;
  });

  const isDeleteButtonVisible = selectedListings.length > 0;

  const pageSize = 5; // Number of listings to display per page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const displayedListings = filteredListings.slice(startIndex, endIndex);
  return (
    <div>
      <HostHeader />
      <div className="md:flex-col md:w-[80vw] md:mx-auto md:my-10 p-4 md:p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
          <h1 className="text-xl font mb-4 italic text-gray-500">
  {loading ? (
    <Skeleton.Input style={{ width: 100 }} active={true} />
  ) : (
    `${listings.length} Listings found`
  )}
</h1>

          </div>
          <div>
            <Link to="/HostHomes">
              <Button type="primary">Create new listings</Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-end mb-4 cursor-pointer">
          {isDeleteButtonVisible && (
            <Button
              type="danger"
              onClick={() =>
                openDeleteModal(selectedListings[0], selectedHouseTitle)
              }
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          )}
          {/* Conditionally render the "Edit" button */}
          {isEditButtonVisible && (
            <Button type="primary">
              <Link to={`/EditHostHomes/${selectedListings[0]}`}>
                Edit Apartment
              </Link>
            </Button>
          )}
        </div>
        <div className="flex justify-between overflow-auto example space-x-2 items-center">
          <div className="mb-4 w-52">
            <Search
              prefix={<SearchOutlined />}
              placeholder="Search listings"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              style={{ width: 200 }}
            />
          </div>
          <div className="mb-4">
            <Select
              style={{ width: 120 }}
              value={filters.rooms}
              onChange={(value) =>
                handleFilterChange({ target: { name: "rooms", value } })
              }
            >
              <Option value="Any">Rooms</Option>
              <Option value="Any">Any</Option>
              <Option value="1">1 Room</Option>
              <Option value="2">2 Rooms</Option>
              <Option value="3">3 Rooms</Option>

              <Option value="4">4 Rooms</Option>
              <Option value="5">5 Rooms</Option>

              {/* Add other options */}
            </Select>
          </div>
          <div className="mb-4">
            <Select
              style={{ width: 120 }}
              value={filters.beds}
              onChange={(value) =>
                handleFilterChange({ target: { name: "beds", value } })
              }
            >
              <Option value="Any">Beds</Option>
              <Option value="Any">Any</Option>
              <Option value="1">1 Bed</Option>
              <Option value="2">2 Beds</Option>
              <Option value="3">3 Beds</Option>

              <Option value="4">4 Beds</Option>
              <Option value="5">5 Beds</Option>
              {/* Add other options */}
            </Select>
          </div>
          <div className="mb-4">
            <Select
              style={{ width: 120 }}
              value={filters.baths}
              onChange={(value) =>
                handleFilterChange({ target: { name: "baths", value } })
              }
            >
              <Option value="Any">Baths</Option>
              <Option value="Any">Any</Option>
              <Option value="1">1 Bath</Option>
              <Option value="2">2 Baths</Option>
              <Option value="3">3 Baths</Option>

              <Option value="4">4 Baths</Option>
              <Option value="5">5 Baths</Option>
              {/* Add other options */}
            </Select>
          </div>
          <div className="mb-4">
            <Select
              style={{ width: 120 }}
              value={filters.amenities}
              onChange={(value) =>
                handleFilterChange({ target: { name: "amenities", value } })
              }
            >
              <Option value="Any">Amenities</Option>
              <Option value="Any">Any</Option>
              <Option value="Pool">Pool</Option>
              <Option value="Gym">Gym</Option>
              {/* Add other options */}
            </Select>
          </div>
          <div className="mb-4">
            <Select
              style={{ width: 120 }}
              value={filters.status}
              onChange={(value) =>
                handleFilterChange({ target: { name: "status", value } })
              }
            >
              <Option value="Any">Status</Option>
              <Option value="Any">Any</Option>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              {/* Add other options */}
            </Select>
          </div>
        </div>
        <div className="overflow-auto example shadow-md">
          {loading ? ( // Display Spin component when loading is true
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
              dataSource={displayedListings.map((listing) => ({
                ...listing,
                key: listing.id, // Add a unique key
              }))}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedListings,
                onChange: (selectedRowKeys) =>
                  setSelectedListings(selectedRowKeys),
              }}
              pagination={false} // Hide internal pagination
            />
          )}
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredListings.length}
          onChange={handlePageChange}
          className="mt-4"
        />

        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Delete Confirmation"
          style={{
            content: {
              height: "200px",
              width: "300px",
              margin: "auto",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <h2>Delete Confirmation</h2>
          <p>Are you sure you want to delete the apartment?</p>
          <div className="flex justify-between mt-4">
            <Button type="danger" onClick={handleDeleteButtonClick}>
              Confirm
            </Button>
            <Button onClick={closeDeleteModal}>Cancel</Button>
          </div>
        </Modal>
      </div>
     


      <BottomNavigation />
      <Footer />
    </div>
  );
}
