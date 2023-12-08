import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Rating from "./Ratings";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Listings = () => {
  const [listings, setListings] = useState([
    {
      id: 1,
      pictures: [
        "https://a0.muscache.com/im/pictures/959f7a1d-6e52-4317-a2a5-4271b323e19c.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c089e5bd-89cd-4efc-bda5-0b6e36978e9c.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/766780af-d334-4b1a-9356-cda032db1f13.jpg?im_w=720",
      ],
      location: "1004 Victoria Island",
      price: "$150 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },
    {
      id: 2,
      pictures: [
        "https://a0.muscache.com/im/pictures/7ca6118f-68c7-4a32-8bbc-09ce1840a373.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c99e5b00-a779-40e9-bd0e-5062dfdb7eb8.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/f8099680-c563-4491-9258-f679eef415e9.jpg?im_w=720",
      ],
      location: "2b, Admiralty Road",
      price: "$120 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.2,
      link: "/ListingInfoMain",
    },
    {
      id: 3,
      pictures: [
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/2468fc87-15fe-40a7-97c8-8910ba6c3267.jpeg?im_w=720",
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/819c217b-c551-4de5-9a98-b4fedae488ba.jpeg?im_w=720",
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/9e70e7f0-57cf-43de-94a1-8383324687bf.jpeg?im_w=720",
      ],
      location: "Eva Pearl Lekki",
      price: "$200 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.0,
      link: "/ListingInfoMain",
    },

    {
      id: 4,
      pictures: [
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/2468fc87-15fe-40a7-97c8-8910ba6c3267.jpeg?im_w=720",
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/819c217b-c551-4de5-9a98-b4fedae488ba.jpeg?im_w=720",
        "https://a0.muscache.com/im/pictures/prohost-api/Hosting-816385654242432020/original/9e70e7f0-57cf-43de-94a1-8383324687bf.jpeg?im_w=720",
      ],
      location: "Mountain Retreat",
      price: "$200 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },
    {
      id: 5,
      pictures: [
        "https://a0.muscache.com/im/pictures/959f7a1d-6e52-4317-a2a5-4271b323e19c.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c089e5bd-89cd-4efc-bda5-0b6e36978e9c.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/766780af-d334-4b1a-9356-cda032db1f13.jpg?im_w=720",
      ],
      location: "1004 Victoria Island",
      price: "$150 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },
    {
      id: 6,
      pictures: [
        "https://a0.muscache.com/im/pictures/7ca6118f-68c7-4a32-8bbc-09ce1840a373.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c99e5b00-a779-40e9-bd0e-5062dfdb7eb8.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/f8099680-c563-4491-9258-f679eef415e9.jpg?im_w=720",
      ],
      location: "2b, Admiralty Road",
      price: "$120 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },

    {
      id: 7,
      pictures: [
        "https://a0.muscache.com/im/pictures/7ca6118f-68c7-4a32-8bbc-09ce1840a373.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c99e5b00-a779-40e9-bd0e-5062dfdb7eb8.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/f8099680-c563-4491-9258-f679eef415e9.jpg?im_w=720",
      ],
      location: "2b, Admiralty Road",
      price: "$120 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },

    {
      id: 8,
      pictures: [
        "https://a0.muscache.com/im/pictures/7ca6118f-68c7-4a32-8bbc-09ce1840a373.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/c99e5b00-a779-40e9-bd0e-5062dfdb7eb8.jpg?im_w=720",
        "https://a0.muscache.com/im/pictures/f8099680-c563-4491-9258-f679eef415e9.jpg?im_w=720",
      ],
      location: "2b, Admiralty Road",
      price: "$120 per night",
      date: "22/08/2023",
      kilometres: "22miles away",
      rating: 4.8,
      link: "/ListingInfoMain",
    },
  ]);

  const toggleFavorite = (id) => {
    setListings((prevListings) =>
      prevListings.map((listing) => {
        if (listing.id === id) {
          if (!listing.isFavorite) {
            // Show a toast notification when added to wishlist
            toast.success('Added to Wishlist', {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            // Show a toast notification when removed from wishlist
            toast.success('Removed from Wishlist', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
          return { ...listing, isFavorite: !listing.isFavorite };
        }
        return listing;
      })
    );
  };
  

  return (
   <div>
     <div className="flex flex-wrap justify-center mt-10 mb-32">
      {listings.map((listing) => (
        <div
          key={listing.id}
          className="max-w-[26rem] md:max-w-[18rem] rounded overflow-hidden  m-4 cursor-pointer"
        >
          <Carousel>
            {listing.pictures.map((picture, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleFavorite(listing.id)}
                  className={`flex items-center absolute outline-none bg-${
                    listing.isFavorite ? "yellow-400" : ""
                  } hover:bg-${
                    listing.isFavorite ? "yellow-500" : ""
                  } text-white font-bold py-2 px-4 rounded`}
                >
                  <div
                    className={`border border-gray-400 rounded-full p-1 ${
                      listing.isFavorite ? "bg-white" : ""
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 fill-current ${
                        listing.isFavorite ? "text-red-600" : "text-white"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 16.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C15.09 3.81 16.76 3 18.5 3 21.58 3 24 5.42 24 8.5c0 3.78-3.4 7.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                </button>
                <img src={picture} alt={`Apartment in ${listing.location}`} />
              </div>
            ))}
          </Carousel>
          <Link to={listing.link}>
            <div className=" py-4">
              <div className="font-medium text-base mb-2">
                {listing.location}
              </div>
              <Rating rating={listing.rating} />

              <p className="text-gray-400 text-base">{listing.kilometres}</p>

              <p className="text-gray-400 text-base">{listing.date}</p>
              <p className="font-medium text-gray-700 text-base">
                {listing.price}
              </p>
            </div>
          </Link>
          <ToastContainer />
        </div>
      ))} <br />
    </div>
<div className="flex justify-center mb-10">
<button className="py-2 px-4 bg-gray-800 block text-white rounded-full">Show more listings</button>

</div>
   </div>
  );
};

export default Listings;
