import React, { useEffect, useState } from 'react';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Link } from 'react-router-dom';
import { Table, Input, Select, Modal, Space, Dropdown, Spin } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;
import Axios from "../../Axios"
import moment from 'moment';

export default function CurrentBookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchBookings = async () => {
    try {
      const response = await Axios.get('/bookings');
      setBookings(response.data.data);
      console.log(response.data.data);
      setLoading(false); // Set loading to true before fetching data

    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false); // Set loading to false after fetching data (whether successful or not)

    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  

  const [filterStatus, setFilterStatus] = useState('All');
  const columns = [
    {
      title: 'Property Name',
      dataIndex: 'property_name',
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
      dataIndex: 'totalamount',
      key: 'totalamount',
    },
    {
    title: 'Host Name',
    dataIndex: 'hostName',
    key: 'hostName',
  },
  {
    title: 'Start Date',
    dataIndex: 'check-In',
    key: 'check-In',
    render: (text, record) => (
      <span>{moment(record['check-In']).format('dddd, MMMM D YYYY')}</span>
    ),
  },
  {
    title: 'End Date',
    dataIndex: 'check-out',
    key: 'check-out',
    render: (text, record) => (
      <span>{moment(record['check-out']).format('dddd, MMMM D YYYY')}</span>
    ),
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
  

  // const filteredBookingData = bookingData.filter((booking) => {
  //   if (filterStatus === 'All') {
  //     return true;
  //   }
  //   return booking.status === filterStatus;
  // });

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example hidden md:block text-white w-1/5 h-[100vh] p-4">
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
              dataSource={bookings}
              columns={columns}
            />
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
