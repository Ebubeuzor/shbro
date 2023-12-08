import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SettingsNavigation from "./SettingsNavigation";
import ChangePassword from "./ChangePassword";
import GoBackButton from "../GoBackButton";
import { Table, Button, Modal } from "antd";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";

// Sample booking details
const sampleBookingDetails = {
  bookingDetails1: {
    hostName: "Jane Smith",
    roomPerNightPrice: 100, // Replace with the actual price per night
    guestServiceFee: 20, // Replace with the actual guest service fee
    numNights: 10,
    nightlyRateAdjustment: -50.7,
    hostServiceFee: -28.9,
    bookingDates: "2023-02-15 to 2023-02-23",
    propertyDetails: "Beachfront Villa, Miami Beach",
    receiptId: "ADkfkfkslf124",
    paymentMethod: "Card",
    propertyDescription: "2bed 3 guests",
    host: "Hosted by Endi",
  },
  bookingDetails2: {
    hostName: "John Doe",
    roomPerNightPrice: 120, // Replace with the actual price per night
    guestServiceFee: 25, // Replace with the actual guest service fee
    numNights: 8,
    nightlyRateAdjustment: -40.6,
    hostServiceFee: -23.5,
    bookingDates: "2023-01-10 to 2023-01-20",
    propertyDetails: "Mountain Cabin, Aspen",
    receiptId: "ADkfkfkslf124",
    paymentMethod: "Transfer", // Add payment method for the second booking
    propertyDescription: "2bed 3 guests",
    host: "Hosted by Daniel",
  },
};

// Sample transaction data
const data = [
  {
    key: "1",
    hostName: "John Doe",
    transactionId: "T12345",
    numGuests: 2,
    propertyId: "ABC123",
    bookingStatus: "confirmed",
    paymentAmount: 100,
    serivceCharge: 10,
    bookingDates: "2023-01-10 to 2023-01-20",
  },
  {
    key: "2",
    hostName: "Jane Smith",
    transactionId: "T12345",
    numGuests: 3,
    propertyId: "XYZ789",
    bookingStatus: "pending",
    paymentAmount: 150,
    serivceCharge: 15,
    bookingDates: "2023-02-15 to 2023-02-23",
  },
  // Add more booking data as needed
];

export default function TransactionHistory() {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBreakdowns, setShowBreakdowns] = useState(false);
  const pdfRef = useRef(); // Create a ref for the PDF content

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const columns = [
    // Define table columns
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Host Name",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Number of Guests",
      dataIndex: "numGuests",
      key: "numGuests",
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
      title: " Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
    },
    {
      title: "Booking Dates",
      dataIndex: "bookingDates",
      key: "bookingDates",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewBookingDetails(record)}>View Details</Button>
      ),
    },
  ];

  // Function to render booking details breakdown
  const renderBreakdowns = (booking) => {
    const totalNightsFee = booking.roomPerNightPrice * booking.numNights;

    return (
      <div className="breakdoguestPaid4">
        <h2 className="text-base font-semibold mt-4 mb-2">Breakdowns</h2>
        <div className="flex justify-between">
          <span>{booking.numNights} nights room fee</span>
          <span>${totalNightsFee}</span>
        </div>

        <div className="flex justify-between">
          <span>Total (USD)</span>
          <span>${calculateTotal(booking)}</span>
        </div>
      </div>
    );
  };

  // Function to view booking details
  const viewBookingDetails = (booking) => {
    const matchingBooking = Object.values(sampleBookingDetails).find(
      (details) => details.hostName === booking.hostName
    );

    if (matchingBooking) {
      setSelectedBooking(matchingBooking);
      setDetailsVisible(true);
    }
  };

  // Function to calculate the total cost of a booking
  const calculateTotal = (booking) => {
    const total =
      booking.roomPerNightPrice * booking.numNights +
      booking.guestServiceFee +
      booking.nightlyRateAdjustment +
      booking.hostServiceFee;
    return total;
  };

  // Function to handle closing the details modal
  const handleDetailsClose = () => {
    setDetailsVisible(false);
    setShowBreakdowns(false);
  };

  // Function to toggle displaying the breakdowns
  const toggleBreakdowns = () => {
    setShowBreakdowns(!showBreakdowns);
  };

  // Function to download the PDF
  const downloadPDF = () => {
    if (selectedBooking) {
      toPDF(pdfRef, {
        unit: "mm",
        format: "a4", // Set the format to A4 paper size
      });
    }
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4">
        <GoBackButton />
        <SettingsNavigation
          title="Transaction History"
          text="Transaction History"
        />

        <div>
          <div className="bg-white p-4 rounded shadow">
            <div className="overflow-x-auto">
              <Table columns={columns} dataSource={data} />
            </div>
          </div>
        </div>

        <Modal
          title="Receipt from  Shortlet Booking"
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
                    Your transaction receipt from Shbro
                  </h2>
                </div>
                <div className="receipt-details mt-4">
                  <div className="flex justify-between mb-2 font-bold my-5">
                    <span>Receipt ID</span>
                    <span className="uppercase">
                      {selectedBooking.receiptId}
                    </span>
                  </div>
                  <div className="guestPaid">
                    <h2 className="text-lg font-semibold mb-2">Guest Paid</h2>

                    <div className="flex justify-between mb-2">
                      <span>{selectedBooking.propertyDetails}</span>
                      <span>
                        $
                        {(
                          selectedBooking.roomPerNightPrice *
                          selectedBooking.numNights
                        ).toFixed(2)}{" "}
                        * {selectedBooking.numNights} nights
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Booking Dates</span>
                      <span>{selectedBooking.bookingDates}</span>
                    </div>
                    <div className="my-4">
                      <h1 className="text-lg font-semibold mb-2">Deductions</h1>
                      <div className="flex justify-between mb-2">
                        <span> Service fee</span>
                        <span>
                          ${selectedBooking.guestServiceFee.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span>Total (USD)</span>
                        <span>
                          $
                          {(
                            selectedBooking.roomPerNightPrice *
                              selectedBooking.numNights +
                            selectedBooking.guestServiceFee +
                            selectedBooking.nightlyRateAdjustment
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="my-5">
                      <h1 className="text-lg font-semibold mb-2">
                        Description
                      </h1>

                      <div className="flex justify-between mb-2">
                        <span>Payment Method</span>
                        <span>{selectedBooking.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Property Description</span>
                        <span>{selectedBooking.propertyDescription}</span>
                      </div>

                      <div className="flex justify-between mb-2">
                        <span>Host</span>
                        <span>{selectedBooking.host}</span>
                      </div>
                    </div>
                  </div>
                  {renderBreakdowns(selectedBooking)}
                  <button
                    onClick={downloadPDF}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full hover-bg-orange-700 mt-4"
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
}
