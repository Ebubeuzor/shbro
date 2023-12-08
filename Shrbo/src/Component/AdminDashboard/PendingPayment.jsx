import React, { useState } from "react";
import { Table, Space, Input, DatePicker, Select, Dropdown } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { parse, isAfter } from 'date-fns';


const { RangePicker } = DatePicker;
const { Option } = Select;

const PendingPayment = () => {

  const [filters, setFilters] = useState({
    hostName: "",
    amount: "",
    dateRange: null,
  });


  const columns = [
    {
      title: "Host",
      dataIndex: "hostName",
      key: "hostName",
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
        title: 'Guest Service Charge',
        dataIndex: 'guestServiceCharge',
        key: 'guestServiceCharge',
      },
      {
        title: 'Host Service Charge',
        dataIndex: 'hostServiceCharge',
        key: 'hostServiceCharge',
      },
      {
        title: 'Net Profit',
        dataIndex: 'netProfit',
        key: 'netProfit',
      },
      {
        title: 'Amount to Host',
        dataIndex: 'amountToHost',
        key: 'amountToHost',
      },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
            <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>Edit</Space>
            </a>
          </Dropdown>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      hostName: "Darwin Nuez",
      paymentDate: "2023-10-15",
      bookingNo: "B001",
      totalAmount: "$100",
      paymentType: "Visa Card",
      status: "Pending",
      guestServiceCharge: '$30',
      hostServiceCharge: '$20',
      netProfit: '$150',
      amountToHost: '$180',
    },
    {
      key: "2",
      hostName: "kobiko",
      paymentDate: "2023-10-14",
      bookingNo: "B002",
      totalAmount: "$150",
      paymentType: "Transfer",
      status: "Pending",
      guestServiceCharge: '$40',
      hostServiceCharge: '$30',
      netProfit: '$180',
      amountToHost: '$220',
    },
    {
      key: "3",
      hostName: "myemailaddress23",
      paymentDate: "2023-10-13",
      bookingNo: "B003",
      totalAmount: "$120",
      paymentType: "Verve Card",
      status: "Pending",
      guestServiceCharge: '$35',
      hostServiceCharge: '$25',
      netProfit: '$160',
      amountToHost: '$195',
    },
  ];

  const filteredData = data.filter((record) => {
    const { hostName, amount, dateRange } = filters;
    const paymentDate = parse(record.paymentDate, 'yyyy-MM-dd', new Date());
  
    const matchesEmail = record.hostName.toLowerCase().includes(hostName.toLowerCase());
    const matchesAmount = record.totalAmount.toLowerCase().includes(amount.toLowerCase());
  
    // Check if the payment date is within the selected date range
    let matchesDate = true;
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      if (startDate && endDate) {
        matchesDate =
          isAfter(paymentDate, startDate) && isAfter(endDate, paymentDate);
      }
    }
  
    return matchesEmail && matchesAmount && matchesDate;
  });
  

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const items = [
    {
      label: <div>Approve</div>,
      key: "0",
    },
    {
      label: <div>Decline</div>,
      key: "1",
    },
  
  ];

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Pending Payments</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4 flex justify-end">
              <Input
                placeholder="Filter by Host Name"
                value={filters.hostName}
                onChange={(e) => handleFilterChange("hostName", e.target.value)}
              />
              <Input
                placeholder="Filter by Amount"
                value={filters.amount}
                onChange={(e) => handleFilterChange("amount", e.target.value)}
              />
              <RangePicker
                placeholder={["Start Date", "End Date"]}
                value={filters.dateRange}
                onChange={(dates) => handleFilterChange("dateRange", dates)}
              />
            </div>
            <div className="overflow-x-auto">
              {filteredData.length > 0 ? (
                <Table columns={columns} dataSource={filteredData} />
              ) : (
                <div>No data found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
