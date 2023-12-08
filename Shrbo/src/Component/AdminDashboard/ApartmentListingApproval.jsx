import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Table, Button, Input, Modal,Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axiosClient from '../../axoisClient';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';


const { confirm } = Modal;

export default function ApartmentListingApproval() {
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedApartmentId, setSelectedApartmentId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const [selectedUser, setSelectedUser] = useState(null); // Add state for selected user

  const getUnVerified = () => {
    axiosClient.get("notVerified")
      .then(({ data }) => {
        console.log(data.data); // Add this line

        setApartments(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        
      }).finally(() => setLoading(false));
  }


  useEffect(() => {
    getUnVerified();
  }, []);

  // Sample data for demonstration purposes



  const showDeclineModal = (apartmentId, user) => {
    console.log('Show Decline Modal - User:', user); // Log the user object
    console.log('Show Decline Modal - apartmentId:', apartmentId); // Log the user object

    setDeclineModalVisible(true);
    setSelectedApartmentId(apartmentId);
    setSelectedUser(user); // Store the user object in state
  };
  

  const approval = (apartmentId) => {
    console.log(apartmentId);
  };

  const hideDeclineModal = () => {
    setDeclineModalVisible(false);
    setSelectedApartmentId(null);
    setDeclineReason('');
  };

  const handleDeclineReasonChange = (event) => {
    setDeclineReason(event.target.value);
  };

  const handleDecline = (apartment, user, userIdToMatch) => {
    // Log the selected user object
    console.log('Selected User Object:', user);
  
    // Log the selected apartment object
    console.log('Selected Apartment Object:', apartment);
  
    // Check if the user ID matches the specified user ID
    if (user && user.id === userIdToMatch) {
      // Print out the user object for the matched user ID
      console.log(`User with ID ${userIdToMatch} Object:`, user);
    } else {
      console.log(`User with ID ${userIdToMatch} not found.`);
    }
  
    // Log the message object and user object
    console.log('Message Object:', {
      text: 'Decline reason sent successfully',
      reason: declineReason, // Include the decline reason
      userObject: user ? user : null, // Include the entire user object
      timestamp: Date.now(),
    });
  
    // Reset modal state
    hideDeclineModal();
  };
  
  
  
  
  


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredApartments = Array.isArray(apartments)
  ? apartments.filter((apartment) => {
      return (
        apartment &&
        apartment.title && // Assuming 'title' is the correct property name
        apartment.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  : [];

  
  

  const columns = [
    {
      title: 'Property Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Property ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`,
    },
    {
      title: 'Added By',
      dataIndex: 'user.name',
      key: 'user.name',
      render: (text, record) => record.user.name, // Update this line

    },
    {
      title: 'Created On',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('MMMM Do YYYY, h:mm:ss a'),

    },
    {
      title: 'Status',
      dataIndex: 'adminStatus',
      key: 'adminStatus',
    },
    {
      title: 'User Verified',
      dataIndex: 'verified',
      key: 'verified',
      render: (verified) => (verified === 'Verified' ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div key={record.id}>
        <Button type="primary" key="approve" onClick={() => approval(record.id)}>
          Approve
        </Button>
        <Button type="danger" key="decline" onClick={() => showDeclineModal(record.id)}>
          Decline
        </Button>
        <Link to="/" key="viewDetails">
          <Button type="default">View Details</Button>
        </Link>
      </div>
      ),
    },
  ];
  
  

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Approve Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <Input
              placeholder="Search by Property Name"
              value={searchQuery}
              onChange={handleSearch}
              style={{ width: 200, marginBottom: '1rem' }}
            />
           <div className="overflow-x-auto">

          {loading ? (
                <div className="mx-auto flex justify-center items-center ">
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
                <Table columns={columns} dataSource={filteredApartments} rowKey="id" />
              )}
            </div>

          </div>
        </div>
      </div>
      <Modal
  title="Provide a reason for declining"
  open={declineModalVisible}
  onOk={() => handleDecline(selectedApartmentId, selectedUser)}
  onCancel={hideDeclineModal}
  okText="Submit"
  cancelText="Cancel"
>
  <Input.TextArea
    value={declineReason}
    onChange={handleDeclineReasonChange}
    placeholder="Enter your reason here..."
  />
  <Button type="primary" onClick={() => { console.log(selectedUser); handleDecline(selectedApartmentId, selectedUser); }}>
    Submit
  </Button>
</Modal>
    </div>
  );
}
