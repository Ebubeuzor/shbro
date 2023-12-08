import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoBackButton from "./GoBackButton";
import {FlagFilled,FlagOutlined} from '@ant-design/icons';
import Popup from "../hoc/Popup";
import ReportUser from "./ReportUser";

const UserDetails = () => {
  const [showReviews, setShowReviews] = useState(false);
  const [showAllHouses, setShowAllHouses] = useState(false);
  const [housesPerPage, setHousesPerPage] = useState(5); // Number of houses to display per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);


 
 const toggleShowReviews = () => {
    setShowReviews(!showReviews);
  };



  

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    review:"23",
    hosted:"12",
    yearsHosted:"2 ",
    image:
      "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",
    reviews: [
      {
        rating: 5,
        comment: "Great experience! Would definitely stay again.",
        propertyName: "Cozy Cottage",
        date: "2023-01-15",
        houseImage:
          "https://assets.newatlas.com/dims4/default/3d94d96/2147483647/strip/true/crop/4461x2974+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F38%2Fcc%2Fcb4aa02c4b0ab31f1e5a126d8c9b%2F01-5563-gawthorneshut-caarch-ambercreative.jpg", // Add house image URL
      },
      {
        rating: 4,
        comment: "Nice place, clean and comfortable. Nice place, clean and comfortableNice place, clean and comfortableNice place, clean and comfortable",
        propertyName: "Sunny Villa",
        date: "2023-02-10",
        houseImage:
          "https://assets.newatlas.com/dims4/default/3d94d96/2147483647/strip/true/crop/4461x2974+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F38%2Fcc%2Fcb4aa02c4b0ab31f1e5a126d8c9b%2F01-5563-gawthorneshut-caarch-ambercreative.jpg", // Add house image URL
      },
      {
        rating: 4,
        comment: "Nice place, clean and comfortable.",
        propertyName: "Sunny Villa",
        date: "2023-02-10",
        houseImage:
          "https://assets.newatlas.com/dims4/default/3d94d96/2147483647/strip/true/crop/4461x2974+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F38%2Fcc%2Fcb4aa02c4b0ab31f1e5a126d8c9b%2F01-5563-gawthorneshut-caarch-ambercreative.jpg", // Add house image URL
      },
      {
        rating: 4,
        comment: "Nice place, clean and comfortable.",
        propertyName: "Sunny Villa",
        date: "2023-02-10",
        houseImage:
          "https://assets.newatlas.com/dims4/default/3d94d96/2147483647/strip/true/crop/4461x2974+0+0/resize/1200x800!/quality/90/?url=http%3A%2F%2Fnewatlas-brightspot.s3.amazonaws.com%2F38%2Fcc%2Fcb4aa02c4b0ab31f1e5a126d8c9b%2F01-5563-gawthorneshut-caarch-ambercreative.jpg", // Add house image URL
      },
    ],
    houses: [
      {
        name: "Luxury Loft",
        image: "https://landwey.ng/wp-content/uploads/2021/03/WhatsApp-Image-2021-03-13-at-11.46.08-AM.jpeg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: " Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mounta",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain ",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "gh Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
      {
        name: "Mountain Cabin",
        image: "https://www.99acres.com/microsite/articles/files/2023/05/Different-types-of-houses-in-India.jpg", // Add house image URL
      },
    ],
  };

  const totalHouses = user.houses.length;
  const totalPages = Math.ceil(totalHouses / housesPerPage);

  // Function to get a slice of houses based on the current page
  const getHousesForPage = (page) => {
    const startIndex = (page - 1) * housesPerPage;
    const endIndex = startIndex + housesPerPage;
    return user.houses.slice(startIndex, endIndex);
  };

  const handleViewMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const host = {
    name: "Alice Smith",
    email: "alice.smith@example.com",
    phone: "+1 987-654-3210",
    image:
      "https://img.freepik.com/free-photo/handsome-cheerful-man-with-happy-smile_176420-18028.jpg",

    reviews: [
      {
        rating: 5,
        comment: "Alice is a fantastic host!",
        propertyName: "Ocean View Villa",
        date: "2023-03-20",
      },
      {
        rating: 4,
        comment: "Clean and cozy place. Highly recommended.",
        propertyName: "City Apartment",
        date: "2023-04-05",
      },
    ],
    houses: [
      {
        name: "Lakefront Retreat",
      },
      {
        name: "Downtown Studio",
      },
    ],
  };

  return (
    <div className="bg-white md:w-[80vw] md:mx-auto md:my-20 rounded-lg shadow-md p-6">
      <GoBackButton/>
      <div className="flex flex-wrap  items-center space-x-3 relative">
        <div>
          <img
            src={user.image}
            className="w-40 rounded-full h-40 object-cover"
            alt=""
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.name}'s Details</h2>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Reviews: {user.review}</p>
          <p className="text-gray-600">Houses Listed: {user.hosted}</p>
          <p className="text-gray-600">Years Hosting: {user.yearsHosted}</p>

        </div>

        
      </div>

      <button
        onClick={toggleShowReviews}
        className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600"
      >
        {showReviews ? "Hide Reviews" : "Show Reviews"}
      </button>

      {showReviews && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Reviews by {user.name}</h3>
          <ul className="list-disc list-inside flex space-x-6 whitespace-nowrap overflow-scroll w-full example">
            {user.reviews.map((review, index) => (
              <li key={index} className="mt-2 rounded-3xl mb-3 list-none shadow-lg bg-slate-100   p-4 ">
             <div className="flex items-center space-x-4 ">
             <div className="w-[120px]">
                  <img src={review.houseImage} className="w-32 h-32" alt="" />
                </div>
              <div className="w-[300px] whitespace-normal">
              <strong>Rating:</strong> {review.rating}
                <br />
                <strong>Comment:</strong> {review.comment}
                <br />
                <strong>Property:</strong> {review.propertyName}
                <br />
                <strong>Date:</strong> {review.date}
                <br />
              </div>
             </div>
              </li>
            ))}
          </ul>
        </div>
      )}

