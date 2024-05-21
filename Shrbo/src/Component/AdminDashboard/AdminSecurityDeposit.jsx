import React, { useEffect, useState } from 'react';
import { Table,Spin} from 'antd';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';
import Axios from "../../Axios"
import moment from 'moment';
export default function AdminSecurityDeposit() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Initially set to true

    const columns = [
      {
        title: 'Date',
        dataIndex: 'payment_date',
        key: 'payment_date',
        render: (text) => {
          return moment(text).format('dddd, D MMMM YYYY');
        },
      },
      {
        title: 'Booking No',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'UserName',
        dataIndex: 'user_name',
        key: 'user_name',
      },
      {
        title: 'Security Deposit',
        dataIndex: 'security_deposit',
        key: 'security_deposit',
      },
      {
        title: 'Status  ',
        dataIndex: 'status',
        key: 'status',
      },
      
      {
        title: 'Email',
        dataIndex: 'user_email',
        key: 'user_email',
      },

      
      
    ];

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await Axios.get('/getPendingSecurityDeposits');
          setData(response.data.pending_security_deposits);
          setLoading(false); // Set loading to false after data is fetched
          console.log(response.data);
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
            <h1 className="text-2xl font-semibold mb-4">Pending Security Deposit</h1>
            <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
              The Pending Security Deposit section provides a detailed overview of all the security deposits for hosts that are currently pending. 
              </p>
            </div>
              <div className="overflow-x-auto">
              <Spin spinning={loading}>
                  <Table columns={columns} dataSource={data} />
                </Spin>              </div>
            </div>
          </div>
            </div>
        </div>
      );
}
