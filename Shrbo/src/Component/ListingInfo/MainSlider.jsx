import React, { useState, useRef, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import room from "../../assets/room.jpeg";
import { useParams } from "react-router-dom";

import kitchen from "../../assets/room2.jpeg";
import video from "../../assets/videos/luxuryInteriror.mp4";
import apartment from "../../assets/apartment2.jpeg";
import apartment1 from "../../assets/apartment1.jpeg";
import Modal from "react-modal";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import close from "../../assets/svg/close-line-icon 2.svg";
// import './MainSlider.css'; // Import your custom CSS file
import Axios from "../../Axios";
import { useStateContext } from "../../ContextProvider/ContextProvider";

const modalStyles = {
  overlay: {
    backgroundColor: "black",
    zIndex: 1000,
  },
  content: {
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: "none",
    background: "transparent",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    outline: "none",
    padding: "20px",
  },
  sliderWrapper: {
    borderRadius: "0px", // CSS properties should use colons instead of colons
  },
  modalContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "70%",
  },
  modalImageContainer: {
    // maxWidth: '80%', // Adjust the width as needed
    maxHeight: "70vh", // Adjust the height as needed
  },
};

const MainSlider = (props) => {
  const { id } = useParams(); // Get the ID parameter from the route

  const [listingDetails, setListingDetails] = useState(null);
  const { token } = useStateContext();
  console.log(token);
  useEffect(() => {
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
  }, [id, token]);
  

  const hosthomephotos = listingDetails?.hosthomephotos || [];
  const hosthomevideo = listingDetails?.hosthomevideo || null;

  const imageUrls = hosthomephotos.map((photo) => photo.images);

  const pics = [
    {
      id: "video",
      min: hosthomevideo, // Use hosthomevideo directly for the video
    },
    ...imageUrls.map((url, index) => ({
      id: index + 1,
      min: url,
    })),
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageModal = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const slides = pics.map((slide, index) => (
    <SplideSlide key={slide.id}>
      <div className="  h-full">
        <div className=" relative h-[308px]  ">
          <div className="h-full w-full rounded">
            {slide.id === "video" ? (
              <div className="w-full h-full md:mr-2 overflow-hidden">
                <div className="h-full   w-full cursor-pointer">
                  <div className="relative h-full">
                    {isPlaying ? (
                      <video
                        src={slide.min}
                        controls
                        ref={videoRef}
                        autoPlay
                        className="w-auto object-cover h-auto min-h-full min-w-full"
                      ></video>
                    ) : (
                      <div className="relative h-full">
                        <img
                          src={imageUrls[0]}
                          alt="Video Thumbnail"
                          onClick={togglePlay}
                          className="cursor-pointer w-auto object-cover h-auto min-h-full min-w-full"
                        />
                        <div
                          className="absolute bg-black bg-opacity-5 inset-0 flex items-center justify-center"
                          style={{ cursor: "pointer" }}
                          onClick={togglePlay}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="currentColor"
                            className="bi bi-play"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.667 8.196a.25.25 0 0 1 0 .608l-4 2.5a.25.25 0 0 1-.417-.192V5.896a.25.25 0 0 1 .417-.192l4 2.5z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <img
                onClick={() => openImageModal(slide.min, index)}
                src={
                  typeof slide.min === "object"
                    ? slide.min.url || slide.min.uri || slide.min.link || ""
                    : slide.min
                }
                alt={`slide ${index + 1}`}
                className="rounded h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </SplideSlide>
  ));

  return (
    <div className="w-full md:hidden ">
      <Splide
        ref={(slider) => (props.slider1.current = slider)}
        className="main-slider"
        options={{
          perPage: 1,
          perMove: 1,
          arrows: false,
          rewind: true,
          pagination: false,
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

      <Modal
        isOpen={selectedImage !== null}
        onRequestClose={closeImageModal}
        style={modalStyles}
        ariaHideApp={false}
      >
        <button className="close-button text-white" onClick={closeImageModal}>
          <img src={close} className="w-4" alt="" />
        </button>
        <div className="modal-content" style={modalStyles.modalContent}>
          {selectedImage && (
            <div style={modalStyles.modalImageContainer}>
              <Carousel
                showArrows={true}
                emulateTouch={true}
                selectedItem={selectedImageIndex}
              >
                {pics.map((pic, index) => (
                  <div key={pic.id}>
                    {pic.id !== "video" ? (
                      <img src={pic.min} alt={`Image ${index}`} />
                    ) : (
                      <video src={pic.min} alt="Video" controls playsInline />
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MainSlider;
