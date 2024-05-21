import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ListingPhotos from "../Component/ListingInfo/ListingPhotos";
import HostedBy from "../Component/ListingInfo/HostedBy";
import HostProfilePreview from "../Component/ListingInfo/HostProfilePreview";
import Amenities from "../Component/ListingInfo/Amenities";
import AboutProperty from "../Component/ListingInfo/AboutProperty";
import ListingMap from "../Component/ListingInfo/ListingMap";
import Testimonial from "../Component/ListingInfo/Testimonial";
import ListingForm from "../Component/ListingInfo/ListingForm";
import HouseRules from "../Component/ListingInfo/HouseRules";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import Header from "../Component/Navigation/Header";
import Axios from "../Axios";
import { Spin } from "antd";
import { useDateContext } from "../ContextProvider/BookingInfo";
import { useStateContext } from "../ContextProvider/ContextProvider";
const ListingInfoMain = () => {
  const { id } = useParams();
  
  const [listingDetails, setListingDetails] = useState(null);
  const [refreshed, setRefreshed] = useState(false);
  const [bookingRequestStatus, setBookingRequestStatus] = useState(null);
    const [coHost, setCoHost] = useState(null); // State for cohost

  const { token } = useStateContext();

  console.log(id);
  const {
    setTitle,
    setCancellationPolicy,
    setAddress,
    setPhoto,
    setApartment,
    setUser,
    setDiscounts,
  } = useDateContext();

  const [hostId, setHostId] = useState(null); // State for hostId
  const [vatFee, setVatFee] = useState(0);
  const [guestFeePrice, setGuestFeePrice] = useState(0);


  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  
    if (token) {
      const fetchUsers = async () => {
        try {
          const response = await Axios.get("/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.id);
          setHostId(response.data.id);
  
          console.log(response.data.id);
        } catch (error) {
          console.error("Error fetching users:", error);
          // Handle error, show error message, etc.
        }
      };
  
      fetchUsers();
    }
  }, []); // No dependencies, so it will run once when the component mounts
  

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        let response;
        if (token) {
          // If token exists, fetch details for authenticated user
          response = await Axios.get(`showGuestHomeForAuthUser/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // If token doesn't exist, fetch details for unauthenticated user
          response = await Axios.get(`showGuestHomeForUnAuthUser/${id}`);
        }
            const data = response.data.data;

        setListingDetails(response.data.data);
        setApartment(id);
        setUser(response.data.data.user.id);
        setHostId(response.data.data.user.id);
        setTitle(response.data.data.title);
        setAddress(response.data.data.address);
        setPhoto(response.data.data.hosthomephotos);
        setDiscounts(response.data.data.discounts);
        setBookingRequestStatus(response.data.data.bookingRequestStatus);
        setVatFee(response.data.data.vat)
        setGuestFeePrice(response.data.data.guest_fee)

        console.log(response.data.data);

                // Set the cohost value
if (data.cohosts && data.cohosts.length > 0) {
  const cohost = data.cohosts[0]; // Assuming there is only one cohost
  setCoHost({
    id: cohost.id,
    name: cohost.name,
    email: cohost.email,
    rating: cohost.rating,
    // Add other cohost properties as needed
  });

  console.log("Cohost:", cohost);
} else {
  setCoHost(null); // No cohost found
}
      } catch (error) {
        console.error(
          "Error fetching listing details:",
          error.response ? error.response.data : error.message
        );
        // Handle error, show error message, etc.
      }
    };
  
    fetchListingDetails();
  }, [id, token]); // Include token in dependency array
  
  const recordHostHomeView = async (hostHomeId, hostId) => {
    try {
      const response = await Axios.get(`/hostHomeView/${hostHomeId}/${hostId}`);
      console.log("Host home view recorded successfully:", response.data);
    } catch (error) {
      console.error("Error recording host home view:", error);
    }
  };

  console.log(hostId);

  useEffect(() => {
    if (hostId) {
      recordHostHomeView(id, hostId);
    }
  }, [hostId]);

  if (!listingDetails) {
    // Loading state or return null
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="">
      <Header />
      <div className=" px-6 md:px-10 xl:px-20 max-w-7xl  m-auto justify-center items-center flex flex-wrap flex-col gap-6 lg:gap-10 ">
        <ListingPhotos
          hosthomephotos={listingDetails.hosthomephotos}
          hosthomevideo={listingDetails.hosthomevideo}
          title={listingDetails.title}
          address={listingDetails.address}
          id={listingDetails.id}
        />

        <div className="w-full flex">
          <div className=" w-full md:w-[58.3333%] relative">
            <HostedBy
              property_type={listingDetails?.property_type}
              bathrooms={listingDetails?.bathrooms}
              beds={listingDetails?.beds}
              bedroom={listingDetails?.bedroom}
              cancelPolicy={listingDetails?.cancelPolicy}
              guest_choice={listingDetails?.guest_choice}
              guest={listingDetails?.guest}
              hostHomeDescriptions={listingDetails?.hosthomedescriptions} // Pass the array as a prop
            />{" "}
            <div className="  md:hidden relative mr-0 ">
              <ListingForm
                hosthomeId={id}
                hostIds={hostId}
                coHostId={coHost ? coHost.id : null} // Pass the cohost id as a prop
                userId={listingDetails?.user?.id || ""} // Pass the user id as a prop

                price={listingDetails?.price}
                reservations={listingDetails?.reservations}
                reservation={listingDetails?.reservation}
                guest={listingDetails?.guest}
                max_nights={listingDetails?.max_nights}
                min_nights={listingDetails?.min_nights}
                preparation_time={listingDetails?.preparation_time}
                availability_window={listingDetails?.availability_window}
                advance_notice={listingDetails?.advance_notice}
                hosthomecustomdiscounts={
                  listingDetails?.hosthomecustomdiscounts
                }
                reservedPricesForCertainDay={
                  listingDetails?.reservedPricesForCertainDay
                }
                weekend={listingDetails?.weekend}
                bookingRequestStatus={listingDetails?.bookingRequestStatus}
                vatFee={listingDetails?.vat}
                guestFee={listingDetails?.guest_fee}
              />
            </div>
            <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <HostProfilePreview
              userId={listingDetails?.user?.id || ""}
              userProfilePicture={listingDetails?.user?.profilePicture || ""}
              userRating={listingDetails?.user?.rating || 0}
              userReviews={listingDetails?.user?.reviews || 0}
              successfulCheckOut={listingDetails?.user?.successfulCheckOut || 0}
              totalHomes={listingDetails?.user?.totalHomes || 0}
              yearsOfHosting={listingDetails?.user?.yearsOfHosting || "N/A"}
              userName={listingDetails?.user?.name || ""}
            />
            <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <AboutProperty
              description={listingDetails?.description}
              address={listingDetails?.address}
            />
            <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
            <HouseRules
              checkin={listingDetails?.checkin}
              guest={listingDetails?.guest}
              cancelPolicy={listingDetails?.cancelPolicy}
              rules={listingDetails?.rules}
              // Add other relevant props here
            />
          </div>
          <div className=" md:ml-[8.33333%] md:w-[33.33333%] hidden md:block relative mr-0 ">
            <ListingForm
              id={id}
              hostIds={hostId}

              price={listingDetails?.price}
              coHostId={coHost ? coHost.id : null} // Pass the cohost id as a prop
              userId={listingDetails?.user?.id || ""} // Pass the user id as a prop

              reservations={listingDetails?.reservations}
              reservation={listingDetails?.reservation}
              guest={listingDetails?.guest}
              max_nights={listingDetails?.max_nights}
              min_nights={listingDetails?.min_nights}
              preparation_time={listingDetails?.preparation_time}
              availability_window={listingDetails?.availability_window}
              advance_notice={listingDetails?.advance_notice}
              hosthomecustomdiscounts={listingDetails?.hosthomecustomdiscounts}
              reservedPricesForCertainDay={
                listingDetails?.reservedPricesForCertainDay
              }
              weekend={listingDetails?.weekend}
              bookingRequestStatus={listingDetails?.bookingRequestStatus}
              vatFee={listingDetails?.vat}
              guestFeePrice={listingDetails?.guest_fee}
            />
          </div>
        </div>
        <Amenities amenities={listingDetails?.amenities} />
        <Testimonial reviews={listingDetails?.reviews} />
        <ListingMap />

        <BottomNavigation />
      </div>
    </div>
  );
};

export default ListingInfoMain;
