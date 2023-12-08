import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Table,Button, Modal, Form, Input, Space, Select } from "antd";
import axiosClient from "../../axoisClient";

export default function UserVerificationPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [verificationModalVisible, setVerificationModalVisible] = useState(false);
  
  const getUserInfo = () => {
    axiosClient.get('userDetail')
    .then(({data}) => {
      console.log(data.data);
      setUsers(data.data)
    })
  }
  
  useEffect(() => {
    getUserInfo();
  },[]);

  const showVerificationModal = (userId) => {
    setSelectedUserId(userId);
    setVerificationModalVisible(true);
  };

  const handleVerificationModalCancel = () => {
    setVerificationModalVisible(false);
  };

  const handleVerificationSubmit = (values) => {
    const data = {
      'status' : values.idStatus
    };
    
    axiosClient.put(`/userDetail/${selectedUserId}`,data)
    .then(() => {
      getUserInfo();
      console.log("done");
    }).catch((e) =>{
      console.log(e);
    })
    setVerificationModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
        </Space>
      ),
    },
  ];
  

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />

      <div className="flex">
        <div className="hidden md:block p-4 bg-orange-400 text-white w-1/5 h-[100vh]">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">User ID Verification</h1>

          <div className="bg-white p-4 shadow">
            <div className="overflow-x-auto">
            <Table columns={columns} dataSource={users} />{" "}

            </div>
          </div>
        </div>
      </div>
      <Modal
      title="Verify User ID"
      open={verificationModalVisible}
      onCancel={handleVerificationModalCancel}
      footer={null}>
        <Form name="verification" onFinish={handleVerificationSubmit} >
            <Form.Item
            name="idStatus"
            label="ID Status"
            rules={[{required: true, message:"Please selected an ID Status"}]}
            >
                <Select placeholder="Select ID Card">
                    <Option value="Verified">Verified</Option>
                    <Option value="Decline">Decline</Option>
                    <Option value="Photo Not Clear">Photo Not Clear</Option>

                </Select>

            </Form.Item>
            <Form.Item>
                    <img src={users.find((user) => user.id === selectedUserId)?.photo}
                     alt="User" 
                     style={{maxWidth:"50%"}}
                     />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" >
                        submit
                    </Button>
                </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
