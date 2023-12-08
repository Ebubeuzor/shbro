import React from 'react';
import { Table } from 'antd';

export default function PayoutTable() {
    const columns = [
        {
          title: 'Transaction ID',
          dataIndex: 'transactionId',
          key: 'transactionId',
        },
        {
          title: 'Date and Time',
          dataIndex: 'dateTime',
          key: 'dateTime',
        },
        {
          title: 'Apartment Listing ID',
          dataIndex: 'apartmentId',
          key: 'apartmentId',
        },
        {
          title: 'Payment Amount',
          dataIndex: 'amountPaid',
          key: 'amountPaid',
        },
     
        {
          title: 'Payment Status',
          dataIndex: 'paymentStatus',
          key: 'paymentStatus',
        },
        {
          title: 'Admin User ID',
          dataIndex: 'adminUserId',
          key: 'adminUserId',
        },
        {
          title: 'Host User ID',
          dataIndex: 'hostUserId',
          key: 'hostUserId',
        },
        {
          title: 'Payment Description',
          dataIndex: 'paymentDescription',
          key: 'paymentDescription',
        },
      ];

  const data = [
    {
      key: '1',
      transactionId: 'T12345',
  dateTime: '2023-11-02 14:30:00',
  apartmentId: 'A67890',
  amountPaid: 1500,
  paymentStatus: 'Completed',
  adminUserId: 'admin123',
  hostUserId: 'host456',
  paymentDescription: 'Payment for apartment rental',
    },
    {
      key: '2',
      transactionId: 'T12345',
      dateTime: '2023-11-02 14:30:00',
      apartmentId: 'A67890',
      amountPaid: 1500,
      paymentStatus: 'Completed',
      adminUserId: 'admin123',
      hostUserId: 'host456',
      paymentDescription: 'Payment for apartment rental',
    },
  ];

  return (
    <Table columns={columns} dataSource={data} />
  );
}
