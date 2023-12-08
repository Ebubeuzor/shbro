import React from "react";
import { Table } from "antd";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";

export default function CanceledReservationTable() {
  const columns = [
    {
      title: "Reservation ID",
      dataIndex: "reservationId",
      key: "reservationId",
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
    },
    {
      title: "Reason for Cancellation",
      dataIndex: "cancellationReason",
      key: "cancellationReason",
    },
  ];

  const data = [
    {
      key: "1",
      reservationId: "R12345",
      guestName: "Guest 1",
      apartmentName: "Apartment A",
      cancellationDate: "2023-11-02 14:30:00",
      cancellationReason: "Change of plans",
    },
    {
      key: "2",
      reservationId: "R12346",
      guestName: "Guest 2",
      apartmentName: "Apartment B",
      cancellationDate: "2023-11-03 10:00:00",
      cancellationReason: "Found another accommodation",
    },
    // Add more data as needed
  ];

  return (
    <div>
      <div className="bg-gray-100 h-[100vh]">
        <AdminHeader />

        <div className="flex">
          <div className="bg-orange-400 text-white hidden md:block md:w-1/5 h-[100vh] p-4">
            <AdminSidebar />
          </div>
          <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
            <h1 className="text-2xl font-semibold mb-4">Canceled Reservation Table </h1>

            <div className="bg-white p-4 rounded shadow">
              <div className="overflow-x-auto">
                <Table columns={columns} dataSource={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
