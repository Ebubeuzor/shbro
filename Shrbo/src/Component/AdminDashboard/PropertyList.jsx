import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import { Table, Button, Input, Modal,Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axiosClient from '../../axoisClient';
import moment from 'moment';
import { LoadingOutlined } from '@ant-design/icons';


const { confirm } = Modal;

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state


  const getAllHomes = () => {
    axiosClient.get("allHomes")
      .then(({ data }) => {
        console.log(data.data);
        setProperties(data.data); // Update the properties state with API data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      }).finally(() => setLoading(false));
  };
  

  useEffect(() => {
    getAllHomes();
  }, []);

  const showConfirm = (propertyId) => {
    confirm({
      title: 'Do you want to delete this property?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        // Implement the logic to delete the property with the given propertyId
        // Update the properties state after deletion
        const updatedProperties = properties.filter((property) => property.id !== propertyId);
        setProperties(updatedProperties);
      },
    });
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProperties = Array.isArray(properties)
  ? properties.filter((apartment) => {
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
    },
    {
      title: 'Added By',
      dataIndex: 'addedBy',
      key: 'addedBy',
      render: (text, record) => record.user.name, // Update this line

    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (text) => moment(text).format('MMMM Do YYYY, h:mm:ss a'),

    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
   
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button type="primary">Edit</Button>
          &nbsp;
          <Button type="danger" onClick={() => showConfirm(record.id)}>
            Delete
          </Button>
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
          <h1 className="text-2xl font-semibold mb-4">Property Listings</h1>
          <div className="bg-white p-4 rounded shadow">
            <Input
              placeholder="Search by Property Name or Added By"
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
      <Table columns={columns} dataSource={filteredProperties} rowKey="id" />
    )}
  </div>
          </div>
        </div>
      </div>
    </div>
  );
}
