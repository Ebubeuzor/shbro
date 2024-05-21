import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Space,
  Input,
  DatePicker,
  Select,
  Dropdown,
  Modal,
  Button,
  Spin
} from "antd";
import Axios from "../../Axios";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Logo from "../../assets/logo.png";
import { usePDF } from "react-to-pdf";
import { LoadingOutlined } from "@ant-design/icons";


const BookingTable = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Email Address",
      dataIndex: "guestEmail",
      key: "guestEmail",
    },
    {
      title: "Host Name",
      dataIndex: "hostName",
      key: "hostName",
    },
    {
      title: "Property ID",
      dataIndex: "propertyId",
      key: "propertyId",
    },
    {
      title: "Payment Amount",
      dataIndex: "totalamount",
      key: "totalamount",
      render: (totalamount) => (
        <span>
          ₦{new Intl.NumberFormat().format(totalamount)}
        </span>
      ),
    },
    {
      title: "Payment ID",
      dataIndex: "paymentId",
      key: "paymentId",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewBookingDetails(record)}>View Details</Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await Axios.get("/bookings");
        const sortedBookings = response.data.data.sort((a, b) => {
          return new Date(b["check-In"]) - new Date(a["check-In"]);
        });
        setBookings(sortedBookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
        // Handle error, show error message, etc.
      }
    };
    

    fetchBookings();
  }, []);
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  const viewBookingDetails = (booking) => {
    // Find the booking details with the same email and property ID
    const matchingBooking = bookings.find(
      (item) =>
        item.guestName === booking.guestName &&
        item.guestEmail === booking.guestEmail &&
        item.hostName === booking.hostName &&
        item.propertyId === booking.propertyId &&
        item.totalamount === booking.totalamount &&
        item.paymentId === booking.paymentId
    );

    if (matchingBooking) {
      setSelectedBooking(matchingBooking); // Set selectedBooking to the matching booking object
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
          <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">New Booking</h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="mb-4">
                <p className="text-gray-400 text-sm">
                The New Booking page is a section of your platform that displays the most recent apartment bookings. It provides a real-time update of the latest transactions, showcasing the apartments that have just been booked.
                </p>
              </div>
              <div className="overflow-x-auto">
                {loading ? (
                 <div className="flex justify-center h-52 items-center">
                 <Spin
                   indicator={
                     <LoadingOutlined
                       style={{
                         fontSize: 24,
                       }}
                       spin
                     />
                   }
                 />
               </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey={(record) => record.id} // Set the rowKey to the guest's id
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Booking Details"
          open={detailsVisible}
          onCancel={handleDetailsClose}
          footer={null}
        >
          {selectedBooking && (
            <div>
              {/* Display detailed information about the selected booking */}
              <div className="bg-white p-4 border pb-10 border-black w-full">
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
                      <td className="text-end">{selectedBooking.guestEmail}</td>
                    </tr>
                    {/* Add other guest information here */}
                  </tbody>
                </table>

                <h2 className="text-base font-semibold mt-4 mb-2">
                  Host Information:
                </h2>
                <table className="table w-full">
                  <tbody>
                    <tr className="bg-gray-300">
                      <td>Host Name:</td>
                      <td className="text-end">{selectedBooking.hostName}</td>
                    </tr>
                    <tr>
                      <td>Host Contact:</td>
                      <td className="text-end">{selectedBooking.hostEmail}</td>
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
                      <td className="text-end">{selectedBooking.homeName}</td>
                    </tr>
                    <tr>
                      <td>Property Type:</td>
                      <td className="text-end">{selectedBooking.homeType}</td>
                    </tr>
                    <tr className="bg-gray-300">
                      <td>Check-In Date:</td>
                      <td className="text-end">
                        {" "}
                        {formatDate(selectedBooking["check-In"])}
                      </td>
                    </tr>
                    <tr>
                      <td>Check-Out Date:</td>
                      <td className="text-end">
                        {formatDate(selectedBooking["check-out"])}
                      </td>{" "}
                    </tr>
                    {/* Add more property selection details if needed */}
                  </tbody>
                </table>

                {/* Add other sections for Pricing and Payments */}
                <h2 className="text-base font-semibold mt-4 mb-2">
                  Pricing and Payments:
                </h2>
                <table className="table w-full">
                  <tbody>
                    <tr className="bg-gray-300">
                      <td>Total Booking Cost:</td>
                      <td className="text-end">
                      ₦{selectedBooking.totalamount.toLocaleString("en-NG")}
                      </td>
                    </tr>
                    <tr>
                      <td>Payment Method:</td>
                      <td className="text-end">
                        {selectedBooking.paymentType}
                      </td>
                    </tr>
                    <tr className="bg-gray-300">
                      <td>Taxes and Fees:</td>
                      <td className="text-end"> ₦{selectedBooking.tax}</td>
                    </tr>
                    <tr>
                      <td>Confirmation Number:</td>
                      <td className="text-end">{selectedBooking.paymentId}</td>
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
