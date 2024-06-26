import React, { useState, useRef, useEffect } from "react";
import { Table, Space, Input, DatePicker, Select, Dropdown, Modal,Spin } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { parse, isAfter } from "date-fns";
import { usePDF } from "react-to-pdf";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Logo from "../../assets/logo.png";
import Axios from '../../Axios'
import moment from 'moment'; // Import moment


const { RangePicker } = DatePicker;
const { Option } = Select;

const { confirm } = Modal;

const DisplayBookingsPaid = () => {
  const [filters, setFilters] = useState({
    email: "",
    amount: "",
    dateRange: null,
  });



  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading status

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      setLoading(true); // Set loading to true when fetching data
      try {
        const response = await Axios.get("/paidPayments");
        setPaymentData(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      } finally {
        setLoading(false); // Set loading to false when data is fetched
      }
    };

    fetchTransactionHistory();
  }, []);

  const handleDeleteHost = () => {
    confirm({
      title: "Do you want to delete this host?",
      icon: <ExclamationCircleOutlined />,
      onOk() {},
    });
  };

  const downloadPDF = () => {
    if (selectedPayment) {
      toPDF(pdfRef, {
        unit: "mm",
        format: "a4",
      });
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const pdfRef = useRef(); // Create a ref for the PDF content

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const items = [
    {
      label: <div>No idea</div>,
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

  const columns = [
    {
      title: 'Date',
      dataIndex: 'paiddate',
      key: 'paiddate',
      
    },
    {
      title: 'Id',
      dataIndex: 'user_id',
      key: 'user_id',
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
      dataIndex: "userEmail",
      key: "userEmail",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      key: 'amountPaid',
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
   
   
  ];

  const data = [
    {
      key: "1",
      username: "darwinnuez@gmail.com",
      paymentDate: "2023-10-15",
      bookingNo: "B001",
      totalAmount: "$100",
      paymentType: "Visa Card",
      status: "Paid",
    },
    {
      key: "2",
      username: "kobiko@gmail.com",
      paymentDate: "2023-10-14",
      bookingNo: "B002",
      totalAmount: "$150",
      paymentType: "Transfer",
      status: "Paid",
    },
    {
      key: "3",
      username: "myemailaddress123@gmail.com",
      paymentDate: "2023-10-13",
      bookingNo: "B003",
      totalAmount: "$120",
      paymentType: "Verve Card",
      status: "Paid",
    },
  ];

  const filteredData = data.filter((record) => {
    const { email, amount, dateRange } = filters;
    const paymentDate = parse(record.paymentDate, "yyyy-MM-dd", new Date());

    const matchesEmail = record.username
      .toLowerCase()
      .includes(email.toLowerCase());
    const matchesAmount = record.totalAmount
      .toLowerCase()
      .includes(amount.toLowerCase());

    // Check if the payment date is within the selected date range
    let matchesDate = true;
    if (dateRange) {
      const [startDate, endDate] = dateRange;
      if (startDate && endDate) {
        matchesDate =
          isAfter(paymentDate, startDate) && isAfter(endDate, paymentDate);
      }
    }

    return matchesEmail && matchesAmount && matchesDate;
  });

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Paid Payments</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">
              Paid Payment section provides a record of all the payout requests that have been successfully processed and paid out to the hosts or guest.
              </p>
            </div>
            
            <div className="mb-4 flex justify-end">
              <Input
                placeholder="Filter by Email"
                value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)}
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
            <Spin spinning={loading}> {/* Use Spin component for loading */}
                {filteredData.length > 0 ? (
                  <Table columns={columns} dataSource={paymentData} rowKey="paymentId" />
                ) : (
                  <div>No data found.</div>
                )}
              </Spin>
            </div>

            <Modal
              title="Payment Receipt"
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
              className="receipt-container"
            >
              {selectedPayment && (
                <div>
                  <div
                    className="bg-white p-4 border border-black w-full"
                    ref={targetRef}
                  >
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm">

                      </div>
                    </div>
                    <img
                      src={Logo}
                      alt="Company Logo"
                      className="w-16 h-auto"
                    />
                    <div className="receipt-header flex justify-between items-center">
                      <h2 className="text-xl font-semibold">
                        Your payment receipt from Shbro
                      </h2>
                    </div>

                    <div className="receipt-details mt-4">
                      <div className="guestPaid">
                        <h2 className="text-lg font-semibold mb-2">
                          Payment Details
                        </h2>
                        <div className="flex justify-between mb-2">
                          <span>Email:</span>
                          <span>{selectedPayment.hostEmail}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Payment Date:</span>
                          <span>{selectedPayment.paidHostdate}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Booking No:</span>
                          <span>{selectedPayment.paymentId}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Total Amount:</span>
                          <span>₦{selectedPayment.amountToHost.toLocaleString("en-NG")}</span>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                          <span>Status:</span>
                          <span>{selectedPayment.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={downloadPDF}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-700 mt-4"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayBookingsPaid;
