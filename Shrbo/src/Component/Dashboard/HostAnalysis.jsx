import React, { useState } from "react";
import { Tabs, Modal, Checkbox, Select } from "antd";
import HostHeader from "../Navigation/HostHeader";
import Room from "../../assets/room.jpeg";
import TopEarningApartments from "./TopEarningApartments";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import HostBottomNavigation from "./HostBottomNavigation";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const { items } = Tabs;
const { Option } = Select;

export default function HostAnalysis() {
  const [activeTab, setActiveTab] = useState("1");
  const [showListingsModal, setShowListingsModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Add selectedMonth state

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const showListings = () => {
    setShowListingsModal(true);
  };

  const handleApartmentClick = (apartmentId) => {
    setSelectedApartment(apartmentId);
  };

  const hideListingsModal = () => {
    setShowListingsModal(false);
  };

  const apartmentData = [
    {
      id: 1,
      name: "Apartment 1",
      image: Room,
      datePosted: "2023-10-01",
      earnings: [
        { date: "2023-10-01", amount: 100 },
        { date: "2023-10-02", amount: 200 },
      ],
    },
    {
      id: 2,
      name: "Apartment 2",
      image: Room,
      datePosted: "2023-09-01",
      earnings: [
        { date: "2023-09-01", amount: 150 },
        { date: "2023-09-02", amount: 250 },
      ],
    },
  ];

  const selectedApartmentData = apartmentData.find(
    (apartment) => apartment.id === selectedApartment
  );

  const reviews = [
    {
      apartmentId: 1,
      personName: "John Doe",
      comment: "Great place to stay!",
      starRating: 5,
      nights: 3,
      date: "2023-10-04",
    },
    {
      apartmentId: 1,
      personName: "Jane Smith",
      comment: "Lovely apartment with a nice view.",
      starRating: 4,
      nights: 2,
      date: "2023-10-03",
    },

    {
      apartmentId: 1,
      personName: "Jane Smith",
      comment: "Lovely apartment with a nice view.",
      starRating: 4,
      nights: 2,
      date: "2023-10-03",
    },
    {
      apartmentId: 2,
      personName: "Alice Johnson",
      comment: "Very comfortable and clean.",
      starRating: 5,
      nights: 4,
      date: "2023-10-02",
    },
    // Add more reviews here
  ];

  const apartmentReviews = reviews.filter(
    (review) => review.apartmentId === selectedApartment
  );

  const generateMonths = () => {
    const startDate = new Date("November 2023");
    const endDate = new Date("December 2024");

    const months = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString("default", { month: "long" });
      months.push({ value: `${month} ${year}`, date: currentDate });
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
    }

    return months;
  };

  const generateMonthss = () => {
    const startDate = new Date("November 2023");
    const endDate = new Date("December 2024");

    const months = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString("default", { month: "long" });
      const monthYear = `${month} ${year}`;
      months.push(monthYear);
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
    }

    return months;
  };

  return (
    <div className="">
      <HostHeader />
      <div className="m-3 md:w-3/4 md:mx-auto md:my-28">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="tab-buttons"
        >
          <items tab="Reviews" key="1">
            <div>
              <h2 className="text-3xl">Reviews</h2>

              <button
                onClick={showListings}
                className="border p-2 my-3 rounded-full"
              >
                All listings
              </button>
              {selectedApartmentData && (
                <div>
                  <h2 className="my-4 font-medium text-2xl">
                    Reviews for {selectedApartmentData.name}
                  </h2>
                  {apartmentReviews.length === 0 ? (
                    <p>
                      Your first review will show up here. We’ll let you know
                      when guests leave feedback.
                    </p>
                  ) : (
                    <ul className="list-disc list-inside flex space-x-6 whitespace-nowrap overflow-scroll w-full example">
                      {apartmentReviews.map((review, index) => (
                        <li
                          key={index}
                          className="mt-2 rounded-3xl mb-3 list-none shadow-lg bg-slate-100   p-4 "
                        >
                          <div className="flex items-center space-x-4 ">
                            <div className="w-[120px]">
                              <img
                                src={selectedApartmentData.image}
                                className="w-32 h-32"
                                alt=""
                              />
                            </div>
                            <div className="w-[300px] whitespace-normal">
                              <strong>Guest Name:</strong> {review.personName}
                              <br />
                              <strong>Comment:</strong> {review.comment}
                              <br />
                              <strong>Rating:</strong> {review.starRating}
                              <br />
                              <strong>Nights:</strong> {review.nights}
                              <br />
                              <strong>Date:</strong> {review.date}
                              <br />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </items>
          <items tab="Earnings" key="2">
            <div>
              <h2 className="text-3xl">Earnings</h2>
              <div className="md:w-3/5">
                <label htmlFor="" className="text-base">
                  Select Month
                </label>
                <div className="w-full py-4">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select a month"
                    onChange={(value) => setSelectedMonth(value)} // Update selectedMonth
                    value={selectedMonth}
                  >
                    {generateMonths().map((monthItem) => (
                      <Option
                        key={monthItem.date.toISOString()}
                        value={monthItem.date.toISOString()}
                      >
                        {monthItem.value}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="">
                  <div className="my-4">
                    <div className="text-4xl font-bold">$0.00</div>
                    <div>
                      <p className="">Booked Earnings for 2023</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="bg-red-400 h-4 w-4"></span>
                    <div className="text-xl font-bold text-[color-for-amount]">
                      $0.00
                    </div>
                    <div>
                      <p className="text-[color-for-label]">Paid out</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-green-500 h-4 w-4"></span>

                    <div className="text-xl font-bold text-[color-for-amount]">
                      $0.00
                    </div>
                    <div>
                      <p className="text-[color-for-label]">Expected</p>
                    </div>
                  </div>
                </div>

                <Line
                  data={{
                    labels: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    datasets: [
                      {
                        label: "Paid out",
                        data: [
                          200, 200, 600, 800, 1000, 1200, 1000, 1200, 1000,
                          1200, 1000, 1200,
                        ], // Replace with your actual paid out data
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        fill: true,
                      },
                      {
                        label: "Expected",
                        data: [
                          250, 450, 650, 850, 1050, 1250, 200, 600, 800, 1000,
                          1200, 1400,
                        ], // Replace with your actual expected data
                        borderColor: "rgba(255, 99, 132, 1)",
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        fill: true,
                      },
                    ],
                  }}
                />
              </div>
            </div>
            <div className="my-20">
              <h1 className="text-2xl font-bold">2023 Details</h1>
              <TopEarningApartments apartments={apartmentData} />
            </div>
          </items>

          <items tab="Views" key="3">
            <div>
              <div className="my-4">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select a month"
                  onChange={(value) => setSelectedMonth(value)}
                  value={selectedMonth}
                >
                  {generateMonthss().map((monthYear) => (
                    <Option key={monthYear} value={monthYear}>
                      {monthYear}
                    </Option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-wrap">
                <div>
                  <div className="flex flex-col mr-6">
                    <span className="text-4xl font-bold mb-2">0</span>
                    <span className="text-base">Views, past 30 days</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col mr-7">
                    <span className="text-4xl font-bold mb-2">0</span>
                    <span className="text-base">
                      New bookings, past 30 days
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold mb-2">0%</span>
                    <span className="text-base">Booking rate</span>
                  </div>
                </div>
              </div>
            </div>
          </items>

         
        </Tabs>
      </div>

      <Modal
        open={showListingsModal}
        onCancel={hideListingsModal}
        title="Apartment Listings"
        footer={null}
      >
        <ul>
          {apartmentData.map((apartment) => (
            <li
              key={apartment.id}
              className="flex items-center justify-between my-4"
            >
              <Checkbox onChange={() => handleApartmentClick(apartment.id)}>
                {apartment.name}
              </Checkbox>
              <img src={apartment.image} className="w-10" alt="" />
            </li>
          ))}
        </ul>
      </Modal>

      <HostBottomNavigation/>
    </div>
  );
}
