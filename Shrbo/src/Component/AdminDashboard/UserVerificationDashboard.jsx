import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Modal, Spin } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";
import moment from "moment";
import Axios from "../../Axios";
import { DatePicker} from "antd";
import { ExclamationCircleOutlined, LoadingOutlined } from "@ant-design/icons";


const UserVerificationDashboard = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", date: "" });
  const pdfRef = useRef();
  const { toPDF, targetRef } = usePDF({ filename: "user_verification.pdf" });

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
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

  const fetchUnverifiedUsers = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/getVerifiedUsers");
      setFilteredData(response.data.data);
      console.log(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching unverified users:", error);
      message.error("Failed to fetch unverified users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

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
    let filtered = filteredData;

    if (filters.name) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase())
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
          <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>

          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto">
            <h1 className="text-2xl font-semibold mb-4">
              User Verification Dashboard
            </h1>

            <div className="flex space-x-4 mb-5">
             
              <DatePicker
                placeholder="Filter by date"
                format="YYYY-MM-DD"
                value={filters.date ? moment(filters.date, "YYYY-MM-DD") : null}
                onChange={(date, dateString) =>
                  handleFilterChange("date", dateString)
                }
              />
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="mb-4">
                <div className="text-gray-400 text-sm">
                The User Verification Dashboard then displays a list of users who have successfully completed the verification process on your platform
                </div>
              </div>
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
                <div className="overflow-x-auto">
                  <Table columns={columns} dataSource={filteredData}   rowKey={(record) => record.id} // Assuming id is the unique identifier
 />
                </div>
              )}
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
              <p>
                <strong>User Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Verification Document:</strong>{" "}
                {selectedUser.verification_type}
              </p>

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
                Live Photo:{" "}
                <img
                  src={selectedUser.live_photo}
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
