import React from "react";
import { Table, Space } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";

const FailedPayment = () => {
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "username",
    },
    {
      title: "Payment Date",
      dataIndex: "paymentDate",
      key: "paymentDate",
    },
    {
      title: "Booking No",
      dataIndex: "bookingNo",
      key: "bookingNo",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      email: "mail1@mail.com",
      paymentDate: "2023-10-15",
      bookingNo: "B001",
      totalAmount: "$100",
      paymentType: "Credit Card",
      status: "decline",
    },
    {
      key: "2",
      email: "mail2@mail.com",
      paymentDate: "2023-10-14",
      bookingNo: "B002",
      totalAmount: "$150",
      paymentType: "PayPal",
      status: "decline",
    },
    {
      key: "3",
      email: "mail3@mail.com",
      paymentDate: "2023-10-13",
      bookingNo: "B003",
      totalAmount: "$120",
      paymentType: "Credit Card",
      status: "decline",
    },
  ];

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
        <AdminSidebar/>

        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
        <h1 className="text-2xl font-semibold mb-4">Failed Payment</h1>
        <div className="bg-white p-4 rounded shadow">
          <div className="overflow-x-auto">
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FailedPayment;
