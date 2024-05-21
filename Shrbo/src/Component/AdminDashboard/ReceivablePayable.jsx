import React, { useEffect, useState } from 'react';
import { Table,Spin } from 'antd';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import Axios from "../../Axios"
import moment from 'moment';
const ReceivablePayable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Initially set to true

  const columns = [
    {
      title: 'Date',
      dataIndex: 'Date',
      key: 'date',
      render: (text) => {
        return moment(text).format('dddd, D MMMM YYYY');
      },
    },
    {
      title: 'Booking No',
      dataIndex: 'paymentId',
      key: 'paymentId',
    },
    {
      title: 'Host Email',
      dataIndex: 'hostEmail',
      key: 'hostEmail',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
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
  ];


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get('/receivablePayable');
        setData(response.data.data);
        setLoading(false); // Set loading to false after data is fetched
        console.log(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false on error as well
      }
    };
    fetchData();
  }, []);


  

  return (
    <div className="bg-gray-100 h-[100vh]">
        <AdminHeader/>
        <div className="flex">
        <div className="bg-orange-400 overflow-scroll example  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
        <AdminSidebar/>

        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
        <h1 className="text-2xl font-semibold mb-4">Receivable & Payable</h1>
        <div className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <p className="text-sm text-gray-400">
            Receivable & Payable section indeed shows the amount that is being paid to the host for each booking. This includes the total amount of the booking, any service charges, and the final amount that is payable to the host. This information is crucial for transparency and ensuring that hosts are aware of their earnings from each booking
            </p>
          </div>
          <div className="overflow-x-auto">
          <Spin spinning={loading}>
                <Table columns={columns} dataSource={data} />
              </Spin>          </div>
        </div>
      </div>
        </div>
    </div>
  );
};

export default ReceivablePayable;
