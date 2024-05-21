import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table, Button, Modal, Form, Input, Space, Select, Spin,notification } from "antd";
import Axios from ".././../Axios";
import { LoadingOutlined } from "@ant-design/icons";

export default function UserVerificationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [livePhotoModalVisible, setLivePhotoModalVisible] = useState(false);
  const [selectedUserPhoto, setSelectedUserPhoto] = useState("");
  const [selectedUserLivePhoto, setSelectedUserLivePhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // State for submitting status

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/userDetail");
        setUsers(response.data.data);
        setLoading(false); // Set loading to false after data is fetched
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false); // Set loading to false in case of error
        // Handle error, show error message, etc.
      }
    };

    fetchUsers();
  }, []);

  const showVerificationModal = (userId) => {
    setSelectedUserId(userId);
    setVerificationModalVisible(true);
  };

  const handleVerificationModalCancel = () => {
    setVerificationModalVisible(false);
  };

  const handleVerificationSubmit = async (values) => {
    try {
      setSubmitting(true); // Set submitting to true when starting the update

      const { idStatus, firstName, lastName, email, verification_type, government_id, live_photo, country, street, emergency_no, zipCode, state, city, profilePicture } = values;

      await Axios.put(`/userDetail/${selectedUserId}`, {
        idStatus,
        firstName,
        lastName,
        email,
        verification_type,
        government_id,
        live_photo,
        country,
        street,
        emergency_no,
        zipCode,
        state,
        city,
        status: idStatus,
        profilePicture
      });

      const updatedUsers = users.map((user) => {
        if (user.id === selectedUserId) {
          return {
            ...user,
            idStatus,
            firstName,
            lastName,
            email,
            verification_type,
            government_id,
            live_photo,
            country,
            street,
            emergency_no,
            zipCode,
            state,
            city,
            status: idStatus,
            profilePicture
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      setVerificationModalVisible(false);
      notification.success({ message: "Update Successful", description: "User details have been updated successfully" });
    } catch (error) {
      console.error("Error updating user details:", error);
      notification.error({ message: "Update Failed", description: "Failed to update user details. Please try again later" });
    } finally {
      setSubmitting(false); // Set submitting back to false after update is finished
    }
  };



  const openPhotoModal = (photoUrl) => {
    setSelectedUserPhoto(photoUrl);
    setPhotoModalVisible(true);
  };

  const openLivePhotoModal = (livePhotoUrl) => {
    setSelectedUserLivePhoto(livePhotoUrl);
    setLivePhotoModalVisible(true);
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Verification Type",
      dataIndex: "verification_type",
      key: "verification_type",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ID Status",
      dataIndex: "idStatus",
      key: "idStatus",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => showVerificationModal(record.id)}
          >
            Verify ID
          </Button>
          <Button onClick={() => openPhotoModal(record.photo)}>View Photo</Button>
          <Button onClick={() => openLivePhotoModal(record.live_photo)}>
            View Live Photo
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />

      <div className="flex">
        <div className="hidden md:block overflow-scroll example p-4 bg-orange-400 text-white w-1/5 h-[100vh]">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">
            User ID Verification
          </h1>

          <div className="bg-white p-4 shadow">
            <div className="mb-4">
              <div className="text-gray-400 text-sm">
              The User ID Verification section is designed to manage the verification process of users on your platform.
              </div>
            </div>
            {loading ? ( // Render loader if loading state is true
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
                <Table columns={columns} dataSource={users}  rowKey="id" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title="Verify User ID"
        open={verificationModalVisible}
        onCancel={handleVerificationModalCancel}
        footer={null}
      >
        <Form name="verification" onFinish={handleVerificationSubmit}>
          <Form.Item
            name="idStatus"
            label="ID Status"
            rules={[
              { required: true, message: "Please select an ID Status" },
            ]}
          >
            <Select placeholder="Select ID Card">
              <Option value="Verified">Verified</Option>
              <Option value="Pending Verification">Pending Verification</Option>
              <Option value="Decline">Decline</Option>
              <Option value="Photo Not Clear">Photo Not Clear</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="User Photo"
        open={photoModalVisible}
        onCancel={() => setPhotoModalVisible(false)}
        footer={null}
      >
        <img src={selectedUserPhoto} alt="User Photo" style={{ width: "100%" }} />
      </Modal>
      <Modal
        title="User Live Photo"
        open={livePhotoModalVisible}
        onCancel={() => setLivePhotoModalVisible(false)}
        footer={null}
      >
        <img src={selectedUserLivePhoto} alt="User Live Photo" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
}
