import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import GoBackButton from "./GoBackButton";
import { FlagFilled } from "@ant-design/icons";
import Popup from "../hoc/Popup";
import ReportUser from "./ReportUser";
import Axios from "../Axios";
import Header from "./Navigation/Header";
import BottomNavigation from "./Navigation/BottomNavigation";
import UserDetailsSkeleton from "../SkeletonLoader/UserDetailsSkeleton";
import { StarFilled } from "@ant-design/icons";
import logoImage from "../assets/shbro logo.png";

const UserDetails = () => {
  const [showReviews, setShowReviews] = useState(false);
  const [showAllHouses, setShowAllHouses] = useState(false);
  const [housesPerPage, setHousesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Axios.get(`/hostReview/${id}`);
        setUserData(response.data.data);
        console.log(response.data.data);
      } catch (error) { 
        console.error("Error fetching user details:", error);
        // Handle error, show error message, etc.
      }
    };

    fetchUserData();
  }, [id]);

  if (!userData) {
    return <UserDetailsSkeleton />;
  }

  const getStarRating = (rating) => {
    const totalStars = 5;
    const filledStars = rating;
    const emptyStars = totalStars - filledStars;
    const stars = [];

    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      stars.push(<StarFilled key={i} style={{ color: "gold" }} />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarFilled key={filledStars + i} style={{ color: "gray" }} />
      );
    }

    return stars;
  };

  return (
    <div>
      <Header />
      <BottomNavigation />
      <div className="bg-white pb-32 md:w-[80vw] md:mx-auto md:my-20 rounded-lg p-6">
        <GoBackButton />
        <div className="flex flex-wrap  items-center space-x-3 relative">
          <div>
            <img
              src={userData.profilePicture || logoImage}
              className="w-40 rounded-full h-40 object-cover"
              alt=""
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {userData.name}'s Details
            </h2>
            <p className="text-gray-600">Reviews: {userData.reviews}</p>
            <p className="text-gray-600">
              Rating: {getStarRating(userData.rating)}
            </p>
            {/* <p className="text-gray-600">
              Houses Listed: {userData.totalHomes}
            </p>
            <p className="text-gray-600">
              Years Hosting: {userData.yearsOfHosting}
            </p> */}
          </div>
        </div>
        <div className="mt-4">
  <h3 className="text-xl font-semibold">About {userData.name}</h3>
  {userData.aboutUser.length > 0 ? (
    <>
      <p className="text-gray-700 mb-2">
        <strong>My work:</strong> {userData.aboutUser[0].work}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Speaks:</strong> {userData.aboutUser[0].speaks}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Lives in:</strong> {userData.aboutUser[0].lives_in}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Occupation:</strong> {userData.aboutUser[0].occupation}
      </p>
      <p className="text-gray-700">
        {userData.aboutUser[0].work.includes("24/7") ? (
          <span>
            {userData.aboutUser[0].work}{" "}
            <strong>{userData.aboutUser[0].occupation.toLowerCase()}</strong>.
          </span>
        ) : (
          <span>{userData.aboutUser[0].work}</span>
        )}
      </p>
    </>
  ) : (
    <div className="my-10 px-5">
      <p className="text-gray-700">No description</p>
    </div>
  )}
</div>



        <button
          onClick={() => setShowReviews(!showReviews)}
          className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600"
        >
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>

        {showReviews && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">
              Reviews by {userData.name}
            </h3>
            <ul className="list-disc list-inside flex space-x-6 whitespace-nowrap overflow-scroll w-full example">
              {userData.actualReviews.length === 0 ? (
                <p className="text-gray-600 mt-4">No reviews available</p>
              ) : (
                <ul className="list-disc list-inside flex space-x-6 whitespace-nowrap overflow-scroll w-full example">
                  {userData.actualReviews.map((review, index) => {
                    const date = new Date(review.created_at);
                    const formattedDate = `${date.toLocaleDateString("en-US", {
                      weekday: "long",
                    })}, ${date.toLocaleDateString("en-US", {
                      month: "long",
                    })} ${date.getDate()}, ${date.getFullYear()}`;

                    return (
                      <div
                        key={index}
                        className="mt-4 bg-white w-72 rounded-lg  overflow-hidden"
                      >
                        <img
                          src={review.photo_url}
                          alt=""
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-xl font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis">
                            {review.title}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            Rating: {review.ratings}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Comment: {review.comment}
                          </p>
                          <p className="text-gray-600">Date: {formattedDate}</p>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              )}
            </ul>
          </div>
        )}

        {userData.Status === "Host" && (
          <>
            {userData.hosthomeDetails.length > 0 ? (
              <>
                <h3 className="text-xl font-semibold mt-4">
                  Houses {userData.name} has hosted
                </h3>
                <div
                  className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
                    showAllHouses ? "w-full" : "w-fit"
                  }`}
                >
                  {userData.hosthomeDetails.map((apartment, index) => (
                    <Link
                      to={`/ListingInfoMain/${apartment.hosthome_id}`}
                      key={index}
                    >
                      <div className="mt-2 p-4 bg-white ">
                        <img
                          src={apartment.photo_image}
                          className="h-32 w-full object-cover rounded-t-lg"
                          alt={apartment.hosthome_title}
                        />
                        <p className="text-center text-gray-800 mt-2 font-semibold">
                          {apartment.hosthome_title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <p>No houses hosted by {userData.name}</p>
            )}
          </>
        )}

{userData.Status === "Guest" && (
  <>
    {userData.bookedhosthomeDetails.length > 0 ? (
      <>
        <h3 className="text-xl font-semibold mt-4">
          Houses {userData.name} has stayed in
        </h3>
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
            showAllHouses ? "w-full" : "w-fit"
          }`}
        >
          {userData.bookedhosthomeDetails.map((apartment, index) => (
            <Link
              to={`/ListingInfoMain/${apartment.hosthome_id}`}
              key={index}
            >
              <div className="mt-2 p-4 bg-white ">
                <img
                  src={apartment.photo_image}
                  className="h-32 w-full object-cover rounded-t-lg"
                  alt={apartment.hosthome_title}
                />
                <p className="text-center text-gray-800 mt-2 font-semibold">
                  {apartment.hosthome_title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </>
    ) : (
      <p>No houses stayed in by {userData.name}</p>
    )}
  </>
)}


{userData.Status === "Host And Guest" && (
  <>
    {userData.hosthomeDetails.length > 0 ? (
      <>
        <h3 className="text-xl font-semibold mt-4">
          Houses {userData.name} has hosted
        </h3>
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
            showAllHouses ? "w-full" : "w-fit"
          }`}
        >
          {userData.hosthomeDetails.map((apartment, index) => (
            <Link
              to={`/ListingInfoMain/${apartment.hosthome_id}`}
              key={index}
            >
              <div className="mt-2 p-4 bg-white ">
                <img
                  src={apartment.photo_image}
                  className="h-32 w-full object-cover rounded-t-lg"
                  alt={apartment.hosthome_title}
                />
                <p className="text-center text-gray-800 mt-2 font-semibold">
                  {apartment.hosthome_title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </>
    ) : (
      <p>No houses hosted by {userData.name}</p>
    )}

    {userData.bookedhosthomeDetails.length > 0 ? (
      <>
        <h3 className="text-xl font-semibold mt-4">
          Houses {userData.name} has stayed in
        </h3>
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
            showAllHouses ? "w-full" : "w-fit"
          }`}
        >
          {userData.bookedhosthomeDetails.map((apartment, index) => (
            <Link
              to={`/ListingInfoMain/${apartment.hosthome_id}`}
              key={index}
            >
              <div className="mt-2 p-4 bg-white ">
                <img
                  src={apartment.photo_image}
                  className="h-32 w-full object-cover rounded-t-lg"
                  alt={apartment.hosthome_title}
                />
                <p className="text-center text-gray-800 mt-2 font-semibold">
                  {apartment.hosthome_title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </>
    ) : (
      <p>No houses stayed in by {userData.name}</p>
    )}
  </>
)}


        {userData.totalPages > 1 && !showAllHouses && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600"
          >
            View More
          </button>
        )}

        {showAllHouses && userData.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            {[...Array(userData.totalPages)].map((_, page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`mx-1 py-2 px-4 rounded-full ${
                  page + 1 === currentPage
                    ? "bg-orange-400 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-orange-400 hover:text-white"
                }`}
              >
                {page + 1}
              </button>
            ))}
          </div>
        )}

        <div className=" font-normal text-sm box-border flex mt-8 mb-4  break-words      ">
          <button
            type="button"
            className=" whitespace-nowrap break-normal md:hover:font-medium transition    underline flex gap-1  items-center  cursor-pointer "
            onClick={() => setIsReportModalVisible(true)}
          >
            <FlagFilled className="  " />
            <span>Report this profile</span>
          </button>
        </div>

        <Popup
          isModalVisible={isReportModalVisible}
          handleCancel={() => setIsReportModalVisible(false)}
          centered={true}
        >
          <ReportUser />
        </Popup>
      </div>
    </div>
  );
};

export default UserDetails;
