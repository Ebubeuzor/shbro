import React, { useState, useRef } from "react";
import {
  Table,
  Space,
  Input,
  DatePicker,
  Select,
  Dropdown,
  Modal,
  Button,
} from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Logo from "../../assets/logo.png";
import { usePDF } from "react-to-pdf";

const sampleBookingDetails = {
  guestName: "John Doe",
  email: "johndoe@example.com",
  numGuests: 2,
  specialRequests: "Late check-in requested.",
  propertyName: "Beachfront Villa",
  propertyType: "Villa",
  checkInDate: "2023-10-20",
  checkOutDate: "2023-10-25",
  roomsBedsRequired: "2 bedrooms, 2 beds",
  amenities: "Private pool, beach access",
  totalBookingCost: 500,
  paymentMethod: "Credit Card",
  paymentAmount: 500,
  taxesFees: 50,
  paymentConfirmation: "Payment confirmed",
  addons: "Airport pickup, breakfast",
  cancellationPolicy: "Free cancellation up to 7 days before check-in.",
  refundPolicy: "Full refund within 24 hours of booking.",
  confirmationNumber: "B123456789",
  bookingDate: "2023-10-15",
  bookingStatus: "Confirmed",
  reviewAndRating: "4.5 out of 5 stars",
  termsConditions: "Terms and conditions text...",
  hostName: "My Name",
  hostContact: "host@example.com",
  hostReviews: "4.7 out of 5 stars",
  propertyId: "ABC123",

  hostCommunicationOptions: "Email, Phone, Chat",
  bookingSummary: "Summary of booking details...",
};

const sampleBookingDetails2 = {
  guestName: "Jane Smith",
  email: "janesmith@example.com",
  numGuests: 3,
  specialRequests: "Early check-in requested.",
  propertyName: "Mountain Chalet",
  propertyType: "Chalet",
  checkInDate: "2023-11-05",
  checkOutDate: "2023-11-10",
  roomsBedsRequired: "3 bedrooms, 3 beds",
  amenities: "Mountain view, fireplace",
  totalBookingCost: 700,
  paymentMethod: "PayPal",
  paymentAmount: 700,
  taxesFees: 70,
  paymentConfirmation: "Payment confirmed",
  addons: "Hiking tour, dinner",
  cancellationPolicy: "Free cancellation up to 14 days before check-in.",
  refundPolicy: "Full refund within 48 hours of booking.",
  confirmationNumber: "C987654321",
  bookingDate: "2023-10-18",
  bookingStatus: "Confirmed",
  reviewAndRating: "4.8 out of 5 stars",
  termsConditions: "Terms and conditions text...",
  hostName: "Host Name",
  hostContact: "host@example.com",
  hostReviews: "4.7 out of 5 stars",
  hostCommunicationOptions: "Email, Phone, Chat",
  bookingSummary: "Summary of booking details...",
  propertyId: "XYZ789",
};

const data = [
  {
    key: "1",
    guestName: "John Doe",
    email: "johndoe@example.com",
    numGuests: 2,
    propertyId: "ABC123",
    paymentAmount: 100,
    taxes: 10,
    bookingDetails: sampleBookingDetails, // Add the booking details object
  },
  {
    key: "2",
    guestName: "Jane Smith",
    email: "janesmith@example.com",
    numGuests: 3,
    propertyId: "XYZ789",
    paymentAmount: 150,
    taxes: 15,
    bookingDetails: sampleBookingDetails2, // Add the booking details object
  },
  // Add more booking data as needed
];

const BookingTable = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const columns = [
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: "email",
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
      title: "Taxes",
      dataIndex: "taxes",
      key: "taxes",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewBookingDetails(record)}>View Details</Button>
      ),
    },
  ];

  const viewBookingDetails = (booking) => {
    // Find the booking details with the same email and property ID
    const matchingBooking = data.find(
      (item) =>
        item.email === booking.email && item.propertyId === booking.propertyId
    );

    if (matchingBooking) {
      setSelectedBooking(matchingBooking);
      setDetailsVisible(true);
    }
  };

  const handleDetailsClose = () => {
    setDetailsVisible(false);
  };
  const downloadPDF = () => {
    if (selectedBooking) {
      toPDF(pdfRef, {
        unit: "mm",
        format: "a4",
      });
    }
  };

  const pdfRef = useRef(); // Create a ref for the PDF content

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">New Booking</h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
        <Modal
  title="Booking Details"
  open={detailsVisible}
  onOk={handleDetailsClose}
  onCancel={handleDetailsClose}
>
  {selectedBooking && (
    <div>
      <div
        className="bg-white p-4 border pb-10 border-black w-full"
        ref={targetRef}
      >
        <img src={Logo} alt="Company Logo" className="w-16 h-auto" />
        <div className="receipt-header flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Your booking details
          </h2>
        </div>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Guest Information:
        </h2>
        <table className="table w-full">
          <tbody>
            <tr className="bg-gray-300">
              <td>Guest Name:</td>
              <td className="text-end">{selectedBooking.guestName}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td className="text-end">{selectedBooking.email}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Number of Guests:</td>
              <td className="text-end">{selectedBooking.numGuests}</td>
            </tr>
            <tr>
              <td>Special Requests:</td>
              <td className="text-end"> {selectedBooking.bookingDetails.specialRequests}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Host Information:
        </h2>
        <table className="table w-full">
          <tbody>
          <tr className="bg-gray-300">
              <td>Host Name:</td>
              <td className="text-end">{selectedBooking.bookingDetails.hostName}</td>
            </tr>
            <tr>
              <td>Host Contact:</td>
              <td className="text-end">{selectedBooking.bookingDetails.hostContact}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Property Selection:
        </h2>
        <table className="table w-full">
          <tbody>
          <tr className="bg-gray-300">
              <td>Property Name:</td>
              <td className="text-end">{selectedBooking.bookingDetails.propertyName}</td>
            </tr>
            <tr>
              <td>Property Type:</td>
              <td className="text-end">{selectedBooking.bookingDetails.propertyType}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Check-In Date:</td>
              <td className="text-end">{selectedBooking.bookingDetails.checkInDate}</td>
            </tr>
            <tr>
              <td>Check-Out Date:</td>
              <td className="text-end">{selectedBooking.bookingDetails.checkOutDate}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Rooms and Beds:</td>
              <td className="text-end">{selectedBooking.bookingDetails.roomsBedsRequired}</td>
            </tr>
            <tr>
              <td>Amenities:</td>
              <td className="text-end">{selectedBooking.bookingDetails.amenities}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Confirmation Number:</td>
              <td className="text-end">{selectedBooking.bookingDetails.confirmationNumber}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="text-base font-semibold mt-4 mb-2">
          Pricing and Payments:
        </h2>
        <table className="table w-full">
          <tbody>
          <tr className="bg-gray-300">
              <td>Total Booking Cost:</td>
              <td className="text-end">${selectedBooking.bookingDetails.totalBookingCost}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td className="text-end">{selectedBooking.bookingDetails.paymentMethod}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Payment Amount:</td>
              <td className="text-end">${selectedBooking.bookingDetails.paymentAmount}</td>
            </tr>
            <tr>
              <td>Taxes and Fees:</td>
              <td className="text-end">${selectedBooking.bookingDetails.taxesFees}</td>
            </tr>
            <tr className="bg-gray-300">
              <td>Payment Confirmation:</td>
              <td className="text-end">{selectedBooking.bookingDetails.paymentConfirmation}</td>
            </tr>
          </tbody>
        </table>
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
  );
};

export default BookingTable;
