import React, { useState, useRef, useEffect } from "react";
import { Table, Button, Modal } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { usePDF } from "react-to-pdf";
import Logo from "../../assets/logo.png";
import Axios from "../../Axios";

const CompletedBooking = () => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const pdfRef = useRef(); // Create a ref for the PDF content
  const [completedBooking, setCompletedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompletedBookings() {
      try {
        const response = await Axios.get("/checkedOutBookings");
        setCompletedBooking(response.data.data);
        setLoading(false); // Set loading to false when data is fetched
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching host analytics:", error);
        setLoading(false); // Set loading to false even if there's an error
        setError("Error fetching data. Please try again."); // Set error message
      }
    }

    fetchCompletedBookings();
  }, []);

  const checkInDate = selectedBooking ? new Date(selectedBooking["check-In"]).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "";
  const checkOutDate = selectedBooking ? new Date(selectedBooking["check-out"]).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "";
  

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const columns = [
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Host Email Address",
      dataIndex: "hostEmail",
      key: "hostEmail",
    },
    {
      title: "Number of Guests",
      dataIndex: "number_of_guest",
      key: "number_of_guest",
    },
    {
      title: "Booking ID",
      dataIndex: "paymentId",
      key: "paymentId",
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
    // {
    //   title: "Taxes",
    //   dataIndex: "taxes",
    //   key: "taxes",
    // },
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
    const matchingBooking = completedBooking.find(
      (item) =>
        item.guestEmail === booking.guestEmail &&
        item.homeName === booking.homeName
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

  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">Completed Booking</h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                The Completed Bookings section provides a comprehensive list of all the bookings for an apartment that have been successfully completed.
                </p>
              </div>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table columns={columns} dataSource={completedBooking}                   rowKey={(record) => record.id} // Set the rowKey to the guest's id
 />
                </div>
              )}
            </div>
          </div>
        </div>
        <div ref={targetRef}>
          {selectedBooking && (
            <div className="w-full">
              <h2 className="text-base font-semibold mt-4 mb-2">
                Guest Information:
              </h2>
              <p>Guest Name: {selectedBooking.guestName}</p>
              <p>Email: {selectedBooking.guestEmail}</p>
              <p>Number of Guests: {selectedBooking.number_of_guest}</p>
              <p>Check-In Date: {selectedBooking["check-In"]}</p>
              <p>Check-Out Date: {selectedBooking["check-out"]}</p>
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
            <div className="p-4 bg-white border-2 border-black w-full h-full">
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
              <p>Guest Name: {selectedBooking.guestName}</p>
              <p>Email: {selectedBooking.guestEmail}</p>
              <p>Number of Guests: {selectedBooking.number_of_guest}</p>
              <p>Check-In Date: {checkInDate}</p>
    <p>Check-Out Date: {checkOutDate}</p>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Host Information:
              </h2>
              <p>Host Name: {selectedBooking.hostName}</p>
              <p>Host Email: {selectedBooking.hostEmail}</p>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Property Selection:
              </h2>
              <p>Property Name: {selectedBooking.property_name}</p>
              <p>Property Type: {selectedBooking.homeType}</p>

              <h2 className="text-base font-semibold mt-4 mb-2">
                Pricing and Payments:
              </h2>
              <p>Total Booking Cost: ₦{selectedBooking.totalamount.toLocaleString('en-US')}</p>
              <p>Payment Type: {selectedBooking.paymentType}</p>
              <p>Payment ID: {selectedBooking.paymentId}</p>
              {/* <p>Tax: ${selectedBooking.tax}</p> */}
              {/* <p>
                Guest Service Charge: ${selectedBooking.guest_service_charge}
              </p> */}

              <button
                onClick={() =>
                  toPDF(pdfRef, {
                    unit: "mm",
                    format: "a4",
                  })
                }
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
