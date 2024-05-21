import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";
import axios from "../../Axios";
import qs from 'qs';

// const sampleBookingDetails = {
//   bookingDetails1: {
//     guestName: "Jane Smith",
//     roomPerNightPrice: 100, // Replace with the actual price per night
//     guestServiceFee: 20, // Replace with the actual guest service fee
//     numNights: 10,
//     nightlyRateAdjustment: -50.7,
//     hostServiceFee: -28.9,
//   },
//   bookingDetails2: {
//     guestName: "John Doe",
//     roomPerNightPrice: 120, // Replace with the actual price per night
//     guestServiceFee: 25, // Replace with the actual guest service fee
//     numNights: 8,
//     nightlyRateAdjustment: -40.6,
//     hostServiceFee: -23.5,
//   },
// };

// const data = [
//   {
//     key: "1",
//     guestName: "John Doe",
//     transactionId: "T12345",
//     numGuests: 2,
//     propertyId: "ABC123",
//     amountReceivedByHost: 70,
//     paymentAmount: 100,
//     serivceCharge: 10,
//   },
//   {
//     key: "2",
//     guestName: "Jane Smith",
//     transactionId: "T12345",
//     numGuests: 3,
//     propertyId: "XYZ789",
//     amountReceivedByHost: 85,
//     paymentAmount: 150,
//     serivceCharge: 15,
//   },
//   // Add more booking data as needed
// ];

const getRandomuserParams = (params) => ({
  per_page: params.pagination?.pageSize,
  page: params.pagination?.current,
});


const HostTransactionHistory = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBreakdowns, setShowBreakdowns] = useState(false);
  const pdfRef = useRef(); // Create a ref for the PDF content
  const [dataSource, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  });

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Listings",
      dataIndex: "apartmentName",
      key: "apartmentName",
    },
    {
      title: "Property ID",
      dataIndex: "propertyId",
      key: "propertyId",
    },
    {
      title: "Payment Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
    },
    {
      title: " Amount Received By Host",
      dataIndex: "amountReceivedByHost",
      key: "amountReceivedByHost",
    },
    // {
    //   title: "Service Charge",
    //   dataIndex: "serivceCharge",
    //   key: "serivceCharge",
    // },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewBookingDetails(record)}>View Details</Button>
      ),
    },
  ];

  const downloadPDF = () => {
    if (selectedBooking) {
      toPDF(pdfRef, {
        unit: "mm",
        format: "a4", // Set the format to A4 paper size
      });
    }
  };

  const renderBreakdowns = (booking) => {
    const totalNightsFee = booking.roomPerNightPrice*booking.numNights;

    return (
      <div className="breakdoguestPaid4">
        <h2 className="text-base font-semibold mt-4 mb-2">Breakdowns</h2>
        <div className="flex justify-between">
          <span>{booking.numNights} nights room fee</span>
          <span>₦{formatAmountWithCommas(totalNightsFee)}</span>
        </div>
     
        <div className="flex justify-between">
          <span>Host service fee ({booking.serviceFeePercentage}%)</span>
          <span>₦{formatAmountWithCommas(booking.hostServiceFee)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total (NGN)</span>
          <span>₦{booking.amountReceivedByHost}</span>
        </div>
      </div>
    );
  };

  const viewBookingDetails = (booking) => {
  
      setSelectedBooking(booking);
      setDetailsVisible(true);
  
  };

  const handleDetailsClose = () => {
    setDetailsVisible(false);
    setShowBreakdowns(false);
  };

  const toggleBreakdowns = () => {
    setShowBreakdowns(!showBreakdowns);
  };

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
    await axios.get(`/hostTransactionHistory?${qs.stringify(getRandomuserParams(tableParams))}`).then(response => {
      const results = response.data.data.map(item => ({


        key: item.id,//d
        transactionId: item.transactionID,//d
        dateTime: item.paymentDate,
        guestName: item.guest_name,//d
        apartmentName: item.propertyName,
        paymentMethod: item.paymentMethod.toUpperCase(),
        paymentAmount: formatAmountWithCommas(item.paymentAmount),//d
        propertyId: item.propertyID,//d
        hostname: item.hostname,
        securityFee: formatAmountWithCommas(item.securityFee),
        roomPerNightPrice: item.amountForOneNight ,
        numNights:item.duration_of_stay ,
        amountForOneNight: ` ${formatAmountWithCommas(item.amountForOneNight)}`,//d
        guestServiceFee: formatAmountWithCommas(item.guestserviceFee ),//d
        amountReceivedByHost: formatAmountWithCommas(item.amountToHost) ,//d
        // check_in:item.check_in,
        // check_out: item.check_out
        nightlyRateAdjustment: -40.6,
        serviceFeePercentage:item.serviceFeePercentage,
        hostServiceFee:item.hostserviceFee,
        

        // {
        //   guestName: "John Doe",
        //   numGuests: 2,         
  
        // },

        // roomPerNightPrice: 100, // Replace with the actual price per night
        // guestServiceFee: 20, // Replace with the actual guest service fee
        // nightlyRateAdjustment: -50.7,
        // hostServiceFee: -28.9,



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
    <div>
      <div className="">
        <div className="overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>

          <div className="bg-white p-4 rounded shadow">
            <div className="overflow-x-auto">
              <Table columns={columns} pagination={tableParams.pagination}  onChange={handleTableChange} dataSource={dataSource} loading={loading} />
            </div>
          </div>
        </div>

        <Modal
          title="Booking Details"
          open={detailsVisible}
          onOk={handleDetailsClose}
          onCancel={handleDetailsClose}
        >
          <div
            ref={targetRef}
            className="receipt-container flex items-center justify-center "
          >
            {selectedBooking && (
              <div className="bg-white p-4 border border-black w-full">
                <img src={Logo} alt="Company Logo" className="w-16 h-auto" />
                <div className="receipt-header flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Your transaction receipt from Shbro{" "}
                  </h2>
                </div>
                <div className="receipt-details mt-4">
                  <div className="guestPaid">
                    <h2 className="text-lg font-semibold mb-2">Guest Paid</h2>
                    <div className="flex justify-between mb-2">
                      <span>
                      ₦
                        {(
                        formatAmountWithCommas(  selectedBooking.roomPerNightPrice)
                        )}{" "}
                        * {selectedBooking.numNights} nights
                      </span>
                      <span>
                      ₦
                        {(
                          formatAmountWithCommas(selectedBooking.roomPerNightPrice *
                          selectedBooking.numNights)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Guest service fee</span>
                      <span>₦{selectedBooking.guestServiceFee}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Security service fee</span>
                      <span>₦{selectedBooking.securityFee}(Refundable)</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Total (NGN)</span>
                      <span>
                      ₦
                        {(
                          selectedBooking.paymentAmount
                        )}
                      </span>
                    </div>
                  </div>
                  {renderBreakdowns(selectedBooking)}
                  <button
                    onClick={downloadPDF}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-700 mt-4"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default HostTransactionHistory;
