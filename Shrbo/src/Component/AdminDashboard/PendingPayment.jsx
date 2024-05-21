import React, { useEffect, useState } from "react";
import { Table, Space, Input, DatePicker, Select, Dropdown,Spin,notification } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { parse, isAfter } from 'date-fns';
import Axios from "../../Axios"
import moment from "moment";


const { RangePicker } = DatePicker;
const { Option } = Select;

const PendingPayment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    hostName: "",
    amount: "",
    dateRange: null,
  });


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await Axios.get('/viewRequestsToApprove');
        setData(response.data.payment_requests);
        console.log(response.data.payment_requests);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    // {
    //   title: 'Date',
    //   dataIndex: 'Date',
    //   key: 'Date',
      
    // },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Bank Name',
      dataIndex: 'bank_name',
      key: 'bank_name',
    },

    {
      title: 'Account Number',
      dataIndex: 'account_number',
      key: 'account_number',
    },
    {
      title: "User Email",
      dataIndex: ["user", "email"],
      key: "user_email",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      key: "user_name",
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (totalAmount) => (
        <span>
          ₦{new Intl.NumberFormat().format(totalAmount)}
        </span>
      ),
    },
    {
      title: 'Account Name',
      dataIndex: 'account_name',
      key: 'account_name',
    },
   
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Dropdown
            menu={{
              items: [
                {
                  label: <div>Approve</div>,
                  key: "0",
                  onClick: (e) => handleApprove(record.id),
                },
                // {
                //   label: <div>Decline</div>,
                //   key: "1",
                // },
              ],
            }}
            trigger={["click"]}
          >
            <a onClick={(e) => e.preventDefault()}>Edit</a>
          </Dropdown>
        </Space>
      ),
    },
  ];



  // const filteredData = data.filter((record) => {
  //   const { hostName, amount, dateRange } = filters;
  //   const paymentDate = parse(record.paymentDate, 'yyyy-MM-dd', new Date());
  
  //   const matchesEmail = record.hostName.toLowerCase().includes(hostName.toLowerCase());
  //   const matchesAmount = record.totalAmount.toLowerCase().includes(amount.toLowerCase());
  
  //   // Check if the payment date is within the selected date range
  //   let matchesDate = true;
  //   if (dateRange) {
  //     const [startDate, endDate] = dateRange;
  //     if (startDate && endDate) {
  //       matchesDate =
  //         isAfter(paymentDate, startDate) && isAfter(endDate, paymentDate);
  //     }
  //   }
  
  //   return matchesEmail && matchesAmount && matchesDate;
  // });
  

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
      onClick: (e) => handleApprove(e, record.paymentId),
    },
    {
      label: <div>Decline</div>,
      key: "1",
    },
  
  ];

  const handleApprove = async (requestId) => {
    try {
      await Axios.get(`/approvePaymentRequest/${requestId}`);
      notification.success({
        message: 'Payment Approved',
        description: 'The payment request has been approved successfully.',
      });
      // Assuming success means refreshing the data
      window.location.reload();
    } catch (error) {
      console.error('Error approving payment request:', error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while approving the payment request. Please try again later.',
      });
    }
  };
  
  

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Pending Payments</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <div className="text-gray-400 text-sm">
              The Pending Payment section is where you can manage and approve payout requests made by hosts.
              </div>
            </div>
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
            <Spin spinning={loading}>
                <Table columns={columns} dataSource={data} rowKey="paymentId" />
              </Spin>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingPayment;
