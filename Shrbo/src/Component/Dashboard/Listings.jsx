import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Input, Select, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import Modal from "react-modal";
import PaginationExample from "../PaginationExample";
import Footer from "../Navigation/Footer";
import Header from "../Navigation/Header";
import BottomNavigation from "../Navigation/BottomNavigation";

const { Search } = Input;
const { Option } = Select;

export default function Listings() {
  const [selectedListings, setSelectedListings] = useState([]);
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

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
  };

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
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Listing"
          className="w-14 h-14 object-cover rounded-lg"
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title) => (
        <Link to={`/HostHomes`}>{title}</Link>
      ),
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
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  const handleCheckboxChange = (listingId) => {
    if (selectedListings.includes(listingId)) {
      setSelectedListings(selectedListings.filter((id) => id !== listingId));
    } else {
      setSelectedListings([...selectedListings, listingId]);
    }
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

  const handleDeleteButtonClick = () => {
    // Implement your delete logic here based on selectedHouseId
    // After deletion, close the modal
    closeDeleteModal();
  };

  // Define your listings data
  const listings = [
    {
      id: 1,
      status: "Active",
      instantBook: "Yes",
      bedroom: 2,
      bathrooms: 2,
      amenities: "Pool",
      title: "Sharp apartment",
      location: "Lekki Phase 1",
      image:
        "https://images.surferseo.art/fdb08e2e-5d39-402c-ad0c-8a3293301d9e.png",
    },
    {
      id: 2,
      status: "Inactive",
      instantBook: "No",
      bedroom: 3,
      bathrooms: 2.5,
      amenities: "pool",
      title: "fine apartment",

      location: "Admiralty 2b",
      image:
        "https://images.surferseo.art/fdb08e2e-5d39-402c-ad0c-8a3293301d9e.png",
    },
  ];

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
      listing.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilters && matchesSearch;
  });

  const isDeleteButtonVisible = selectedListings.length > 0;

  return (
    <div>
      <Header/>
      <div className="md:flex-col md:w-[80vw] md:mx-auto md:my-10 p-4 md:p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-xl font mb-4 italic text-gray-500">2 Listings found</h1>
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
            onClick={() => openDeleteModal(selectedListings[0], selectedHouseTitle)}
            icon={<DeleteOutlined />}
          >
            Delete
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
            onChange={(value) => handleFilterChange({ target: { name: "rooms", value } })}
          >
            <Option value="Any">Rooms</Option>
            <Option value="Any">Any</Option>
            <Option value="1">1 Room</Option>
            <Option value="2">2 Rooms</Option>
            {/* Add other options */}
          </Select>
        </div>
        <div className="mb-4">
          <Select
            style={{ width: 120 }}
            value={filters.beds}
            onChange={(value) => handleFilterChange({ target: { name: "beds", value } })}
          >
            <Option value="Any">Beds</Option>
            <Option value="Any">Any</Option>
            <Option value="1">1 Bed</Option>
            <Option value="2">2 Beds</Option>
            {/* Add other options */}
          </Select>
        </div>
        <div className="mb-4">
          <Select
            style={{ width: 120 }}
            value={filters.baths}
            onChange={(value) => handleFilterChange({ target: { name: "baths", value } })}
          >
            <Option value="Any">Baths</Option>
            <Option value="Any">Any</Option>
            <Option value="1">1 Bath</Option>
            <Option value="2">2 Baths</Option>
            {/* Add other options */}
          </Select>
        </div>
        <div className="mb-4">
          <Select
            style={{ width: 120 }}
            value={filters.amenities}
            onChange={(value) => handleFilterChange({ target: { name: "amenities", value } })}
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
            onChange={(value) => handleFilterChange({ target: { name: "status", value } })}
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
        <Table
          columns={columns}
          
          dataSource={filteredListings.map((listing) => ({
            ...listing,
            key: listing.id, // Add a unique key
          }))}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedListings,
            onChange: (selectedRowKeys) => setSelectedListings(selectedRowKeys),
            
          }}
        />
      </div>

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
        <p>Are you sure you want to delete the listing "{selectedHouseTitle}"?</p>
        <div className="flex justify-between mt-4">
          <Button
            type="danger"
            onClick={handleDeleteButtonClick}
          >
            Confirm
          </Button>
          <Button
            onClick={closeDeleteModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>

    </div>
    <BottomNavigation/>
    <Footer/>
    </div>
  );
}
