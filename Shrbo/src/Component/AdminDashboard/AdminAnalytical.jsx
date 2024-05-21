import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { Link } from "react-router-dom";
import { Select, Card, Row, Col, Table, Spin } from "antd";
import Cards from "./AdminAnalysisCard";
import Axios from "../../Axios";

export default function AdminAnalytical() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("today");

  useEffect(() => {
    async function fetchHostAnalytics() {
      try {
        const response = await Axios.get("/adminAnalytical");
        setAnalyticsData(response.data.data);
        setLoading(false); // Set loading to false when data is fetched
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching host analytics:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    }

    fetchHostAnalytics();
  }, []);

  useEffect(() => {
    async function fetchHostAnalytics() {
      try {
        setLoading(true); // Set loading to true when fetching data
        const response = await Axios.get(
          `/filterAnalyticalData/${selectedFilter}`
        );
        setAnalyticsData(response.data.data);
        setTimeout(() => {
          setLoading(false); // Set loading to false after 2 seconds
        }, 2000);
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching host analytics:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    }

    fetchHostAnalytics();
  }, [selectedFilter]);

  const handleFilterChange = (value) => {
    setSelectedFilter(value);
  };

  useEffect(() => {
    setSelectedFilter("today"); // Set the default filter to "today" when the component mounts
  }, []);

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example hidden md:block text-white md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <div className="bg-white p-4 rounded shadow">
            <div className="mb-4">
              <label htmlFor="" className="mr-4">
                Filter by:
              </label>
              <select
                name=""
                className="border border-gray-300 rounded p-2"
                id=""
                defaultValue={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="this_week">Week</option>
                <option value="this_month">Month</option>
                <option value="this_year">Year</option>
                <option value="all_time">All Time</option>
              </select>
            </div>
            <div className=" mb-4">
              <p className="text-gray-400 text-sm">The Admin Analytical Page is a dashboard that offers a daily summary of user activity, property listings, revenue, and bookings, aiding in informed decision-making.</p>
            </div>

            {loading && (
              <div className="bg-white p-4 rounded shadow flex justify-center items-center h-96">
                <Spin size="large" />
              </div>
            )}

            {error && <div className="w-full p-4 text-red-500">{error}</div>}

            {!loading && !error && analyticsData && (
              <>
                <>
                  <div className="bg-gray-200 p-4 rounded shadow">
                    <h2 className="text-base font-semibold">
                      {selectedFilter === "today"
                        ? "Today's Summary"
                        : selectedFilter === "this_week"
                        ? "This Week's Summary"
                        : selectedFilter === "this_month"
                        ? "This Month's Summary"
                        : selectedFilter === "this_year"
                        ? "This Year's Summary"
                        : "All Time Summary"}
                    </h2>
                    <div className="flex flex-col md:flex-row flex-wrap mt-4 gap-4">
                      {/* Card for Guests Today */}
                      <Cards
                        title="Reg No of Guests"
                        value={analyticsData.no_of_guests}
                      />

                      {/* Cards for Hosts Today */}
                      <Cards
                        title="Reg No of Hosts"
                        value={analyticsData.no_of_hosts}
                      />

                      <Cards
                        title="Active Guests"
                        value={analyticsData.active_guests}
                      />
                      <Cards
                        title="Active Hosts"
                        value={analyticsData.active_hosts}
                      />
                      <Cards
                        title="Property Listings"
                        value={analyticsData.propertyListings}
                      />
                      <Cards
                        title="Revenue"
                        value={analyticsData.revenue}
                        currency="₦"
                      />
                      <Cards title="Visitors" value={analyticsData.visitors} />
                    </div>
                  </div>

                  <div className="bg-gray-200 p-4 rounded shadow">
                    <h2 className="text-base font-semibold">
                      {selectedFilter === "today"
                        ? "Today's Summary"
                        : selectedFilter === "this_week"
                        ? "This Week's Summary"
                        : selectedFilter === "this_month"
                        ? "This Month's Summary"
                        : selectedFilter === "this_year"
                        ? "This Year's Summary"
                        : "All Time Summary"}
                    </h2>
                    <div className="flex flex-wrap  mt-4 gap-3">
                      <Cards
                        title="Users"
                        value={analyticsData.userCountForPresentDay}
                      />
                      <Cards
                        title="Pending Verified Users"
                        value={analyticsData.unVerifiedUserForPresentDay}
                      />
                      <Cards
                        title="Pending Approvals"
                        value={analyticsData.unApprovedHomesCount}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-200 p-4 rounded shadow">
                    <h2 className="text-base font-semibold">
                      {selectedFilter === "today"
                        ? "Today's Summary"
                        : selectedFilter === "this_week"
                        ? "This Week's Summary"
                        : selectedFilter === "this_month"
                        ? "This Month's Summary"
                        : selectedFilter === "this_year"
                        ? "This Year's Summary"
                        : "All Time Summary"}
                    </h2>

                    <div className="flex flex-wrap  mt-4 gap-3">
                      <Cards title="Booking Requests" value={0} />
                      <Cards
                        title="Reservations"
                        value={analyticsData.activeReservationsCount}
                      />
                      <Cards
                        title="Confirmed Bookings"
                        value={analyticsData.confirmBookings}
                      />
                    </div>
                  </div>
                </>
              </>
            )}

            {analyticsData && (
              <div className="bg-gray-200 rounded shadow mt-4">
                <div className="flex justify-between p-4 bg-orange-400 text-white uppercase mb-4">
                  <div className="font-bold">
                    Current vacation rental bookings
                  </div>
                  <div>
                    <Link to="/CurrentBookingsList">View All</Link>
                  </div>
                </div>

                <div className="overflow-x-auto  pb-32">
                  <Table
                    dataSource={analyticsData.reservationData
                      .slice(0, 4)
                      .map((reservation, index) => ({
                        ...reservation,
                        key: index,
                      }))}
                    columns={[
                      {
                        title: "Booking ID",
                        dataIndex: "bookingId",
                        key: "bookingId",
                      },
                      {
                        title: "Guest Name",
                        dataIndex: "guestName",
                        key: "guestName",
                      },
                      {
                        title: "Home Title",
                        dataIndex: "homeTitle",
                        key: "homeTitle",
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                      },
                      {
                        title: "Check-in Date",
                        dataIndex: "check_in",
                        key: "check_in",
                      },
                      // Add more columns as needed
                    ]}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
