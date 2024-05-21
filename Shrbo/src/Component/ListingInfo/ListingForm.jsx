import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import DateIcon from "../../assets/svg/date-icon.svg";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button, Dropdown, Space, message, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../hoc/Popup";
import ReportListing from "./ReportListing";
import CustomModal from "../CustomModal";
import { FlagOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import Axios from "../../Axios";
import { useDateContext } from "../../ContextProvider/BookingInfo";
import PriceSkeleton from "../../SkeletonLoader/PriceSkeleton";
import MessageModal from "../StayLengthModal";
import { addMonths } from "date-fns";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import StayLengthModal from "../StayLengthModal";
export default function ListingForm({
  reservations,
  reservation,
  guest,
  max_nights,
  min_nights,
  availability_window,
  advance_notice,
  hosthomecustomdiscounts,
  reservedPricesForCertainDay,
  weekend,
  preparation_time,
  hosthomeId,
  bookingRequestStatus,
  coHostId,
  userId,
  hostIds,
  vatFee,
  guestFeePrice,
}) {
  function showModal(e) {
    e.preventDefault();
    setIsModalVisible(true);
  }
  const [verified, setVerified] = useState(false);
  const [receiverId, setReceiverId] = useState(null);

  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [showMessageHostButton, setShowMessageHostButton] = useState(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [discount, setDiscount] = useState([]); // State to store the discount value
  const [appliedDiscount, setAppliedDiscount] = useState("");
  const [isBookButtonDisabled, setIsBookButtonDisabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [numberOfNights, setNumberOfNights] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [buttonText, setButtonText] = useState("Message Host");
  const [buttonTexts, setButtonTexts] = useState("Book");
  const [coHostNotAllowed, setCoHostNotAllowed] = useState(false);

  const messageRef = useRef(null);
  // const [checkInDate, setCheckInDate] = useState(null);
  // const [checkOutDate, setCheckOutDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibles, setIsModalVisibles] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  // const [adults, setAdults] = useState(1);
  // const [children, setChildren] = useState(0);
  // const [pets, setPets] = useState(0);
  // const [infants, setInfants] = useState(0);
  const [price, setPrice] = useState(null); // Initialize with a default value if needed
  const [bookedDates, setBookedDates] = useState([]); // Add this line
  const [totalPrice] = useState(null);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);
  const [serviceFees, setServiceFees] = useState(0);
  const [taxFees, setTaxFees] = useState(0);
  const [totalCosts, setTotalCosts] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [guestFee, setGuestFee] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [checkoutDates, setCheckoutDate] = useState(null); // Initialize with null or another default value
  const [hostId, setHostId] = useState(null); // State for hostId
  const { token } = useStateContext();
  const [messages, setMessages] = useState("");
  const [reservedPrice, setReservedPrice] = useState(0);
  const [matchedReservedPrices, setMatchedReservedPrices] = useState([]);
  const [coHostMessageShown, setCoHostMessageShown] = useState(false);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const response = await Axios.get("/user");
  //       setHostId(response.data.user.id);
  //       console.log(response.data.user.id);

  //       // console.log(response.data.verified);
  //       setVerified(response.data.verified); // Set the verified status
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       // Handle error, show error message, etc.
  //     }
  //   };

  //   fetchUsers();
  // }, []);

  // console.log(verified);
  const {
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults,
    setAdults,

    pets,
    setPets,
    hostFees,
    setHostFees,
    serviceFee,
    setServiceFee,
    setTax,
    setTotalPrice,
    totalCost,
    setTotalCost,
    setHousePrice,
    nights,
    setNights,
    setSecurityDeposits,
    setAppliedDiscounts,
  } = useDateContext();

  const [form] = Form.useForm(); // Define the form variable
  const [listingDetails, setListingDetails] = useState(null);

  useEffect(() => {
    setTotalCost(reservedPrice);
  }, [reservedPrice]);

  const showMessageModal = () => {
    setMessageModalVisible(true);
  };

  console.log(bookingRequestStatus);

  useEffect(() => {
    if (reservations && reservations.length > 0) {
      const experiencedGuest = reservations.some(
        (reservation) => reservation.reservation === "An experienced guest"
      );
      const pendingApproval = reservations.some(
        (reservation) =>
          reservation.reservation === "Approve or decline requests"
      );
      if (reservation === "Approve or decline requests") {
        setButtonText("Request Book");
      } else {
        setButtonText("Message Host");
      }

      if (reservation === "Approve or decline requests") {
        setButtonTexts("Request Book");
      } else {
        setButtonTexts("Book");
      }

      setShowMessageHostButton(!experiencedGuest && !pendingApproval);
    }

    if (bookingRequestStatus === "approved") {
      setShowMessageHostButton(true);
    } else if (reservation === "Use Instant Book") {
      setShowMessageHostButton(true);
    } else {
      setShowMessageHostButton(false);
    }
  }, [reservations, bookingRequestStatus, reservation]);

  const { id } = useParams(); // Get the ID parameter from the route
  console.log(max_nights);
  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        resetStateValues(); // Reset state values before fetching listing details

        let response;
        let headers = {};

        // Check if token exists in context
        if (token) {
          headers = {
            Authorization: `Bearer ${token}`,
          };

          response = await Axios.get(`showGuestHomeForAuthUser/${id}`, {
            headers,
          });
          setIsAuthenticated(true);
        } else {
          response = await Axios.get(`showGuestHomeForUnAuthUser/${id}`);
          setIsAuthenticated(false);
        }

        console.log(response);
        const receiverUserID = response.data.data.user.id;
        setReceiverId(receiverUserID);
        setListingDetails(response.data.data);
        setPrice(response.data.data.price);
        setHousePrice(price);
        const checkoutTimeDate = response.data.data.checkout;
        setSecurityDeposit(parseInt(response.data.data.securityDeposit));
        setGuestFee(response.data.data.guest_fee);
        setSecurityDeposits(parseInt(response.data.data.securityDeposit));
        const discounts = response.data.data.discounts;
        const discountValues = discounts.map((discount) => discount.discount);

        setBookingCount(response.data.data.bookingCount);
        setDiscount(discountValues);

        const bookedDates = response.data.data.bookedDates.map((date) => {
          const checkInDate = new Date(date.check_in);
          const checkOutDate = new Date(date.check_out);
          setCheckoutDate(checkOutDate);

          return { checkInDate, checkOutDate };
        });

        setBookedDates(bookedDates);

        const blockedDates = response.data.data.hosthomeblockeddates.flatMap(
          (dates) =>
            dates.map(({ date, start_date, end_date }) => ({
              startDate: start_date ? new Date(start_date) : new Date(date),
              endDate: end_date ? new Date(end_date) : new Date(date),
            }))
        );

        setBlockedDates(blockedDates);
      } catch (error) {
        console.error("Error fetching listing details:", error);
        // Handle error, show error message, etc.
      }
    };

    fetchListingDetails();
  }, [id, token]);

  console.log();

  console.log(hosthomecustomdiscounts);

  const resetStateValues = () => {
    setCheckInDate(null);
    setCheckOutDate(null);
    setTotalPrice(null);
    setHousePrice(null);
    setNights(0);
    setHostFees(0);
    setTotalCosts(0);
    setServiceFee(0);
    setServiceFees(0);
    setTaxFees(0);
    setTotalCost(0);
    setSecurityDeposit(0);
    setGuestFee(0);
    setBookingCount(0);
  };

  function handleCancel() {
    setIsModalVisible(false);
  }

  const handleCheckIn = (date) => {
    setCheckInDate(date);
    calculateTotalPrice(date, checkOutDate);
  };

  const handleCheckOut = (date) => {
    setCheckOutDate(date);
    calculateTotalPrice(checkInDate, date);
  };

  const predefinedDiscounts = [
    "20% New listing promotion",
    "5% Weekly discount",
    "10% Monthly discount",
  ];

  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate < checkInDate) {
      setIsBookButtonDisabled(true);
      setModalMessage(`Please select valid check-in and check-out dates`);
      setIsModalVisibles(true); // Show the modal
    } else {
      setIsBookButtonDisabled(false);
    }
  }, [checkInDate, checkOutDate]);

  const handleModalCancel = () => {
    setIsModalVisibles(false); // Hide the modal
    resetStateValues(); // Reset the state values
  };

  const matchingDiscounts = discount.filter((discount) =>
    predefinedDiscounts.includes(discount)
  );

  console.log(
    matchingDiscounts.length > 0 ? matchingDiscounts : "No matches found"
  );

  console.log(bookingCount);

  const calculateWeekendNights = (checkIn, checkOut) => {
    let weekendNights = 0;
    let currentDate = new Date(checkIn);

    while (currentDate < checkOut) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 6 || dayOfWeek === 0) {
        // 6 is Saturday, 0 is Sunday
        weekendNights++;
      }
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    return weekendNights;
  };
  console.log(checkoutDates);

  useEffect(() => {
    if (
      preparation_time === "1 night before and after each reservation" &&
      checkoutDates
    ) {
      const blockedDate = new Date(checkoutDates);
      blockedDate.setDate(checkoutDates.getDate() + 1);
      const blockedDateString = blockedDate.toISOString().split("T")[0];

      const isBlockedDateBooked = bookedDates.some(
        (date) =>
          date.checkInDate <= blockedDateString &&
          date.checkOutDate >= blockedDateString
      );

      if (!isBlockedDateBooked) {
        setBookedDates((prevBookedDates) => [
          ...prevBookedDates,
          { checkInDate: blockedDate, checkOutDate: blockedDate },
        ]);
      }
    }

    if (
      preparation_time === "2 nights before and after each reservation" &&
      checkoutDates
    ) {
      const blockedDate1 = new Date(checkoutDates);
      blockedDate1.setDate(checkoutDates.getDate() + 1);
      const blockedDateString1 = blockedDate1.toISOString().split("T")[0];

      const isBlockedDateBooked1 = bookedDates.some(
        (date) =>
          date.checkInDate <= blockedDateString1 &&
          date.checkOutDate >= blockedDateString1
      );

      if (!isBlockedDateBooked1) {
        setBookedDates((prevBookedDates) => [
          ...prevBookedDates,
          { checkInDate: blockedDate1, checkOutDate: blockedDate1 },
        ]);
      }

      const blockedDate2 = new Date(checkoutDates);
      blockedDate2.setDate(checkoutDates.getDate() + 2);
      const blockedDateString2 = blockedDate2.toISOString().split("T")[0];

      const isBlockedDateBooked2 = bookedDates.some(
        (date) =>
          date.checkInDate <= blockedDateString2 &&
          date.checkOutDate >= blockedDateString2
      );

      if (!isBlockedDateBooked2) {
        setBookedDates((prevBookedDates) => [
          ...prevBookedDates,
          { checkInDate: blockedDate2, checkOutDate: blockedDate2 },
        ]);
      }
    }
  }, [preparation_time, checkoutDates]);
  console.log(vatFee);
  console.log(guestFeePrice);

  const calculateTotalPrice = (checkIn, checkOut) => {
    // Ensure that checkIn and checkOut are valid dates
    if (checkIn instanceof Date && checkOut instanceof Date) {
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      setNumberOfNights(nights);

      if (nights === 2) {
        setIsDisabled(true); // Disable the book button
      }
      const nightlyPrice = Number(price) || 0; // Convert price to a number, default to 0 if NaN

      // Calculate basePrice

      let basePrice = nights * nightlyPrice;
      console.log(basePrice);
      let basenormalPrice = basePrice;
      let reservedPrice = basePrice; // Initialize reservedPrice
      let weekendPrices = 0;
      let weekendCost = 0;

      if (reservedPricesForCertainDay.length > 0) {
        const flattenedReservedDates = reservedPricesForCertainDay.flat();
        console.log(flattenedReservedDates);
        const checkInDate = checkIn.getTime();
        const checkOutDate = checkOut.getTime();

        // Filter out reservations that don't match the current check-in and check-out dates
        const updatedMatchedReservedPrices = matchedReservedPrices.filter(
          (reservation) => {
            const reservationDate = new Date(reservation.date).getTime();
            return (
              reservationDate >= checkInDate && reservationDate < checkOutDate
            );
          }
        );

        setMatchedReservedPrices(updatedMatchedReservedPrices);

        flattenedReservedDates.forEach((reservedDate) => {
          const reservedDateValue = new Date(reservedDate.date).getTime();
          const reservedEndDate = reservedDate.end_date
            ? new Date(reservedDate.end_date).getTime()
            : reservedDateValue;
          const reservedPriceValue = Number(reservedDate.price);

          if (
            (reservedDateValue < checkOutDate &&
              reservedDateValue >= checkInDate) ||
            (reservedEndDate &&
              reservedEndDate < checkOutDate &&
              reservedEndDate >= checkInDate) ||
            (reservedDateValue < checkInDate &&
              reservedEndDate &&
              reservedEndDate >= checkOutDate)
          ) {
            let reservedDays = 0;
            for (
              let date = new Date(reservedDateValue);
              date <= reservedEndDate;
              date.setDate(date.getDate() + 1)
            ) {
              const currentDate = date.getTime();
              if (currentDate >= checkInDate && currentDate < checkOutDate) {
                reservedDays++;
              }
            }

            // Calculate the total nightly price for the reserved days
            const totalnightlydays = nightlyPrice * reservedDays;

            // Subtract the total nightly price for the reserved days from basenormalPrice
            basenormalPrice -= totalnightlydays;

            // Add the reserved price for the reserved days to basenormalPrice
            basenormalPrice += reservedPriceValue * reservedDays;

            // Calculate the reserved price
            reservedPrice = basenormalPrice;

            console.log(
              "Total nightly price for reserved days:",
              totalnightlydays
            );
            console.log(
              "Updated basenormalPrice after adjusting for reserved days:",
              basenormalPrice
            );
            console.log("Reserved price after calculation:", reservedPrice);

            // Add the new reservation to matchedReservedPrices if it's not already there
            if (
              !updatedMatchedReservedPrices.some(
                (r) =>
                  new Date(r.date).getTime() === reservedDateValue &&
                  new Date(r.end_date).getTime() === reservedEndDate
              )
            ) {
              updatedMatchedReservedPrices.push({
                date: reservedDateValue,
                end_date: reservedEndDate,
                price: reservedPriceValue,
                reservedDays: reservedDays,
              });
            }
          }
          // if (reservedPricesForCertainDay.length < 0) {
          //   reservedPrice = basePrice;

          // }
        });

        // Calculate the total price for the booking
        // const totalPrice =
        //   nightlyPrice * (checkOutDate - checkInDate) +
        //   updatedMatchedReservedPrices.reduce(
        //     (acc, cur) => acc + cur.price * cur.reservedDays,
        //     0
        //   );
        // console.log("Total price for the booking:", totalPrice);
      }

      // Update reservedPrice state here

      // Deduct 20,000 from the final basenormalPrice

      // This is for weekend calculation
      // Check if the weekend price should be applied
      let weekendNights = 0; // Initialize a counter for weekend nights

      if (weekend !== null && weekend !== "" && !isNaN(Number(weekend))) {
        const weekendPrice = Number(weekend);
        console.log("Weekend Price:", weekendPrice);
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        let currentDate = new Date(startDate);

        while (currentDate < endDate) {
          if (currentDate.getDay() === 5 || currentDate.getDay() === 6) {
            weekendNights++; // Increment the counter for weekend nights
          }
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }

        weekendCost = weekendNights * weekendPrice;
        console.log("Number of weekend nights:", weekendNights);
        console.log("Total cost for weekend nights:", weekendCost);
        console.log("weekendCost " + weekendCost);
        weekendPrices = weekendCost;
        console.log("Updated weekendPrices with weekendCost:", weekendPrices);

        // Adjust the reserved price for weekend nights
        if (weekendNights === 0) {
          // Do nothing if there are no weekend nights
          reservedPrice = reservedPrice;
          console.log(reservedPrice);
        } else {
          console.log(reservedPrice);
          // Remove two nightly prices from the reserved price and add the weekend price
          reservedPrice = reservedPrice - weekendNights * nightlyPrice;
        }

        console.log(
          "Updated reserved price after weekend calculation:",
          reservedPrice
        );
      }

      reservedPrice + weekendCost + securityDeposit;
      let reservedPriceForApartment = reservedPrice + weekendPrices;
      console.log(reservedPriceForApartment);

      //

      // Assuming host fees is 20%, service fee is 5%, and tax is 4%
      // const hostFees = 0.07 * basePrice;
      console.log(basePrice);

      const guest_fee = guestFee * nights;

      const securityDeposits = securityDeposit;
      const totalPrice = nights * nightlyPrice;
      console.log("totalPrice " + totalPrice);
      const TotalPrice = reservedPriceForApartment + securityDeposit;
      console.log("basePrice " + basePrice);
      console.log("TotalPrice " + TotalPrice);
      setTotalCost(reservedPriceForApartment);

      setHousePrice(price);
      setNights(nights);
      setTotalPrice(reservedPriceForApartment);
      console.log(totalPrice);

      // setReservedPrice(reservedPrice);
      console.log(reservedPrice);
      console.log(securityDeposit);
      console.log(totalCost);

      console.log(reservedPrice);
      console.log(totalCost);
      setHostFees(hostFees);
      setTotalCosts(totalCosts);
      setServiceFee(serviceFees);
      setServiceFees(serviceFees);

      // Check if custom discounts should be applied
      // Check if custom discounts should be applied
      if (hosthomecustomdiscounts.length > 0) {
        let weekDiscount = 0;
        let monthDiscount = 0;

        // Loop through the custom discounts
        hosthomecustomdiscounts.forEach((discount) => {
          if (discount.duration === "1 month") {
            monthDiscount = Number(discount.discount_percentage);
          } else if (discount.duration === "1 week") {
            weekDiscount = Number(discount.discount_percentage);
          }
        });

        let customDiscountPercentage = 0; // Default discount percentage

        if (nights >= 30 && monthDiscount > 0) {
          customDiscountPercentage = monthDiscount / 100; // Convert percentage to decimal
        } else if (nights >= 7 && weekDiscount > 0) {
          customDiscountPercentage = weekDiscount / 100;
        }
        console.log(customDiscountPercentage);

        const baseDiscountedPrice = parseFloat(
          (reservedPriceForApartment * customDiscountPercentage).toFixed(2)
        );

        console.log(baseDiscountedPrice);
        const securityDepositDiscountedPrice =
          securityDeposits * customDiscountPercentage;

        console.log(securityDepositDiscountedPrice);
        const totalDiscountedPrice =
          baseDiscountedPrice + securityDepositDiscountedPrice;
        console.log(totalDiscountedPrice);
        const discountedPrice =
          reservedPriceForApartment + securityDeposits - baseDiscountedPrice;
        console.log(discountedPrice);

        if (customDiscountPercentage > 0) {
          const formattedDiscount = (customDiscountPercentage * 100).toFixed(0); // Format discount percentage
          setAppliedDiscount(
            `Custom discount applied (${formattedDiscount}% off)`
          );
          console.log(discountedPrice);
          setTotalCost(discountedPrice);
          return; // Exit early since custom discount is applied
        }
      }

      // Apply predefined discounts if custom discount is not applied
      if (bookingCount < 3 && discount.includes("20% New listing promotion")) {
        setAppliedDiscount("20% New listing promotion (20% off)");
        const discountedPrice =
          reservedPriceForApartment * 0.8 + securityDeposits;
        setTotalCost(discountedPrice);
      } else if (nights >= 28 && discount.includes("10% Monthly discount")) {
        setAppliedDiscount("10% Monthly discount (10% off)");
        const discountedPrice =
          reservedPriceForApartment * 0.9 + securityDeposits;
        console.log(discountedPrice);
        setTotalCost(discountedPrice);
      } else if (nights >= 7 && discount.includes("5% Weekly discount")) {
        setAppliedDiscount("5% Weekly discount (5% off)");
        const discountedPrice =
          reservedPriceForApartment * 0.95 + securityDeposits;
        setTotalCost(discountedPrice);
      } else {
        setAppliedDiscount("");
        setTotalCost(TotalPrice);
      }
    } else {
      // Set a default value when dates are not selected
      setTotalPrice(null);
    }
  };

  const handleDisableBookButton = (nights) => {
    if (nights < min_nights && min_nights != null) {
      setIsDisabled(true);
      setModalMessage(`Minimum stay is ${min_nights} nights`);
      setIsModalVisibles(true); // Show the modal
    } else if (nights > max_nights && max_nights != null) {
      setIsDisabled(true);
      setModalMessage(`Maximum stay is ${max_nights} nights`);
      setIsModalVisibles(true); // Show the modal
    } else {
      setIsDisabled(false); // Enable the book button
      setModalMessage(null); // Clear the modal message
      setIsModalVisibles(false); // Hide the modal
    }
  };

  // Call this function whenever the number of nights changes
  useEffect(() => {
    if (numberOfNights !== null) {
      handleDisableBookButton(numberOfNights);
    }
  }, [numberOfNights]);

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const calculateNumberOfNights = () => {
    if (checkInDate instanceof Date && checkOutDate instanceof Date) {
      return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    }
    return 1; // Default to 1 night if dates are not selected
  };
  let pricePerNight = Number(price).toLocaleString();

  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalVisibles(false);
  };

  // Function to calculate the maximum allowed date based on the availability window
  const calculateMaxDate = (availabilityWindow) => {
    switch (availabilityWindow) {
      case "3 months in advance":
        return addMonths(new Date(), 3);
      case "6 months in advance":
        return addMonths(new Date(), 6);
      case "9 months in advance":
        return addMonths(new Date(), 9);
      case "12 months in advance":
        return addMonths(new Date(), 12);
      case "24 months in advance":
        return addMonths(new Date(), 24);
      default:
        return new Date(3000, 0, 1); // Default to a date far in the future
    }
  };

  // Calculate the max date based on the availability window
  const maxDate = calculateMaxDate(availability_window);

  console.log(reservation);
  console.log(bookedDates);
  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) =>
        date >= new Date(bookedDate.checkInDate) &&
        date <= new Date(bookedDate.checkOutDate)
    );
  };

  const isCheckoutDisabled = () => {
    if (!checkInDate || !checkOutDate) {
      return true;
    }

    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);

    // Check if any date between start and end date is booked
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      if (isDateBooked(d)) {
        return true;
      }
    }

    return false;
  };

  console.log(blockedDates);

  // Check if a date is blocked
  const isDateBlocked = (date) => {
    return blockedDates.some(
      (blockedDate) =>
        date >= new Date(blockedDate.startDate) &&
        date <= new Date(blockedDate.endDate)
    );
  };

  // Check if the checkout button should be disabled
  const isCheckoutBlocked = () => {
    if (!checkInDate || !checkOutDate) {
      return true; // If check-in or check-out date is not selected, disable checkout
    }

    const selectedStartDate = new Date(checkInDate);
    const selectedEndDate = new Date(checkOutDate);

    if (selectedStartDate >= selectedEndDate) {
      return true; // Check-out date must be after check-in date
    }

    // Check if any date between check-in and check-out is blocked
    for (
      let date = new Date(selectedStartDate);
      date <= selectedEndDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (isDateBlocked(date)) {
        return true; // If any date is blocked, disable checkout
      }
    }
    console.log("Blocked dates:", blockedDates);

    return false; // Enable checkout if no dates are blocked
  };

  console.log(token);
  useEffect(() => {
    const fetchListingDetails = async () => {
      let response;
      try {
        if (token) {
          response = await Axios.get(`showGuestHomeForAuthUser/${id}`);
        } else {
          response = await Axios.get(`showGuestHomeForUnAuthUser/${id}`);
        }
        setHostId(response.data.data.user.id);
      } catch (error) {
        console.error(
          `Error fetching listing details${
            token ? " for authenticated" : " for unauthenticated"
          } user:`,
          error
        );
      }
    };

    if (token) {
      fetchListingDetails();
      fetchCoHostData();
    }
  }, [id, token]);

  const sendMessage = async () => {
    try {
      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        navigate("/login");
        return;
      }

      console.log("HostId:", hostId);
      console.log("HostHomeId:", id);

      await Axios.post(`/makeRequestToBook/${hostId}/${id}`);
      setMessageSent(true);
      message.success("Inquiry sent successfully");
      setMessageModalVisible(false);

      form.resetFields();
    } catch (error) {
      message.error("Failed to send message " + error.response.data.error);
      console.error(error);
    }
  };
  const isBlockedDatesBetweenCheckInOut = () => {
    if (!checkInDate || !checkOutDate) {
      return false;
    }

    const isBlocked = blockedDates.some(({ startDate, endDate }) => {
      return startDate >= checkInDate && endDate <= checkOutDate;
    });

    return isBlocked;
  };

  const sendMessageToHost = async (receiverId) => {
    try {
      // Log the message before sending
      console.log("Sending message:", message);

      // Send the message to the API
      const response = await Axios.post(`/chat/${receiverId}`, {
        message: messages,
      });

      // Set messageSent to true to indicate that the message was sent successfully
      setMessageSent(true);
      console.log("Message sent successfully");
      showMessage.success("Message sent successfully");

      // Handle the response as needed
    } catch (error) {
      console.error("Error sending message to host:", error);
      // Handle errors
    }
  };


  const hostIDs = parseInt(localStorage.getItem("receiverid"), 10);
  const coHostIdInt = parseInt(coHostId, 10);

  console.log("cohostID:", coHostIdInt);
  console.log("userID:", hostIDs);

  const fetchCoHostData = async () => {
    try {
      const response = await Axios.get(`user`);
      const coHostData = response.data;
      setCoHostNotAllowed(coHostData.co_host);
    } catch (error) {
      console.error("Error fetching co-host data:", error);
    }
  };
  
  const isCoHostNotAllowed = () => {
    return coHostNotAllowed === 1;
  };

  useEffect(() => {
    if (isCoHostNotAllowed() && !coHostMessageShown) {
      message.error("Co-hosts aren't allowed to book apartments");
      setCoHostMessageShown(true);
    }
  }, [coHostNotAllowed]);
  
  
  

  const isLoggedIn = () => {
    const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
    return !!token; // Convert to boolean
  };

  return (
    <div className=" block w-full h-full">
      <div
        className="block mt-12 mb-12 md:sticky z-[100]  top-[80px] box-border  
         w-full max-w-sm rounded-xl bg-white md:p-6 
        md:shadow-xl md:ring-1 md:ring-slate-200"
      >
        <div className=" p-3 rounded relative box-border">
          <div className=" justify-between items-center flex text-sm">
            <div className=" gap-2 items-end flex box-border">
              <div className=" flex-col flex box-border">
                <div className=" gap-2 justify-start flex-wrap flex-row items-center flex">
                  <div>
                    <span aria-hidden="true">
                      <div className="font-medium text-xl box-border">
                        {price === null || totalPrice === 0 ? (
                          <PriceSkeleton />
                        ) : (
                          `₦${Number(price).toLocaleString()}`
                        )}
                      </div>
                    </span>
                  </div>

                  <div className="font-normal text-start text-xs">
                    {checkInDate && checkOutDate
                      ? `for ${calculateNumberOfNights()} ${
                          calculateNumberOfNights() > 1 ? "nights" : "night"
                        }`
                      : "per night"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <form>
            <div className="grid grid-cols-2 gap-4 p-2">
              <div className="border border-gray-300 p-2 rounded-lg shadow-sm relative">
                <DatePicker
                  selected={checkInDate}
                  onChange={(date) => handleCheckIn(date)}
                  placeholderText="Check in"
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  maxDate={maxDate}
                  excludeDates={bookedDates
                    .flatMap(({ checkInDate, checkOutDate }) =>
                      Array.from(
                        {
                          length:
                            (checkOutDate - checkInDate) /
                              (1000 * 60 * 60 * 24) +
                            1,
                        },
                        (_, i) => addDays(checkInDate, i)
                      )
                    )
                    .concat(
                      blockedDates.flatMap(({ startDate, endDate }) =>
                        Array.from(
                          {
                            length:
                              (endDate - startDate) / (1000 * 60 * 60 * 24) + 1,
                          },
                          (_, i) => addDays(startDate, i)
                        )
                      )
                    )}
                />

                <img
                  src={DateIcon}
                  className="w-4 absolute transform-[translateY(-50%)]"
                  alt="Check In"
                />
              </div>

              <div className="border border-gray-300 p-2 rounded-lg shadow-sm">
                <DatePicker
                  selected={checkOutDate}
                  onChange={(date) => handleCheckOut(date)}
                  placeholderText="Check out"
                  dateFormat="dd/MM/yyyy"
                  minDate={checkInDate ? addDays(checkInDate, 1) : new Date()} // Use checkInDate as the minimum date
                  maxDate={maxDate}
                  excludeDates={bookedDates
                    .flatMap(({ checkInDate, checkOutDate }) =>
                      Array.from(
                        {
                          length:
                            (checkOutDate - checkInDate) /
                              (1000 * 60 * 60 * 24) +
                            1,
                        },
                        (_, i) => addDays(checkInDate, i)
                      )
                    )
                    .concat(
                      blockedDates.flatMap(({ startDate, endDate }) =>
                        Array.from(
                          {
                            length:
                              (endDate - startDate) / (1000 * 60 * 60 * 24) + 1,
                          },
                          (_, i) => addDays(startDate, i)
                        )
                      )
                    )}
                />

                <img src={DateIcon} className="w-4" alt="Check out" />
              </div>
            </div>

            {/* <!--Traveler input--> */}

            <div className=" relative box-border p-2  ">
              <div className=" overflow-hidden relative border rounded-lg min-h-[50px] block box-border ">
                {/* <label className=" text-xs font-normal px-4  overflow-hidden absolute text-ellipsis whitespace-nowrap  ">
                  Travelers
                </label> */}
                {/* <input className=' border rounded text-base font-normal '/> */}
                <MyDropdown
                  adults={adults}
                  pets={pets}
                  messageModalVisible={messageModalVisible}
                  setAdults={setAdults}
                  setPets={setPets}
                  maxValue={guest} // Pass the guest value from the props as maxValue
                />

                {/* <ListingFormModal isModalVisible={isModalVisible} handleCancel={handleCancel} />
                 */}
              </div>
            </div>

            {/* <!--total before and after tax--> */}
            <div className=" min-h-[1.5rem] w-full   p-3">
              <div className=" border-t py-4 flex flex-col gap-1">
                {appliedDiscount && (
                  <div className=" text-sm text-gray-500 italic">
                    <div className="mb-2 box-border block">
                      <div className="flex justify-between items-end break-words">
                        <span>Discount Applied:</span>
                        <span>{appliedDiscount}</span>
                      </div>
                    </div>
                  </div>
                )}
                {checkInDate && checkOutDate && (
                  <div className=" font-medium text-base box-border flex items-end justify-between break-words    ">
                    <span> Total before </span>
                    <div className=" whitespace-nowrap break-normal ">
                      ₦ {Number(totalCost).toLocaleString()}
                    </div>
                  </div>
                )}

                {checkInDate && checkOutDate && (
                  <div className=" font-normal text-sm box-border flex items-end justify-between break-words    ">
                    <span> see full price</span>
                    <button
                      type="button"
                      className=" whitespace-nowrap break-normal underline text-blue-500 cursor-pointer "
                      onClick={showModal}
                    >
                      price details
                    </button>
                  </div>
                )}

                {/* handles the modal  when price details is clicked  */}
                <Popup
                  isModalVisible={isModalVisible}
                  handleCancel={handleCancel}
                  title={"Price details"}
                >
                  <div className="p-3 pt-6 border-y   h-[59vh] overflow-auto example">
                    <div>
                      <div className=" pb-4 md:pb-0 ">
                        <div className=" ">
                          <div className="relative">
                            {/* 1 */}
                            <div className=" pb-4 border-b">
                              <div className=" mb-2 box-border block">
                                <div className=" flex items-end justify-between break-words    ">
                                  <div className=" block box-border">
                                    <span>
                                      {pricePerNight} x{" "}
                                      {checkInDate && checkOutDate
                                        ? `for ${calculateNumberOfNights()} ${
                                            calculateNumberOfNights() > 1
                                              ? "nights"
                                              : "night"
                                          }`
                                        : "per night"}
                                    </span>{" "}
                                  </div>

                                  <div className=" ml-4 whitespace-nowrap block box-border">
                                    {totalPrice !== null
                                      ? `₦${Number(
                                          totalPrice
                                        ).toLocaleString()}`
                                      : `₦${pricePerNight}`}
                                  </div>
                                </div>
                              </div>

                              <div className=" mb-2 box-border block">
                                <div className=" relative box-border ">
                                  <div className=" overflow-hidden max-h-24 relative   ">
                                    <div className=" ">
                                      <div className=" mb-2 flex justify-between items-end break-words  ">
                                        <span className=" capitalize">
                                          Security Deposit (Refundable)
                                        </span>

                                        <div className=" ml-4 ">
                                          ₦{" "}
                                          {Number(
                                            securityDeposit
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h2 className="text-lg font-semibold mb-2">
                                  Reserved Dates and Prices
                                </h2>
                                {matchedReservedPrices.length > 0 && (
                                  <ul className="divide-y divide-gray-200">
                                    {matchedReservedPrices.map(
                                      (reservation, index) => (
                                        <li key={index} className="py-2 ">
                                          <div className="flex text-sm justify-between "></div>
                                          <div className="flex text-sm justify-between ">
                                            <p className="">
                                              Reserved Date:{" "}
                                              {new Date(
                                                reservation.date
                                              ).toLocaleDateString()}
                                            </p>
                                            <p className="">
                                              Reserved Days:{" "}
                                              {reservation.reservedDays}
                                            </p>
                                          </div>
                                          <p className="">
                                            ₦{reservation.price}
                                          </p>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                )}
                              </div>

                              {weekend && !isNaN(Number(weekend)) && (
                                <div className=" mb-2 box-border block">
                                  <div className=" flex items-end justify-between break-words    ">
                                    <div className=" block box-border">
                                      <span>Weekend Price</span>
                                    </div>
                                    <div className=" ml-4 whitespace-nowrap block box-border   ">
                                      ₦ {Number(weekend).toLocaleString()} (
                                      {calculateWeekendNights(
                                        checkInDate,
                                        checkOutDate
                                      )}{" "}
                                      nights)
                                    </div>
                                  </div>
                                </div>
                              )}

                              {appliedDiscount && (
                                <div className="">
                                  <div className="mb-2 box-border block">
                                    <div className="flex justify-between items-end break-words">
                                      <span>Discount Applied:</span>
                                      <span>{appliedDiscount}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* <div className=" mb-2t box-border block">
                                <div className=" flex items-end justify-between break-words    ">
                                  <div className=" block box-border">
                                    <span>Service Fee</span>
                                  </div>
                                  <div className=" ml-4 whitespace-nowrap block box-border   ">
                                    ₦ {Number(serviceFees).toLocaleString()}
                                  </div>
                                </div>
                              </div> */}
                              {/* <div className=" mb-2 box-border block">
                                <div className=" flex items-end justify-between break-words    ">
                                  <div className=" block box-border">
                                    <span>Tax</span>
                                  </div>
                                  <div className=" ml-4 whitespace-nowrap block box-border   ">
                                    ₦ {Number(taxFees).toLocaleString()}
                                  </div>
                                </div>
                              </div> */}
                            </div>
                            {/* Total */}
                            <div className="  py-4">
                              <div className=" font-bold text-lg flex items-end justify-between break-words    ">
                                <span> Total </span>
                                <div className=" whitespace-nowrap break-normal ">
                                  ₦ {Number(totalCost).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link to={verified !== null ? "/" : undefined}>
                      <button
                        type="button"
                        className="block w-full h-11 rounded bg-orange-500 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal 
        text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
        focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
        dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
        dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2)
        ,0_4px_18px_0_rgba(59,113,202,0.1)]]"
                        onClick={(event) => {
                          event.preventDefault();
                          if (isAuthenticated) {
                            if (verified == null) {
                              setShowVerifyModal(true);
                            } else {
                              // Disable the button to prevent multiple submissions
                              setIsBookButtonDisabled(true);

                              // Call sendMessage function
                              // sendMessage();
                            }
                          } else {
                            // Redirect to login page if not authenticated
                            navigate("/login");
                          }

                          if (buttonTexts === "Request Book") {
                            sendMessage();
                          } else if (buttonTexts === "Book") {
                            navigate("/RequestBook");

                          }
                        }}
                        disabled={
                          (checkInDate &&
                            checkOutDate &&
                            isCoHostNotAllowed()) ||
                          isBookButtonDisabled ||
                          !checkInDate ||
                          !checkOutDate ||
                          isDisabled ||
                          isCheckoutDisabled() ||
                          isCheckoutBlocked() ||
                          isBlockedDatesBetweenCheckInOut()
                        }
                      >
                        {buttonTexts}
                      </button>
                    </Link>
                  </div>
                </Popup>
              </div>
            </div>

            {/* <!--Submit button--> */}
            <div className="p-2">
              {showMessageHostButton && (
                <Link to={verified !== null ? "/RequestBook" : undefined}>
                  <button
                    type="button"
                    className="block w-full h-11 mt-3 rounded bg-orange-500 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal 
      text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
      focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
      focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
      dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
      dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2)
      ,0_4px_18px_0_rgba(59,113,202,0.1)]"
                    onClick={(event) => {
                      event.preventDefault();
                      if (isAuthenticated) {
                        if (verified == null) {
                          setShowVerifyModal(true);
                        } else {
                          navigate("/RequestBook");
                        }
                      } else {
                        // Redirect to login page if not authenticated
                        navigate("/login");
                      }
                    }}
                    disabled={
                      isBookButtonDisabled ||
                      isCoHostNotAllowed() ||
                      !checkInDate ||
                      !checkOutDate ||
                      isDisabled ||
                      isCheckoutDisabled() ||
                      isCheckoutBlocked() ||
                      isBlockedDatesBetweenCheckInOut() ||
                      (checkInDate && checkOutDate && isCoHostNotAllowed())
                    }
                  >
                    Book
                  </button>
                </Link>
              )}
              <button
                disabled={isCoHostNotAllowed()}
                type="button"
                // onClick={showMessageModal}
                className="block w-full h-11 mt-3 rounded bg-orange-500 px-6 pb-2 pt-2.5 text-sm font-medium uppercase leading-normal 
                            text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]
                            focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                            focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] 
                            dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] 
                            dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2)
                            ,0_4px_18px_0_rgba(59,113,202,0.1)]"
                onClick={() => {
                  if (!token) {
                    navigate("/login"); // Redirect to login page if no token
                    return;
                  }
                  if (buttonText === "Request Book") {
                    sendMessage();
                  } else if (buttonText === "Message Host") {
                    setMessageModalVisible(true);

                    sendMessageToHost(receiverId, message);
                  }
                }}
              >
                {buttonText}
              </button>
            </div>
          </form>
        </div>
        <StayLengthModal
          message={modalMessage}
          visible={isModalVisibles}
          onClose={handleModalCancel}
        />{" "}
        {/* Render the modal */}
        {showVerifyModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded">
              <h2 className="text-lg font-bold mb-2">Verification Required</h2>
              <p className="text-sm mb-4">
                Please verify your account before booking.
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => setShowVerifyModal(false)}
                  className="bg-orange-400 text-white px-4 py-2 rounded mr-2"
                >
                  OK
                </button>
                <Link to="/profile">
                  <button
                    onClick={() => {
                      // Add logic to navigate to settings page
                    }}
                    className="bg-orange-400 text-white px-4 py-2 rounded"
                  >
                    Go to Settings
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className=" font-normal text-sm box-border flex items-end justify-center break-words pt-3  pl-3    ">
          {/* <span> see full price</span> */}
          <button
            type="button"
            className=" whitespace-nowrap break-normal underline flex gap-1  items-center  cursor-pointer "
            onClick={() => setIsReportModalVisible(true)}
          >
            <FlagOutlined className="" />
            <span> report a problem with this listing</span>
          </button>
        </div>
        <Popup
          isModalVisible={isReportModalVisible}
          handleCancel={() => setIsReportModalVisible(false)}
          centered={true}
          // width={"600px"}
        >
          <ReportListing id={id} />
        </Popup>
        {/* <CustomModal isOpen={isReportModalVisible} onClose={()=>setIsReportModalVisible(false)}   >
          <ReportListing/>
          </CustomModal> */}
      </div>

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
            onClick={() => sendMessageToHost(receiverId, message)}
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
                    sendMessageToHost(receiverId);
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
  );
}

