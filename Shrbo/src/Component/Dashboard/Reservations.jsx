import React, { useState } from "react";
import { Tabs, Table, Button, DatePicker, Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";
import GoBackButton from "../GoBackButton";
import Popup from "../../hoc/Popup";
import {
  StarOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/logo.png";

const Reservations = () => {
  const [allKey, setAllKey] = useState("1");
  const [filterDate, setFilterDate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const handleSubmit = () => {
    // e.preventDefault();
    setVisible(!visible);
  };

  const handlePopup = (key) => {
    setIsModalVisible(true);
    setSelectedReservation(key);
    console.log(key);
  };

  const toAll = (key) => {
    setAllKey(key);
    // console.log(allKey);
  };

  const onTabClick = (key) => {
    setAllKey(key);
    // console.log(key);
  };

  const navigate = useNavigate();

  // Takes you back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  const empty = (all, name) => (
    <div className=" flex flex-col items-center h-full mt-14  md:text-base  font-medium justify-center ">
      <p>No {name} reservations</p>
      {name && (
        <button className="underline" onClick={() => toAll(all)}>
          See all reservations
        </button>
      )}
    </div>
  );

  const data = [
    {
      key: "1",
      status: "Upcoming",
      guests: "4 adults",
      checkIn: "2023-11-01",
      checkOut: "2023-11-05",
      booked: "2023-10-27",
      listing: "Sample Listing",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Ben Ten",
      nights: 10,
    },
    {
      key: "2",
      status: "Completed",
      guests: "2 adults",
      checkIn: "2023-11-01",
      checkOut: "2023-11-05",
      booked: "2023-10-27",
      listing: "Stunning 2 bedroom Loft",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Duncan",
      nights: 5,
    },
    {
      key: "3",
      status: "Canceled by Airbnb",
      guests: "1 adults",
      checkIn: "2023-11-03",
      checkOut: "2023-11-04",
      booked: "2023-10-27",
      listing: "Penthouse in La juarez",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Jova Larkin",
      nights: 2,
    },
    {
      key: "4",
      status: "Pending",
      guests: "4 adults 2 children",
      checkIn: "2023-11-01",
      checkOut: "2023-11-05",
      booked: "2023-10-27",
      listing: "Penthouse in La juarez",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Rick Sanchez",
      nights: 12,
    },
    {
      key: "5",
      status: "Canceled by Airbnb",
      guests: "1 adult 1 pet",
      checkIn: "2023-11-03",
      checkOut: "2023-11-07",
      booked: "2023-10-27",
      listing: "Penthouse in La juarez",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Bruce Wayne",
      nights: 15,
    },
    {
      key: "6",
      status: "Pending",
      guests: "4 adults 2 infants",
      checkIn: "2023-11-02",
      checkOut: "2023-11-05",
      booked: "2023-10-27",
      listing: "Penthouse in La juarez",
      confirmationCode: "ABC123",
      totalPayout: "$500.00",
      guestName: "Jova Larkin",
      nights: 100,
    },

    // Add more data objects for other rows
  ];

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Guests",
      dataIndex: "guests",
      key: "guests",
    },
    {
      title: "Check-In",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "Check-Out",
      dataIndex: "checkOut",
      key: "checkOut",
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "booked",
    },
    {
      title: "Listing",
      dataIndex: "listing",
      key: "listing",
    },
    {
      title: "Confirmation Code",
      dataIndex: "confirmationCode",
      key: "confirmationCode",
    },
    {
      title: "Total Payout",
      dataIndex: "totalPayout",
      key: "totalPayout",
    },
    {
      // title: "Details",
      key: "action",
      render: () => (
        <Button type="primary" onClick={() => handleDetails()}>
          Details
        </Button>
      ),
    },
  ];

  // Function to filter the table based on the selected date range
  const handleFilter = (dates) => {
    setFilterDate(dates);
  };

  // Filter function to check if a reservation falls within the selected date range
  const filterFunction = (record) => {
    if (!filterDate) return true; // If no date is selected, show all records
    const [checkIn, checkOut] = filterDate.map((date) => new Date(date));
    console.log(checkIn);
    const recordCheckIn = new Date(record.checkIn);
    const recordCheckOut = new Date(record.checkOut);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Use toDateString() to format the dates as "yyyy-mm-dd" for comparison
    return (
      formatDate(recordCheckIn) >= formatDate(checkIn) &&
      formatDate(recordCheckOut) <= formatDate(checkOut)
    );
  };

  const filteredData = data.filter(filterFunction);
  // console.log(filteredData)

  const children1 = null;
  const items = [
    {
      key: "1",
      label: (
        <div className=" text-neutral-700      rounded-t-lg">Upcoming</div>
      ),
      children: children1 || empty("6", "upcoming"),
    },
    {
      key: "2",
      label: <div className="text-neutral-700     rounded-t-lg">Completed</div>,
      children:
        (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) || empty("6", "completed"),
    },
    {
      key: "3",
      label: <div className="text-neutral-700   rounded-t-lg">Canceled</div>,
      children:
        (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) || empty("6", "canceled"),
    },
    {
      key: "4",
      label: <div className="text-neutral-700   rounded-t-lg">Pending</div>,
      children:
        (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) || empty("6", "pending"),
    },
    {
      key: "5",
      label: <div className="text-neutral-700   rounded-t-lg">Ongoing</div>,
      children:
        (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) || empty("6", "ongoing"),
    },
    {
      key: "6",
      label: <div className="text-neutral-700      rounded-t-lg">All</div>,
      children:
        (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) || empty("6", ""),
    },
  ];

  // Define data for the table

  return (
    <div className="px-6 md:px-10 xl:px-20 max-w-7xl  h-screen  m-auto  flex  flex-col md:gap-4 relative ">
      <div
        className="  py-[18px]  sticky  w-full top-0 block  bg-white
                                         box-border z-[50]   md:px-10 lg:px-6    "
      >
        <div className=" flex items-center gap-16 w-full relative  ">
          <GoBackButton />

          <div className=" pr-[18px] -ml-8 mt-[10px]  md:block cursor-pointer hidden  md:relative ">
            <button onClick={handleGoBack} className="   ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
              >
                <title>goback</title>
                <path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" />
              </svg>
            </button>
          </div>
          <Dropdown
            // menu={{
            //  items:dropdownItems,
            // }}
            dropdownRender={(menu) => (
              <div className=" bg-white ">
                <div className="p-2 flex-col w-full shadow-md rounded-xl ">
                  <div className=" flex flex-col justify-center items-center  h-full">
                    <DatePicker.RangePicker
                      onChange={handleFilter}
                      className=" h-16 text-lg"
                      placeholder={["Check-In Date", "Check-Out Date"]}
                    />

                    <button
                      onClick={handleSubmit}
                      className="block mt-7 w-[150px] mb-2  h-10 rounded-xl bg-orange-400 px-5 pb-2 pt-2 text-base font-medium  leading-normal 
                                    text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
                                    focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                                    focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                                    dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
                                    dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2)
                                    ,0_4px_18px_0_rgba(59,113,202,0.1)]]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
            onOpenChange={handleSubmit}
            open={visible}
            placement="bottom"
            trigger={["click"]}
          >
            <div className=" pl-[18px] md:-mr-8 mt-[10px]  md:block cursor-pointer  absolute right-0  ">
              <button className="  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                >
                  <title>filter</title>
                  <path
                    d="M3.47 5C3.25 
                5 3.04 5.08 2.87 5.21C2.43 5.55 2.35 6.18 2.69 6.61L2.69 6.62L7 
                12.14V18.05L10.64 21.71C11 22.1 11.66 22.1 12.05 21.71L12.05 
                21.71C12.44 21.32 12.44 20.69 12.06 20.3L9 17.22V11.45L4.27 
                5.39C4.08 5.14 3.78 5 3.47 5M21.62 3.22C21.43 3.08 21.22 3 21 
                3H7C6.78 3 6.57 3.08 6.38 3.22C5.95 3.56 5.87 4.19 6.21 4.62L11 
                10.75V15.87C10.96 16.16 11.06 16.47 11.29 16.7L15.3 20.71C15.69 
                21.1 16.32 21.1 16.71 20.71C16.94 20.5 17.04 20.18 17 
                19.88V10.75L21.79 4.62C22.13 4.19 22.05 3.56 21.62 
                3.22M15 10.05V17.58L13 15.58V10.06L9.04 5H18.96L15 10.05Z"
                  />
                </svg>
              </button>
            </div>
          </Dropdown>
        </div>
        {/* <DatePicker.RangePicker
          onChange={handleFilter}
          placeholder={["Check-In Date", "Check-Out Date"]}
        /> */}
      </div>

      <div className=" w-full h-full  ">
        <div className=" mx-auto w-full box-border  text-base  md:block  ">
          <div className="  box-border text-base ">
            <section>
              <div className=" pt-4   pb-4 flex flex-row items-center box-border">
                <div className=" text-3xl font-semibold">
                  <h1 className=" "> Reservations</h1>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className=" max-w-full  h-full   ">
          <Tabs
            defaultActiveKey="1"
            onTabClick={onTabClick}
            activeKey={allKey}
            items={items}
          />
        </div>

        {/* Reservation Details ------------------------------------------------------------------------------------- */}

        <Popup
          isModalVisible={isModalVisible}
          handleCancel={() => {
            setIsModalVisible(false);
            setShow(false);
          }}
          centered={true}
          // width={"100vw"}

          title={
            <div className=" text-xl w-full border-b  ">
              Reservation Details
            </div>
          }
        >
          <div className="h-[80vh]  md:h-[70vh] example overflow-scroll">
            {selectedReservation != null ? (
              <div className=" flex-col flex gap-2  pt-2 h-full    ">
                {/* {filteredData[selectedReservation].status} */}
                <div className="status font-medium text-orange-300 ">
                  <p>{filteredData[selectedReservation].status}</p>{" "}
                </div>

                <div className=" rounded-lg  cursor-pointer p-2 md:p-3 border-slate  flex bg-slate-200/10 max-w-[100%]  ">
                  <div className=" flex-1 gap-2 flex flex-col overflow-hidden    ">
                    <div className="name-checkin-checkout text-sm font-normal    ">
                      <p
                        className=" text-xl
                           pb-2 font-medium "
                      >
                        {filteredData[selectedReservation].guestName}
                      </p>
                      <p className=" pb-1">
                        Sep 22 - Oct 2{" "}
                        {`(${filteredData[selectedReservation].nights} nights)`}{" "}
                      </p>
                      <p className=" ">
                        {`${filteredData[selectedReservation].guests} - ${filteredData[selectedReservation].totalPayout} `}{" "}
                      </p>
                    </div>
                    <div className="listing text-gray-500 text-sm     ">
                      <p className="    ">
                        {filteredData[selectedReservation].listing}{" "}
                      </p>
                    </div>
                  </div>

                  <div className="  ">
                    <div className="rounded-xl  relative ">
                      <div
                        className=" relative   box-border block md:h-[50px] md:w-[50px] h-[45px] w-[45px] 
                                          bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat   "
                      ></div>

                      {/* <div className=" border-white border-2  box-border block h-[40px] w-[40px] 
                                          bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat absolute top-0 right-2    ">

                                          </div> */}
                    </div>
                  </div>
                </div>
                {/* <div class=" top-0 left-0 after:block after:w-full after:h-px after:bg-gray-200 "></div> */}

                {/* Guests Review if Reservation has been completed meaning the gueest has stayed there else it shouldn't show  */}

                <div className="p-2 md:p-3 w-full bg-slate-200/10 rounded-lg">
                  <p className=" font-medium md:text-lg   ">
                    {" "}
                    {`${filteredData[selectedReservation].guestName}'s  review`}
                    :
                  </p>
                  <div
                    className={` text-ellipsis overflow-hidden    w-[95%] md:w-[80%] ${
                      show ? " whitespace-normal" : "whitespace-nowrap"
                    }   `}
                  >
                    <label className=" text-sm text-gray-600 ">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Obcaecati, itaque vel quis quia mollitia nulla aspernatur
                      non numquam eveniet pariatur in quisquam impedit nesciunt
                      architecto, iusto aperiam, sequi illum ullam?
                    </label>
                  </div>
                  <button
                    className=" underline font-medium "
                    type="button"
                    onClick={toggleShow}
                  >
                    Show {show ? " less" : "more"}{" "}
                  </button>
                </div>

                {/* Guests info  */}

                <div className=" p-2 md:p-3 w-full bg-slate-200/10 rounded-lg">
                  <p className="text-xl pb-2 font-medium  ">
                    Things to know about{" "}
                    {filteredData[selectedReservation].guestName}{" "}
                  </p>
                  <ul className=" pb-3">
                    <li>
                      <StarOutlined />
                      <label className=" pl-1 ">5.0 rating </label>
                    </li>
                    <li>
                      {" "}
                      <CheckCircleOutlined className="  rounded-[50px] text-black/80  " />
                      <label className=" pl-1 ">Verified identity </label>
                    </li>
                    <li className=" flex  ">
                      <label className=" pl-1 ">Joined Shrbo in 2020 </label>{" "}
                    </li>
                  </ul>
                  <Link
                    to={"/UserDetails"}
                    className=" underline font-medium hover:text-black "
                  >
                    View guest Profile{" "}
                  </Link>

                  <div className=" py-6">
                    <Link
                      to={"/ChatAndNotifcationTab"}
                      className=" hover:text-white "
                    >
                      <button
                        className="block  w-[140px]  h-11 rounded-3xl bg-orange-400 px-6 pb-2 pt-2 text-base font-medium  leading-normal 
                            text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
                            focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                            focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                            dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
                            dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2)
                            ,0_4px_18px_0_rgba(59,113,202,0.1)]]"
                      >
                        Message
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Details and Pricing---------------------------------------------------                 */}

                <div className="property-listing   ">
                  <div className="property-listing-container flex flex-wrap  bg-slate-200/10 rounded-lg  ">
                    <div className="property-listed--2 m-5 w-full md:w-full">
                      <header className="text-xl font-medium">
                        Booking Details
                      </header>

                      <div className="property-info-details flex items-center justify-between py-4 text-gray-500 border-b-[1px]">
                        <div>
                          {filteredData[selectedReservation].guestName}{" "}
                        </div>
                        <div>
                          <img
                            src="https://a0.muscache.com/im/pictures/user/24f4c560-4586-4eaf-bfef-06164ab677b4.jpg?aki_policy=profile_x_medium"
                            className="w-10 object-cover rounded-full"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Guests</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].guests}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Check-in</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].checkIn}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Check-out</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].checkOut}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Booked</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].booked}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Confirmation code</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].confirmationCode}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Cancellation policy</div>
                        <div className=" font-medium">Flexible</div>
                      </div>
                    </div>
                  </div>

                  <div className="property-listed--3 mt-5 p-5 bg-slate-200/10 rounded-lg">
                    <header className="text-xl font-medium">Guest paid</header>

                    <div className="payment-details-info w-full ">
                      <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div>
                          {filteredData[selectedReservation].totalPayout} x{" "}
                          {filteredData[selectedReservation].nights} nights{" "}
                        </div>
                        <div className=" ">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500   ">
                        <div>Guest service fee</div>
                        <div>$138.00</div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div className=" font-medium text-base">Total</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="property-listed--3 mt-5 p-5 bg-slate-200/10 rounded-lg">
                    <header className="text-xl font-medium">Host payout</header>

                    <div className="payment-details-info w-full ">
                      <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div>
                          {" "}
                          {filteredData[selectedReservation].nights} nights room
                          fee{" "}
                        </div>
                        <div className=" ">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div>Nightly rate adjustment</div>
                        <div className=" ">-$50</div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500  ">
                        <div>Host service fee (10%)</div>
                        <div>-$38.00</div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500  ">
                        <div className=" font-medium text-base">Total</div>
                        <div className=" font-medium ">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="m-4 font-semibold flex gap-2 items-center justify-center underline  ">
                    <Link to={"/HostPayment"} className="hover:text-black ">
                      <label className=" pl-1 cursor-pointer ">
                        Transaction History{" "}
                      </label>{" "}
                      <RightOutlined className=" text-xs  " />
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </Popup>

        {/* Reservation Details End ------------------------------------------------------------------------------------- */}
      </div>
    </div>
  );
};

