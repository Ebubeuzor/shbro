import React, {useState, useEffect} from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import room from "../../assets/room.jpeg";
import kitchen from "../../assets/room2.jpeg";
import video from "../../assets/videos/luxuryInteriror.mp4";
import Axios from "../../Axios";
import { useParams } from "react-router-dom";

const ThumbnailSlider = (props) => {
  const { id } = useParams(); // Get the ID parameter from the route

  const [listingDetails, setListingDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  
    const fetchListingDetails = async () => {
      let response;
      try {
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
        setListingDetails(response.data.data);
      } catch (error) {
        console.error("Error fetching listing details:", error);
      }
    };
  
    fetchListingDetails();
  }, [id]); // Include id if you want the data to be refetched when id changes
  

  
  const hosthomephotos = listingDetails?.hosthomephotos || [];

  const pics = [
    {
      id: "video",
      min: video,
    },
    ...hosthomephotos.map((photo, index) => ({
      id: index + 1,
      min: photo.images, // Access the 'images' property of the 'photo' object
    })),
  ];

  const slides = pics.map((slide) => (
    <SplideSlide key={slide.id}>
      <div className="  ">
        <div className=" relative       ">
          <div className=" h-[45px] w-full rounded  ">
            {slide.id === "video" ? (
              <div className="h-[45px]">
                  <video
                src={slide.min}
                alt="Video"
                className=" w-auto object-cover  h-auto min-h-full min-w-full"
                
              
                playsInline // Add playsInline attribute for iOS
              />

              </div>
            
            ) : (
              <img
                src={slide.min}
                alt="Thumbnail 1"
                className="rounded object-cover h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </SplideSlide>
  ));

  return (
    <div className="md:hidden visible w-full">
      <Splide
        ref={(slider) => (props.slider2.current = slider)}
        className="thumbnail-slider"
        options={{
          gap: 10,
          perMove: 1,
          cover: true,
          // fixedHeight: 50,
          fixedWidth: 66,
          isNavigation: true,
          pagination: false,
          rewind: true,
          mediaQuery: "min",
          breakpoints: {
            767: {
              destroy: true,
            },
          },
        }}
      >
        {slides}
      </Splide>
    </div>
  );
};

export default ThumbnailSlider;
