import React, { useState } from 'react';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Link } from 'react-router-dom';
import { Table, Input, Select, Modal, Space, Dropdown } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Option } = Select;

export default function CurrentBookingsList() {
  const bookingData = [
    {
      id: 1,
      propertyName: 'Cozy Apartment',
      guestName: 'John Doe',
      total: 100,
      startDate: '2023-10-01',
      endDate: '2023-10-05',
      status: 'Booked',
      hostName:"Host"
    },
    {
      id: 2,
      propertyName: 'Luxury Villa',
      guestName: 'Jane Smith',
      total: 150,
      startDate: '2023-10-06',
      endDate: '2023-10-10',
      status: 'Confirmed',
      hostName:"First"

    },

    {
        id: 3,
        propertyName: 'Luxury Villa',
        guestName: 'Jane Smith',
        total: 150,
        startDate: '2023-10-06',
        endDate: '2023-10-10',
        status: 'Confirmed',
        hostName:"Host Name"

      },
    // Add more booking data as needed
  ];

  const [filterStatus, setFilterStatus] = useState('All');
  const columns = [
    {
      title: 'Property Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
      render: (text, record) => (
        <Link to={`/property/${record.propertyId}`}>{text}</Link>
      ),
    },
    {
      title: 'Guest Name',
      dataIndex: 'guestName',
      key: 'guestName',
      render: (text, record) => (
        <Link to={`/guest/${record.guestId}`}>{text}</Link>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
    },
    {
    title: 'Host Name',
    dataIndex: 'hostName',
    key: 'hostName',
  },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Dropdown
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space className='cursor-pointer'> Edit</Space>
            </a>
          </Dropdown>
          &nbsp; <span onClick={() => handleDeleteHost(record.id)} className='cursor-pointer'>Delete</span>
        </div>
      ),
    },
  
  ];

  const items = [
    {
      label: <div><Link to="/BookingTable">
        see full details
        </Link> </div>,
      key: "0",
    },
    {
      label: <div>Suspend</div>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <div>No idea</div>,
      key: "3",
    },
  ];
  

  const filteredBookingData = bookingData.filter((booking) => {
    if (filterStatus === 'All') {
      return true;
    }
    return booking.status === filterStatus;
  });

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 hidden md:block text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Current Vacation Rental Bookings</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label htmlFor="statusFilter" className="mr-4">
                Filter by Status:
              </label>
              <Select
                id="statusFilter"
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
                style={{ width: 150 }}
              >
                <Option value="All">All</Option>
                <Option value="Booked">Booked</Option>
                <Option value="Confirmed">Confirmed</Option>
                {/* Add more status options as needed */}
              </Select>
            </div>
            <div className="overflow-x-auto">

            <Table
              dataSource={filteredBookingData}
              columns={columns}
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
