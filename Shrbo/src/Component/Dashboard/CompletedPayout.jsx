import React, { useState, useRef, useEffect } from "react";
import { Table } from 'antd';
import qs from 'qs';
import axios from "../../Axios"

const getRandomuserParams = (params) => ({
  per_page: params.pagination?.pageSize,
  page: params.pagination?.current,
  // ...params,
});

export default function PayoutTable() {
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });
  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Host',
      dataIndex: 'hostname',
      key: 'hostname',
    },
    {
      title: 'Date ',
      dataIndex: 'dateTime',
      key: 'dateTime',
    },
    {
      title: 'Apartment Listing',
      dataIndex: 'apartmentName',
      key: 'apartmentName',
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
      title: 'Security Fee',
      dataIndex: 'securityFee',
      key: 'securityFee',
    },
    {
      title: 'Service Fee',
      dataIndex: 'serviceFee',
      key: 'serviceFee',
    },

    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Guest Stay',
      dataIndex: 'duration_of_stay',
      key: 'duration_of_stay',
    },
    {
      title: 'Amount per Night',
      dataIndex: 'amountForOneNight',
      key: 'amountForOneNight',
    },
    {
      title: 'CheckIn Time',
      dataIndex: 'check_in',
      key: 'check_in',
    },
    {
      title: 'CheckOut Time',
      dataIndex: 'check_out',
      key: 'check_out',
    },
  ];

  // const data = [
  //   {
  //     key: '1',
  //     transactionId: 'T12345',
  //     dateTime: '2023-11-02 14:30:00',
  //     apartmentId: 'A67890',
  //     amountPaid: 1500,
  //     paymentStatus: 'Completed',
  //     adminUserId: 'admin123',
  //     hostUserId: 'host456',
  //     paymentDescription: 'Payment for apartment rental',
  //   },
  //   {
  //     key: '2',
  //     transactionId: 'T12345',
  //     dateTime: '2023-11-02 14:30:00',
  //     apartmentId: 'A67890',
  //     amountPaid: 1500,
  //     paymentStatus: 'Completed',
  //     adminUserId: 'admin123',
  //     hostUserId: 'host456',
  //     paymentDescription: 'Payment for apartment rental',
  //   },
  // ];

  function formatAmountWithCommas(amount) {
    // Convert the amount to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = amount.toString().split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts with a dot if there is a decimal part
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    return formattedAmount;
  }

  const fetchData = async () => {
    setLoading(true);
    await axios.get(`/hostCompletedPayoutsHistory?${qs.stringify(getRandomuserParams(tableParams))}`).then(response => {
      const results = response.data.data.map(item => ({


        key: item.id,
        transactionId: item.transactionID,
        dateTime: item.paymentDate,
        apartmentId: item.propertyID,
        apartmentName: item.propertyName,
        paymentMethod: item.paymentMethod?.toUpperCase(),
        amountPaid:item.paymentAmount?formatAmountWithCommas(item.paymentAmount):"",
        paymentStatus: 'Completed',
        hostname: item.hostname,
        securityFee:item.securityFee?formatAmountWithCommas(item.securityFee):"",
        duration_of_stay: `${item.duration_of_stay} Night(s)`,
        amountForOneNight:item.amountForOneNight? ` ${formatAmountWithCommas(item.amountForOneNight)}`:"",
        serviceFee:item.serviceFee?formatAmountWithCommas(item.serviceFee):"",
        check_in:item.check_in,
        check_out: item.check_out



      }));
      setData(results);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: response.data.meta.total,
          // 200 is mock data, you should read it from server
          // total: data.totalCount,
        },
      });

      console.table(response.data)
      console.log(`/transactionHistory?${qs.stringify(getRandomuserParams(tableParams))}`)

    }).catch(err => {
      console.log(err);

    }).finally(() => {
      setLoading(false);
    });

  }

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `per_page` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <Table columns={columns} onChange={handleTableChange} className=" w-full overflow-x-scroll " pagination={tableParams.pagination} dataSource={dataSource} loading={loading} />
  );
}