<h3 className="text-xl font-semibold mt-4">
  Houses {user.name} has hosted or stayed in
</h3>
<div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${showAllHouses ? 'w-full' : 'w-fit'}`}>
{getHousesForPage(currentPage).map((house, index) => (
  <Link to="/ListingInfoMain" key={index}> {/* Add the key prop here */}
    <div className="mt-2">
      <img src={house.image} className="w-32 h-32 object-cover" alt="" />
      <p className="text-center">{house.name}</p>
    </div>
  </Link>
))}

      </div>
      {totalPages > 1 && !showAllHouses && (
        <button
          onClick={handleViewMore}
          className="mt-4 bg-orange-400 text-white px-4 py-2 rounded-full hover:bg-orange-600"
        >
          View More
        </button>
      )}
      {showAllHouses && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          {[...Array(totalPages)].map((_, page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page + 1)}
              className={`mx-1 py-2 px-4 rounded-full ${page + 1 === currentPage ? 'bg-orange-400 text-white' : 'bg-gray-200 text-gray-600 hover:bg-orange-400 hover:text-white'}`}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}

        <div className=" font-normal text-sm box-border flex mt-8 mb-4  break-words      ">
                  {/* <span> see full price</span> */}
                  <button
                    type="button"
                    className=" whitespace-nowrap break-normal md:hover:font-medium transition    underline flex gap-1  items-center  cursor-pointer "
                    onClick={()=>setIsReportModalVisible(true)}
                  >
                 <FlagFilled className="  " />
                  <span>Report this profile</span>
                  </button>
                </div>


         <Popup
           isModalVisible={isReportModalVisible}
           handleCancel={()=>setIsReportModalVisible(false)}
           centered={true}  
          //  width={"450px"} 
             >

              <ReportUser/>
          
        </Popup>       


    </div>
  );
};

export default UserDetails;
