import React, { useState, useEffect } from "react";
import { Tabs, Button, DatePicker, Dropdown, Modal, message, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import GoBackButton from "../GoBackButton";
import Popup from "../../hoc/Popup";
import {
  StarOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
// import Logo from "../../assets/logo.png";
import axios from '../../Axios';
import Rating from "../ListingInfo/Ratings";
import { Avatar } from 'antd';
import RateHouseModal from "../RateHouseModal";
import { notification } from "antd";

const Reservations = () => {
  const [allKey, setAllKey] = useState("6");
  const [filterDate, setFilterDate] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [selectedRateHouseModal, setSelectedRateHouseModal] = useState(null);
  const [isRateHouseModalOpen, setIsRateHouseModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);
  const [drawer, setDrawer] = useState(false);
  const [dataMain, setData] = useState([]);
  const [hostPendingReviewforGuest, setPendingReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageSent, setMessageSent] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [messages, setMessages] = useState("");
  const [form] = Form.useForm(); //

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, error) => {
    api[type]({
      message: type === "error" ? "Error" : "Succesfull",
      description: error,
      placement: "topRight",
      className: "bg-green",
    });
  };


  const calculateDaysDifference = (date1, date2) => {
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const daysDifference = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    return daysDifference;
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  function formatAmountWithCommas(amount) {
    // Convert the amount to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = amount.toString().split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts with a dot if there is a decimal part
    const formattedAmount = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

    return formattedAmount;
  }


  useEffect(() => {
   
      setLoading(true);
      axios.get('/allReservation').then(response => {
  
        const formattedData = response.data.bookings.map(item => ({
          key: item.aboutGuest.id,
          status: item.status.toLowerCase(),
          guests: `${item.guests} guest(s)`,
          checkIn: item.check_in_date,
          checkOut: item.check_out_date,
          booked: formatDate(item.bookedDate),
          listing: item.title,
          confirmationCode: "ABC123",
          totalPayout: `  ₦ ${formatAmountWithCommas(item.amount)}`,
          guestName: item.aboutGuest.name,
          nights: calculateDaysDifference(item.check_in_date, item.check_out_date),
          profilePic: item.profilepic,
          rating: item.userReviews ? item.userReviews.ratings : 0,
          guestRating: item.aboutGuest.rating,
          comment: item.userReviews ? item.userReviews.comment : "",
          cancelationPolicy: item.cancelationPolicy,
          link: `/UserDetails/${item.aboutGuest.id}`,
          guest_service_fee: `  ₦ ${formatAmountWithCommas(item.guest_service_fee)}`,
          host_service_fee: `  ₦  ${formatAmountWithCommas(item.host_service_fee)}`,
          dateUserJoined: item.dateUserJoined,
        })
        );
  
        console.log(formattedData);
        setData(formattedData);
  
  
      }).catch().finally(()=>{
        // setLoading(false)
      })
      getHostPendingReviewsForGuest().then(() => {
        setLoading(false); // Stop loader after all asynchronous tasks are completed
      });
   


  }, []);


  const getHostPendingReviewsForGuest = async () => {

    await axios.get("/getHostPendingReviewsForGuest").then(response => {

      const formattedData = response.data.data.map(item => ({
        key: item.id,
        status: "review the guest",
        checkIn: item.checkInDate,
        checkOut: item.checkOutDate,
        // booked: formatDate(item.bookedDate),
        listing: item.title,
        // totalPayout: `  ₦ ${formatAmountWithCommas(item.amount)}`,
        guestName: item.guestName,
        guestId: item.guestid,
        hostid: item.hostid,
        bookingid: item.bookingid,
        hosthomeid: item.hosthomeid,
        profilePic: item.guestProfilePicture,
        address: item.address,




      })
      );

      console.log("Pending Review", formattedData);
      setPendingReview(formattedData);


    }).catch().finally(() =>"");

  }




  const handleSubmit = () => {
    // e.preventDefault();
    setVisible(!visible);
  };

  const handlePopup = (key) => {
    if (window.innerWidth < 768) {
      setDrawer(true);
    } else {
      setDrawer(false);
    }
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
    ...dataMain,
    // Add more data objects for other rows
  ];

  const statusMap = {
    "1": "upcoming",
    "2": "completed",
    "3": "cancelled",
    "4": "pending",
    "5": "ongoing",
    "6": "", // "All" tab
  };




  // Function to filter the table based on the selected date range
  // ... (existing code)

  // Function to filter the table based on the selected date range and status
  const handleFilter = (dates) => {
    setFilterDate(dates);
  };

  // Updated filter function to consider both date range and status
  const filterFunction = (record) => {
    const dateFilter =
      !filterDate ||
      (filterDate &&
        filterDate[0] <= new Date(record.checkOut) &&
        filterDate[1] >= new Date(record.checkIn));

    const statusFilter =
      !allKey || (allKey === "6" ? true : record.status === statusMap[allKey]);

    return dateFilter && statusFilter;
  };

  const filteredData = data.filter(filterFunction);



  // console.log(filteredData)

  const items = [
    {
      key: "1",
      label: (
        <div className=" text-neutral-700      rounded-t-lg">Upcoming</div>
      ),
      children: filteredData.length > 0 ? (
        <CardTable
          dataSource={filteredData}
          handlePopup={(key) => handlePopup(key)}
        />
      ) : empty("6", "upcoming"),
    },
    {
      key: "2",
      label: <div className="text-neutral-700     rounded-t-lg">Completed</div>,
      children: filteredData.length > 0 ? (
        <CardTable
          dataSource={filteredData}
          handlePopup={(key) => handlePopup(key)}
        />
      ) : (
        empty("6", "completed")
      ),
    },
    {
      key: "3",
      label: <div className="text-neutral-700   rounded-t-lg">Cancelled</div>,
      children:
        filteredData.length > 0 ?
          (
            <CardTable
              dataSource={filteredData}
              handlePopup={(key) => handlePopup(key)}
            />
          ) : empty("6", "cancelled"),
    },
    {
      key: "4",
      label: <div className="text-neutral-700   rounded-t-lg">Pending</div>,
      children:
        filteredData.length > 0 ?
          (
            <CardTable
              dataSource={filteredData}
              handlePopup={(key) => handlePopup(key)}
            />
          ) : empty("6", "pending"),
    },
    {
      key: "5",
      label: <div className="text-neutral-700   rounded-t-lg">Ongoing</div>,
      children:
        filteredData.length > 0 ?
          (
            <CardTable
              dataSource={filteredData}
              handlePopup={(key) => handlePopup(key)}
            />
          ) : empty("6", "ongoing"),
    },
    {
      key: "6",
      label: <div className="text-neutral-700      rounded-t-lg">All</div>,
      children:
        filteredData.length > 0 ? (
          <CardTable
            dataSource={filteredData}
            handlePopup={(key) => handlePopup(key)}
          />
        ) : empty("6", ""),
    },
    {
      key: "7",
      label: <div className="text-neutral-700      rounded-t-lg">Review Guests</div>,
      children:
        hostPendingReviewforGuest.length > 0 ? (
          <CardTable
            dataSource={hostPendingReviewforGuest}
            handlePopup={(key) => openRateHouseModal(hostPendingReviewforGuest, key)}
          />
        ) : empty("6", "Guests to Review"),
    },
  ];

  const skeletonLoader = Array.from({ length: 6 }).map((group, index) =>
    <div
      key={index}
      className=" relative  h-fit row-span-1    w-full  md:mt-2  md:px-2 "
    >
      <div
        className=" rounded-xl h-32 skeleton-loader cursor-pointer p-4  flex hover:bg-slate-100/10 max-w-[100%]  "
      >
        <div className=" flex-1 gap-3 flex flex-col   ">
          <div className="status font-medium text-orange-300 ">

          </div>
          <div className="name-checkin-checkout text-base  font-medium text-ellipsis   ">
            <p className="text-ellipsis overflow-hidden whitespace-nowrap w-[50%] ">

            </p>

          </div>
          <div className="listing text-gray-500 text-sm     ">
            <p className=" text-ellipsis overflow-hidden whitespace-nowrap w-[50vw] md:w-[23vw]  ">

            </p>
          </div>
        </div>

        <div className="  ">
          <div className="rounded-xl  relative ">
            <div
              className={`relative   box-border block md:h-[60px] md:w-[60px] h-[45px] w-[45px] 
                        
                            bg-center rounded-[50%] bg-cover bg-no-repeat  ` }
            ></div>
          </div>
        </div>
      </div>
    </div>

  );

  const SkeletonLoaderTabs = Array.from({ length: 4 }).map((group, index) => (
    <div
      key={index}
      className={`  py-2 px-4 w-28  h-10 rounded-full   skeleton-loader `}
    >

    </div>

  ));

  const sendMessageToHost = async (receiverId) => {
    try {
      // Log the message before sending
      console.log("Sending message:", message);

      // Send the message to the API
      const response = await axios.post(`/chat/${receiverId}`, {
        message: messages,
      });

      // Set messageSent to true to indicate that the message was sent successfully
      setMessageSent(true);
      console.log("Message sent successfully");
      // showMessage.success("Message sent successfully");

      // Handle the response as needed
    } catch (error) {
      console.error("Error sending message to host:", error);
      // Handle errors
    }
  };

  const deletePendingReview = async (id) => {

    await axios.delete(`/deleteHostPendingReviews/${id}`).then(response => {
      console.log("Deleted Pending Review Successfully", response.data)

    }).catch(error => {
      console.log("DeletePendingReview", error)
    });


  }


  const ReviewListing = async (data) => {

  

    const reviewData = {
      pendingreviewid: selectedRateHouseModal[0].key,
      ratings: data.rating,
      bookingid: selectedRateHouseModal[0].bookingid,
      title: selectedRateHouseModal[0].listing,
      host_id: selectedRateHouseModal[0].hostid,
      comment: data.comment,
      guest_id: selectedRateHouseModal[0].guestId,
    }

    console.table(reviewData);

    await axios.post(`/createReviewsForguest`, reviewData).then(respnse => {
      openNotificationWithIcon("success");
      getHostPendingReviewsForGuest();
    }).catch(error => {
      console.log("createReview", error)
      openNotificationWithIcon("error");

    }).finally(() => {  getHostPendingReviewsForGuest()});

  }


  const closeRateHouseModal = () => {
    // deletePendingReview(houseDetails[0].id);
    setIsRateHouseModalOpen(false);
  };

  



  const openRateHouseModal = (dataSource, key) => {
    console.log("key", key);
  
    // Convert the key to a number
    const keyIndex = parseInt(key, 10);
  
    // Check if the keyIndex is a valid index in the dataSource array
    if (keyIndex >= 0 && keyIndex < dataSource.length) {
      const matchingItem = dataSource[keyIndex];
      console.log("Matching item found:", matchingItem);
      setIsRateHouseModalOpen(true);
      setSelectedRateHouseModal([matchingItem]);
      // Additional code to handle opening the rate house modal
    } else {
      console.log("No matching item found for key:", key);
    }
  }
  
  








  return (
    <div className="px-6 md:px-10 xl:px-20 max-w-7xl max-h-screen h-screen overflow-hidden  m-auto  flex  flex-col md:gap-4 relative ">
       {contextHolder}
      <div
        className="  py-[18px]  sticky  w-full top-0 block  bg-white
                                         box-border z-[50]   md:px-10 lg:px-6    "
      >
        <div className={`flex items-center gap-16 w-full relative  `}>
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
          {!loading && <Dropdown
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
          </Dropdown>}
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
          {!loading ? <Tabs
            defaultActiveKey="1"
            onTabClick={onTabClick}
            activeKey={allKey}
            items={items}
          />
            :
            <div className=" mt-5 ">

              {SkeletonLoaderTabs}

              <div className=" mt-3    w-full h-auto    gap-2 md:gap-4 grid grid-cols-1 md:grid-cols-2     ">
                {skeletonLoader}
              </div>
            </div>
          }

        </div>

        {/* Reservation Details ------------------------------------------------------------------------------------- */}

        <Popup
          isModalVisible={isModalVisible}
          handleCancel={() => {
            setIsModalVisible(false);
            setShow(false);
            setSelectedReservation(null);
          }}
          centered={true}
          drawer={drawer}
          // width={"100vw"}

          title={
            <div className=" text-xl w-full md:border-b  ">
              Reservation Details
            </div>
          }
        >
          <div className={`  ${drawer ? "h-full overflow-y-scroll" : "h-[80vh] overflow-y-scroll"}`}>
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
                        {filteredData[selectedReservation].checkIn} - {filteredData[selectedReservation].checkOut}{" "}
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
                      {/* <div
                        style={{ backgroundImage: `url(${filteredData[selectedReservation].profilePic})` }}
                        className={` relative   box-border block md:h-[50px] md:w-[50px] h-[45px] w-[45px] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat   `}
                      ></div> */}

                      <Avatar className={` relative   box-border block md:h-[50px] md:w-[50px] h-[45px] w-[45px] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat   `} src={`${filteredData[selectedReservation].profilePic}`} />

                      {/* <div className=" border-white border-2  box-border block h-[40px] w-[40px] 
                                          bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat absolute top-0 right-2    ">

                                          </div> */}
                    </div>
                  </div>
                </div>
                {/* <div class=" top-0 left-0 after:block after:w-full after:h-px after:bg-gray-200 "></div> */}

                {/* Guests Review if Reservation has been completed meaning the gueest has stayed there else it shouldn't show  */}

                {filteredData[selectedReservation].rating != "" && <div className="p-2 md:p-3 w-full bg-slate-200/10 rounded-lg">
                  <p className=" font-medium md:text-lg   ">
                    {" "}
                    {`${filteredData[selectedReservation].guestName}'s  review`}
                    :
                  </p>
                  <div
                    className={` text-ellipsis overflow-hidden    w-[95%] md:w-[80%] ${show ? " whitespace-normal" : "whitespace-nowrap"
                      }   `}
                  >
                    <label className=" text-sm text-gray-600 ">
                      <Rating rating={filteredData[selectedReservation].rating} />
                      {filteredData[selectedReservation].comment}
                    </label>
                  </div>
                  <button
                    className=" underline font-medium "
                    type="button"
                    onClick={toggleShow}
                  >
                    Show {show ? " less" : "more"}{" "}
                  </button>
                </div>}

                {/* Guests info  */}

                <div className=" p-2 md:p-3 w-full bg-slate-200/10 rounded-lg">
                  <p className="text-xl pb-2 font-medium  ">
                    Things to know about{" "}
                    {filteredData[selectedReservation].guestName}{" "}
                  </p>
                  <ul className=" pb-3">
                    <li>
                      <StarOutlined />
                      <label className=" pl-1 ">{filteredData[selectedReservation].guestRating}.0 rating </label>
                    </li>
                    <li>
                      {" "}
                      <CheckCircleOutlined className="  rounded-[50px] text-black/80  " />
                      <label className=" pl-1 ">Verified identity </label>
                    </li>
                    <li className=" flex  ">
                      <label className=" pl-1 ">Joined Shrbo in {filteredData[selectedReservation].dateUserJoined} </label>{" "}
                    </li>
                  </ul>
                  <Link
                    to={filteredData[selectedReservation].link}
                    className=" underline font-medium hover:text-black "
                  >
                    View guest Profile{" "}
                  </Link>

                  <div className=" py-6">

                    <button
                      onClick={() => setMessageModalVisible(true)}
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


                    <Modal
                      title="Message Host"
                      open={messageModalVisible}
                      onCancel={() => setMessageModalVisible(false)}
                      footer={[
                        <Button key="cancel" onClick={() => setMessageModalVisible(false)}>
                          Cancel
                        </Button>,
                        <Button
                          key="send"
                          type="primary"
                          onClick={() => sendMessageToHost(filteredData[selectedReservation].key, message)}
                        >
                          Send
                        </Button>,
                      ]}
                    >
                      <Form
                        onFinish={sendMessageToHost}
                        form={form}
                        initialValues={{ message: "" }}
                      >
                        {messageSent ? (
                          <p>Message sent successfully</p>
                        ) : (
                          <>
                            <Form.Item
                              name="message"
                              rules={[
                                {
                                  required: true,
                                  message: "Please enter your message",
                                },
                              ]}
                            >
                              <Input.TextArea
                                placeholder="Type your message here..."
                                style={{ width: "100%", minHeight: "100px" }}
                                value={messages}
                                onChange={(e) => setMessages(e.target.value)}
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                type="primary"
                                className="bg-orange-400 hover:bg-orange-600"
                                htmlType="submit"
                                onClick={() => {
                                  sendMessageToHost(filteredData[selectedReservation].key);
                                  setMessages("");
                                }}
                              >
                                Send
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form>
                    </Modal>

                  </div>
                </div>

                {/* Details and Pricing---------------------------------------------------                 */}

                <div className="property-listing   ">
                  <div className="property-listing-container flex flex-wrap  bg-slate-200/10 rounded-lg  ">
                    <div className="property-listed--2 m-5 w-full md:w-full">
                      <header className="text-xl font-medium">
                        Booking Details
                      </header>

                      {/* <div className="property-info-details flex items-center justify-between py-4 text-gray-500 border-b-[1px]">
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
                      </div> */}
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
                      {/* <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Confirmation code</div>
                        <div className=" font-medium">
                          {filteredData[selectedReservation].confirmationCode}{" "}
                        </div>
                      </div> */}
                      <div className="property-info-details flex justify-between py-4 text-gray-500 border-b-[1px]">
                        <div className=" font-normal">Cancellation policy</div>
                        <div className=" font-medium">{filteredData[selectedReservation].cancelationPolicy}</div>
                      </div>
                    </div>
                  </div>

                  <div className="property-listed--3 mt-5 p-5 bg-slate-200/10 rounded-lg">
                    <header className="text-xl font-medium">Guest paid</header>

                    <div className="payment-details-info w-full ">
                      <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div>
                          {/* {filteredData[selectedReservation].totalPayout} x{" "} */}
                          {filteredData[selectedReservation].nights} night(s){" "}
                        </div>
                        <div className=" ">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                      <div className="property-info-details flex justify-between py-4 text-gray-500   ">
                        <div>Guest service fee</div>
                        <div> {filteredData[selectedReservation].guest_service_fee}</div>
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
                          {filteredData[selectedReservation].nights} night(s) room
                          fee{" "}
                        </div>
                        <div className=" ">
                          {filteredData[selectedReservation].totalPayout}{" "}
                        </div>
                      </div>
                      {/* <div className="property-info-details flex justify-between py-4 text-gray-500 ">
                        <div>Nightly rate adjustment</div>
                        <div className=" ">-$50</div>
                      </div> */}
                      <div className="property-info-details flex justify-between py-4 text-gray-500  ">
                        <div>Host service fee</div>
                        <div>-{filteredData[selectedReservation].host_service_fee}</div>
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


{
isRateHouseModalOpen&&
  <RateHouseModal
    isOpen={isRateHouseModalOpen}
    onClose={closeRateHouseModal}
    houseDetails={selectedRateHouseModal}
    review={(data) => { ReviewListing(data) }}
    type={false}
  />

}







    </div>
  );
};

export default Reservations;

const CardTable = ({ dataSource, handlePopup }) => {
  return (
    <div className="overflow-y-scroll h-[65vh] ">

      <div className="    w-full h-auto    gap-2 md:gap-4 grid grid-cols-1 md:grid-cols-2     ">
        {(dataSource && dataSource.length != 0) ? <>
          {dataSource.map((data, index) => (
            <div
              key={index}
              className=" relative  h-fit row-span-1    w-full  md:mt-2  md:px-2 "
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
                    <p>{data.checkIn} - {data.checkOut}</p>
                  </div>
                  <div className="listing text-gray-500 text-sm     ">
                    <p className=" text-ellipsis overflow-hidden whitespace-nowrap w-[50vw] md:w-[23vw]  ">
                      {data.listing}{" "}
                    </p>
                  </div>
                </div>

                <div className="  ">
                  <div className="rounded-xl  relative ">
                    {/* <div
                      style={{ backgroundImage: `url(${data.profilePic})` }}
                      className={`relative   box-border block md:h-[60px] md:w-[60px] h-[45px] w-[45px] 
                        
                            bg-center rounded-[50%] bg-cover bg-no-repeat  ` }
                    ></div> */}

                    <Avatar className={` relative   box-border block md:h-[60px] md:w-[60px] h-[45px] w-[45px] 
                                          bg-center rounded-[50%] bg-cover bg-no-repeat   `} src={`${data.profilePic}`} />

                    {/* <div className=" border-white border-2  box-border block h-[40px] w-[40px] 
                            bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                            bg-center rounded-[50%] bg-cover bg-no-repeat absolute top-0 right-2    ">

                            </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
          :
          <div className=" text-center w-full text-base font-medium mt-10">
            No Reservations Found ,<br></br>Clear date filter
          </div>
        }

      </div>
    </div>
  );
};
