import React from 'react';
import { Table } from 'antd';
import AdminHeader from './AdminNavigation/AdminHeader';
import AdminSidebar from './AdminSidebar';

const ReceivablePayable = () => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Booking No',
      dataIndex: 'bookingNo',
      key: 'bookingNo',
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

  const data = [
    {
      key: '1',
      date: '2023-10-15',
      bookingNo: 'B001',
      hostEmail: 'host1@example.com',
      totalAmount: '$200',
      guestServiceCharge: '$30',
      hostServiceCharge: '$20',
      netProfit: '$150',
      amountToHost: '$180',
    },
    {
      key: '2',
      date: '2023-10-14',
      bookingNo: 'B002',
      hostEmail: 'host2@example.com',
      totalAmount: '$250',
      guestServiceCharge: '$40',
      hostServiceCharge: '$30',
      netProfit: '$180',
      amountToHost: '$220',
    },
    {
      key: '3',
      date: '2023-10-13',
      bookingNo: 'B003',
      hostEmail: 'host3@example.com',
      totalAmount: '$220',
      guestServiceCharge: '$35',
      hostServiceCharge: '$25',
      netProfit: '$160',
      amountToHost: '$195',
    },
  ];

  return (
    <div className="bg-gray-100 h-[100vh]">
        <AdminHeader/>
        <div className="flex">
        <div className="bg-orange-400  text-white hidden md:block md:w-1/5 h-[100vh] p-4">
        <AdminSidebar/>

        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
        <h1 className="text-2xl font-semibold mb-4">Receivable & Payable</h1>
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

export default ReceivablePayable;