export default Reservations;

const CardTable = ({ dataSource, handlePopup }) => {
  return (
    <div className=" example overflow-y-scroll  w-full    gap-2 md:gap-0 flex items-stretch justify-start lg:h-[438px] md:h-[530px]   h-[638px] flex-col md:flex-row   md:flex-wrap    ">
      {dataSource.map((data, index) => (
        <div
          key={index}
          className=" relative  h-fit   w-full md:w-1/2 md:mt-2  md:px-2 "
        >
          <div
            onClick={() => handlePopup(index)}
            className=" rounded-xl cursor-pointer p-4 border-slate border flex hover:bg-slate-100/10 max-w-[100%]  "
          >
            <div className=" flex-1 gap-3 flex flex-col   ">
              <div className="status font-medium text-orange-300 ">
                <p>{data.status}</p>{" "}
              </div>
              <div className="name-checkin-checkout text-base  font-medium text-ellipsis   ">
                <p className="text-ellipsis overflow-hidden whitespace-nowrap w-[50%] ">
                  {data.guestName}
                </p>
                <p>Sep 22 - Oct 2 </p>
              </div>
              <div className="listing text-gray-500 text-sm     ">
                <p className=" text-ellipsis overflow-hidden whitespace-nowrap w-[80%]   ">
                  {data.listing}{" "}
                </p>
              </div>
            </div>

            <div className="  ">
              <div className="rounded-xl  relative ">
                <div
                  className=" relative   box-border block md:h-[60px] md:w-[60px] h-[45px] w-[45px] 
                            bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                            bg-center rounded-[50%] bg-cover bg-no-repeat   "
                ></div>

                {/* <div className=" border-white border-2  box-border block h-[40px] w-[40px] 
                            bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                            bg-center rounded-[50%] bg-cover bg-no-repeat absolute top-0 right-2    ">

                            </div> */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
