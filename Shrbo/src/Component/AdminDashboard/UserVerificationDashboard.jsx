import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";
import moment from "moment";

import { DatePicker } from "antd";

// Sample data for verified users
const userData = [
  {
    key: "1",
    userName: "John Doe",
    email: "johndoe@example.com",
    photo: "path/to/photo1.jpg",
    selfiePhoto:
      "https://media.istockphoto.com/id/1270987867/photo/close-up-young-smiling-man-in-casual-clothes-posing-isolated-on-blue-wall-background-studio.jpg?s=612x612&w=0&k=20&c=FXkui3WMnV8YY_aqt8VsSSXYznvm9Y3eMoHMYyW4za4=",
    typeOfUser: "Host",
    submissionDate: "2023-10-20",
  },
  {
    key: "2",
    userName: "Jane Smith",
    email: "janesmith@example.com",
    photo:
      "https://independent.ng/wp-content/uploads/National-Identity-Number-NIN.jpg",
    selfiePhoto:
      "https://media.istockphoto.com/id/1270987867/photo/close-up-young-smiling-man-in-casual-clothes-posing-isolated-on-blue-wall-background-studio.jpg?s=612x612&w=0&k=20&c=FXkui3WMnV8YY_aqt8VsSSXYznvm9Y3eMoHMYyW4za4=",
    typeOfUser: "Guest",

    submissionDate: "2023-11-05",
  },
];

const UserVerificationDashboard = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState(userData);
  const [filters, setFilters] = useState({ name: "", date: "" });
  const pdfRef = useRef();

  const { toPDF, targetRef } = usePDF({ filename: "user_verification.pdf" });

  const columns = [
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      key: "submissionDate",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div>
          <Button onClick={() => viewUserDetails(record)}>View Details</Button>
        </div>
      ),
    },
  ];

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setDetailsVisible(true);
  };

  const handleDetailsClose = () => {
    setDetailsVisible(false);
  };

  const downloadPDF = () => {
    if (selectedUser) {
      toPDF(pdfRef, {
        unit: "mm",
        format: "a4",
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    let filtered = userData;

    if (filters.name) {
      filtered = filtered.filter((user) =>
        user.userName.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.date) {
      filtered = filtered.filter(
        (user) => user.submissionDate === filters.date
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div>
      <div className="bg-gray-100 ">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>

          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto">
            <h1 className="text-2xl font-semibold mb-4">
              User Verification Dashboard
            </h1>

            <div className="flex space-x-4">
              <input
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
              <DatePicker
                placeholder="Filter by date"
                format="YYYY-MM-DD"
                value={filters.date ? moment(filters.date, "YYYY-MM-DD") : null}
                onChange={(date, dateString) =>
                  handleFilterChange("date", dateString)
                }
              />
            </div>
            <Button onClick={applyFilters}>Apply Filters</Button>

            <div className="bg-white p-4 rounded shadow">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={filteredData} />
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="User Credentials"
          open={detailsVisible}
          onOk={handleDetailsClose}
          onCancel={handleDetailsClose}
        >
          {selectedUser && (
            <div ref={pdfRef} className="h-[70vh] overflow-scroll example">
              <div className="mb-4">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="w-24 h-auto mx-auto"
                />
              </div>

              <h2 className="text-base font-semibold mt-4 mb-2">
                User Information:
              </h2>
              <p>User Name: {selectedUser.userName}</p>
              <p>Email: {selectedUser.email}</p>
              <div>
                <h1 className="font-bold text-xl my-5">Type of User</h1>
                <p>{selectedUser.typeOfUser}</p>
              </div>
              <p>Submission Date: {selectedUser.submissionDate}</p>
              <p className="text-base font-semibold mt-4 mb-2">
                ID Photo:{" "}
                <img
                  src={selectedUser.photo}
                  className="h-64 "
                  alt="User Photo"
                />
              </p>
              <p className="text-base font-semibold mt-4 mb-2">
                Selfie Photo:{" "}
                <img
                  src={selectedUser.selfiePhoto}
                  className="h-64"
                  alt="User Photo"
                />
              </p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserVerificationDashboard;
