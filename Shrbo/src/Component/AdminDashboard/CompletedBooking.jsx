import React, { useState, useRef } from "react";
import { Table, Button, Modal } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";

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
  guestComment: "lorem inpsum",
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
  guestComment: "lorem inpsum",
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

const CompletedBooking = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const pdfRef = useRef(); // Create a ref for the PDF content

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

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
        <div>
          <Button onClick={() => viewBookingDetails(record)}>
            View Details
          </Button>
        </div>
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
        format: "a4", // Set the format to A4 paper size
      });
    }
  };


  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">Completed Booking</h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
        <div ref={targetRef}>
          {selectedBooking && (
            <div className="w-full">
              <h2 className="text-base font-semibold mt-4 mb-2">
                Guest Information:
              </h2>
              <p>Guest Name: {selectedBooking.bookingDetails.guestName}</p>
              <p>Email: {selectedBooking.bookingDetails.email}</p>
              <p>
                Number of Guests: {selectedBooking.bookingDetails.numGuests}
              </p>
              <p>
                Special Requests:{" "}
                {selectedBooking.bookingDetails.specialRequests}
              </p>

              {/* Include more booking details as needed... */}

              <button onClick={downloadPDF}>Download PDF</button>
            </div>
          )}
        </div>

        <Modal
          title="Booking Details"
          open={detailsVisible}
          onOk={handleDetailsClose}
          onCancel={handleDetailsClose}
        >
          {selectedBooking && (
            <div
              ref={targetRef}
              className="p-4 bg-white border-2 border-black w-full h-full"
            >
          <div className="w-full" ref={pdfRef}>
             <div className="mb-4">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="w-24 h-auto mx-auto"
                />
              </div>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Guest Information:
              </h2>
              <table className="table-auto w-full mb-4">
                <tbody>
                  <tr>
                    <td className="pr-4">Guest Name:</td>
                    <td>{selectedBooking.guestName}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Email:</td>
                    <td>{selectedBooking.email}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Number of Guests:</td>
                    <td>{selectedBooking.numGuests}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Special Requests:</td>
                    <td>{selectedBooking.bookingDetails.specialRequests}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Host Information:
              </h2>
              <table className="table-auto w-full mb-4">
                <tbody>
                  <tr>
                    <td className="pr-4">Host Name:</td>
                    <td>{selectedBooking.bookingDetails.hostName}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Host Contact:</td>
                    <td>{selectedBooking.bookingDetails.hostContact}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Property Selection:
              </h2>
              <table className="table-auto w-full mb-4">
                <tbody>
                  <tr>
                    <td className="pr-4">Property Name:</td>
                    <td>{selectedBooking.bookingDetails.propertyName}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Property Type:</td>
                    <td>{selectedBooking.bookingDetails.propertyType}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Check-In Date:</td>
                    <td>{selectedBooking.bookingDetails.checkInDate}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Checked Out Date:</td>
                    <td>{selectedBooking.bookingDetails.checkOutDate}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Rooms and Beds:</td>
                    <td>{selectedBooking.bookingDetails.roomsBedsRequired}</td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Pricing and Payments:
              </h2>
              <table className="table-auto w-full mb-4">
                <tbody>
                  <tr>
                    <td className="pr-4">Total Booking Cost:</td>
                    <td>${selectedBooking.bookingDetails.totalBookingCost}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Payment Method:</td>
                    <td>{selectedBooking.bookingDetails.paymentMethod}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Payment Amount:</td>
                    <td>${selectedBooking.bookingDetails.paymentAmount}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Taxes and Fees:</td>
                    <td>${selectedBooking.bookingDetails.taxesFees}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">Payment Confirmation:</td>
                    <td>
                      {selectedBooking.bookingDetails.paymentConfirmation}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h2 className="text-xl font-semibold mt-4 mb-2">
                Guest Reviews and Ratings:
              </h2>
              <table className="table-auto w-full mb-4">
                <tbody>
                  <tr>
                    <td className="pr-4">
                      <strong>Review and Rating:</strong>
                    </td>
                    <td>{selectedBooking.bookingDetails.reviewAndRating}</td>
                  </tr>
                  <tr>
                    <td className="pr-4">
                      <strong>Guest Comment:</strong>
                    </td>
                    <td>{selectedBooking.bookingDetails.guestComment}</td>
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

export default CompletedBooking;
