import React, { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Axios from "../../Axios"
import moment from "moment"; // Import moment library


export default function CanceledReservationTable() {
  const [loading, setLoading] = useState(true);
  const [cancelledTrips, setCancelledTrips] = useState([]);

  const columns = [
    {
      title: "Reservation ID",
      dataIndex: "reservationID",
      key: "reservationID",
    },
    {
      title: "Guest Name",
      dataIndex: "guestName",
      key: "guestName",
    },
    {
      title: "Apartment Name",
      dataIndex: "apartmentName",
      key: "apartmentName",
    },
    {
      title: "Cancellation Date",
      dataIndex: "cancellationDate",
      key: "cancellationDate",
      render: (text, record) => {
        const formattedDate = moment(text, "YYYY-MM-DD HH:mm:ss").format("dddd, D MMMM YYYY");
        return formattedDate;
      },
    },
    {
      title: "Reason for Cancellation",
      dataIndex: "reason",
      key: "reason",
    },
  ];
  

  const data = [
  
  ];


  useEffect(() => {
    const fetchCancelledTrips = async () => {
      try {
        const response = await Axios.get("/cancelledTrips");
        setCancelledTrips(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cancelled trips:", error);
        setLoading(false);
        // Handle error, show error message, etc.
      }
    };

    fetchCancelledTrips();
  }, []);
  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">Canceled Reservation Table </h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                The Canceled Reservation Table is a section that provides a detailed overview of all the reservations that have been canceled on your platform.
                </p>
              </div>
              <div className="overflow-x-auto">
              {loading ? (
                  <Spin size="large" />
                ) : (
                  <Table columns={columns} dataSource={cancelledTrips} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