function MyDropdown({ adults, pets, setAdults, setPets, maxValue }) {
  const [adultCount, setAdultCount] = useState(adults);
  const [petCount, setPetCount] = useState(pets);
  const [visible, setVisible] = useState(false);

  const handleDecrease = (setter, value) => {
    if (value > 1) {
      setter(value - 1);
    }
  };
  const handleIncrease = (setter, value) => {
    if (value < maxValue) {
      // Check against the maxValue
      setter(value + 1);
    }
  };

  const handleSubmit = () => {
    setVisible(!visible);
    // Update the adults and pets counts in the parent component
    setAdults(adultCount);
    setPets(petCount);
  };

  const items = [
    <div
      key={1}
      className="flex md:p-8 p-4 gap-2  lg:w-[420px] flex-col space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex-col">
          <span className="text-lg">Guests:</span> <br />
          <p className="text-gray-400">Ages 13 or above</p>
        </div>
        <div className="space-x-2">
          <Button
            shape="circle"
            onClick={() => handleDecrease(setAdultCount, adultCount)}
          >
            -
          </Button>
          <span>{adultCount}</span>
          <Button
            shape="circle"
            onClick={() => handleIncrease(setAdultCount, adultCount)}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-col">
          <span className="text-lg">Pets:</span>
          <p>
            <Link className="text-gray-400 underline">
              Bringing a service animal?
            </Link>
          </p>
        </div>
        <div className="space-x-2">
          <Button
            shape="circle"
            onClick={() => handleDecrease(setPetCount, petCount)}
          >
            -
          </Button>
          <span>{petCount}</span>
          <Button
            shape="circle"
            onClick={() => handleIncrease(setPetCount, petCount)}
          >
            +
          </Button>
        </div>
      </div>
    </div>,
  ];

  return (
    <Dropdown
      trigger={["click"]}
      onOpenChange={handleSubmit}
      open={visible}
      dropdownRender={(menu) => (
        <div className=" bg-white">
          <Space className="p-2 flex-col w-full shadow-md">
            {items}
            <Button
              className="bg-orange-700"
              type="primary"
              onClick={handleSubmit}
            >
              {" "}
              Done
            </Button>
          </Space>
        </div>
      )}
    >
      <Space className="w-full">
        <button
          type="button"
          className="block m-2 ml-3 cursor-pointer overflow-hidden text-ellipsis text-start whitespace-nowrap text-base font-normal w-full min-w-full"
        >
          <span className="block">Guests</span>
          <span className="text-gray-500">
            {adultCount > 1 ? `${adultCount} guests` : `${adultCount} guest`}{" "}
            {petCount !== 0 &&
              (petCount > 1 ? `, ${petCount} pets` : `, ${petCount} pet`)}
          </span>
        </button>
      </Space>
    </Dropdown>
  );
}
