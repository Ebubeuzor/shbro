import React, { useEffect, useState } from "react";
import { Table, Input, Select, Modal, Space, Dropdown, Spin, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Axios from "../../Axios"
const { confirm } = Modal;

export default function ReviewListings() {
  const [reviews, setReviews] = useState([
  
  ]);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await Axios.get("/getReviews");
        setReviews(response.data.data); 
        console.log(response.data.data);
        setLoading(false); 

      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Handle error, show error message, etc.
        setLoading(false); // Set loading to false whether request succeeds or fails

      }
    };

    fetchReviews();
  }, []);


  const [filters, setFilters] = useState({
    status: "Any",
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterChange = (value) => {
    setFilters({
      status: value,
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };



  const ConfirmDeleteReview = async (reviewId) => {
    try {
      await Axios.delete(`/deleteReviews/${reviewId}`);
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews);
      notification.success({
        message: "Review Deleted",
        description: "The review has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      notification.error({
        message: "Failed to Delete Review",
        description: "An error occurred while deleting the review.",
      });
    }
  };
  

  const columns = [
    {
      title: "Rental Name",
      dataIndex: "propertyName",
      key: "propertyName",
    },
    {
      title: "Rating",
      dataIndex: "ratings",
      key: "ratings",
    },
    {
      title: "Email Address",
      dataIndex: "guestemail",
      key: "guestemail",
    },

    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Date Added",
      dataIndex: "created_at",
      key: "created_at",
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          {/* <Dropdown
            menu={{
              items: [
                {
                  label: <div>Approve</div>,
                  key: "0",
                },
                {
                  label: <div>Reject</div>,
                  key: "1",
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
            <a onClick={(e) => e.preventDefault()}>Action</a>
          </Dropdown> */}
          &nbsp;
          <span
            onClick={() => ConfirmDeleteReview(record.id)}
            className="cursor-pointer"
          >
            Delete
          </span>
        </div>
      ),
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    const { status } = filters;
  
    const matchesStatus = status === "Any" || review.status === status;
  
    const matchesSearch =
      (review.rentalName && review.rentalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (review.emailAddress && review.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()));
  
    return matchesStatus && matchesSearch;
  });
  

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block overflow-scroll example bg-orange-400 text-white md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Review Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <div className="text-gray-400 text-sm">
              The Review Listings section is designed to display reviews left by users on your platform. 
              </div>
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
                value={filters.status}
                onChange={handleFilterChange}
              >
                <Select.Option value="Any">Status (Any)</Select.Option>
                <Select.Option value="Active">Active</Select.Option>
                <Select.Option value="Not Active">Not Active</Select.Option>
                {/* Add more status options as needed */}
              </Select>
            </div>
            <div className="overflow-x-auto">
            {loading ? (
                <Spin size="large" />
              ) : (
                <Table columns={columns} rowKey="id" dataSource={reviews} />
              )}            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
