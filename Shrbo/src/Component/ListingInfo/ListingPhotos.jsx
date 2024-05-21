import React, { useEffect, useState, useRef } from "react";
import room from "../../assets/room.jpeg";
import apartment from "../../assets/apartment2.jpeg";
import apartment1 from "../../assets/apartment1.jpeg";
import { toast, ToastContainer } from "react-toastify";

import kitchen from "../../assets/room2.jpeg";
import video from "../../assets/videos/luxuryInteriror.mp4";
import SliderFull from "./SliderFull";
import Modal from "react-modal"; // Import the react-modal library
import { Carousel } from "react-responsive-carousel"; // Import Carousel from react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import Carousel styles
import close from "../../assets/svg/close-line-icon 2.svg";
import { useParams } from "react-router-dom";
import WishlistModal from "../../Views/WishListModal";
import Axios from "../../Axios";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import ShareModal from "../ShareModal";

const ListingPhotos = ({
  hosthomephotos,
  hosthomevideo,
  title,
  address,
  id,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [width, setWidth] = useState();
  const videoRef = useRef(null);
  const [wishlistContainer, setWishlistContainer] = useState([]);
  const [saveLabel, setSaveLabel] = useState("Save");
  const { token } = useStateContext();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [isWishlistModalVisible, setIsWishlistModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { listingId } = useParams();
  console.log(listingId);
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const token = localStorage.getItem('Shbro'); // Assuming token is stored in localStorage

    if (token) {
      Axios.get("/getUserWishlistContainers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setWishlistContainer(response.data.userWishlist);
          console.log("wishlist", response.data);
        })
        .catch((error) => {
          console.log("wishlist", error);
        });
    }
  }, [isModalOpen]); // Include isModalOpen if you want the data to be refetched when isModalOpen changes


  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  const imageUrls = hosthomephotos || []; // Use hosthomephotos prop or provide a default empty array

  const imageUrlss = imageUrls.map((photo) => photo.images);
  // console.log(imageUrlss);

  console.log(id);

  const handleSave = (container) => {
    if (saveLabel === "Saved") {
      Axios.delete(`/removeFromWishlist/${id}`)
        .then((response) => {
          setWishlistContainer(response.data.userWishlist);
          setSaveLabel("Save");
          toast.success("Removed from wishlist");
          Axios.get("/getUserWishlistContainers")
            .then((response) => {
              setWishlistContainer(response.data.userWishlist);
            })
            .catch((error) => {
              console.log("Error fetching wishlist containers:", error);
            });
        })
        .catch((error) => {
          console.log("Error removing item from wishlist:", error);
          toast.error("Failed to remove from wishlist");
        });
    } else {
      setIsImageModalVisible(false);
      setIsWishlistModalVisible(true);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('Shbro'); // Assuming token is stored in localStorage

    if (token) {
      // Fetch the user's wishlist containers and items
      Axios.get("/getUserWishlistContainersAndItems", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const wishlistContainers = response.data.userWishlist;
          // Check if the item exists in any of the wishlist containers
          const exists = wishlistContainers.some((container) =>
            container.items.some((item) => item.hosthomes.id === id)
          );
          // Change the label based on whether the item exists
          setSaveLabel(exists ? "Saved" : "Save");
        })
        .catch((error) => {
          console.log("Error fetching wishlist containers and items:", error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false when the fetch operation completes
        });
    }
  }, [wishlistContainer, token]); // Include token in the dependencies array

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const showModal = (imageUrl, index) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
    setIsModalVisible(false);
  };

  const labels = [
    "Rating(4.8)",
    "Reviews(33 reviews)",
    "Ottawa, Ontario, Canada",
  ];

  // const imageUrls = [kitchen, room, apartment1, kitchen, apartment]; // Add more image URLs as needed
  const videoUrl = hosthomevideo || null;

  // Define the number of images to display on the page
  const imagesPerPage = 4;
  const imagesToDisplay = imageUrlss.slice(0, imagesPerPage);

  return (
    <div className="w-full flex flex-wrap flex-col-reverse md:flex-row h-full">
      <div
        isOpen={isWishlistModalVisible}
        onRequestClose={() => setIsWishlistModalVisible(false)}
      >
        {isWishlistModalVisible && (
          <WishlistModal
            listingId={id}
            added={() => {
              setIsWishlistModalVisible(false);
              setSaveLabel("Saved");
            }}
            onClose={() => setIsWishlistModalVisible(false)}
            wishlistContainer={wishlistContainer}
          />
        )}
      </div>
      <section className="w-full mt-5">
        <div className="text-3xl font-semibold inline break-words">
          <p>{title}</p>
        </div>

        <div className="flex mt-1">
          <div className="w-[70%]">
            <label className="text-base break-words">{address}</label>
          </div>

         {token&& <div className="w-[30%] flex  md:flex items justify-end gap-5">
            <button>
              <div className="flex underline">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="17px"
                    height="17px"
                  >
                    <path d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z" />
                  </svg>
                </span>
                <label className="text-sm font-medium cursor-pointer" onClick={openShareModal}>Share</label>
              </div>
            </button>

            <button
              disabled={loading}
              onClick={() => handleSave(wishlistContainer)}
            >
              <div className="flex underline">
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="17px"
                    height="17px"
                  >
                    <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                  </svg>
                </span>
                {token ? (
                  <label className="text-sm font-medium cursor-pointer">
                    {loading ? "Loading..." : saveLabel}
                  </label>
                ) : null}

              </div>
            </button>
          </div>}
        </div>
      </section>

      <div className="md:flex md:flex-row relative mt-5 w-full hidden">
        <div className="w-1/2 h-full rounded-l-xl md:mr-2 overflow-hidden">
          <div className="h-full   w-full cursor-pointer">
            <div className="relative">
              <img
                src={imageUrlss[0]}
                alt="Video Thumbnail"
                onClick={togglePlay}
                className="cursor-pointer w-full h-[500px]"
              />
              {isPlaying ? (
                <div className="absolute top-0 bottom-8 inset-0 flex items-center h-full w-full justify-center">
                  <video
                    src={videoUrl}
                    controls
                    ref={videoRef}
                    autoPlay={isPlaying}
                    className="w-full h-[500px]  object-cover"
                  ></video>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="bg-black bg-opacity-50 text-white p-4 rounded-full cursor-pointer"
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

        <div className="w-1/2 h-full rounded-r-xl md:ml-2 overflow-hidden">
          <div className="h-full w-full grid grid-cols-2 gap-2">
            {imagesToDisplay.map((imageUrl, index) => (
              <div
                key={index}
                className="h-[250px] overflow-hidden rounded-xl"
                onClick={() => showModal(imageUrl, index)}
              >
                <img
                  className="h-full w-full cursor-pointer"
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute xl:bottom-7 xl:right-8 md:right-6 md:bottom-[10%]">
          <button
            className="bg-black/80 hover:bg-black/90 p-2 xl:w-36 md:w-32 rounded"
            onClick={() => showModal(imageUrlss[0], 0)}
          >
            <div className="flex">
              <span className="mx-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="17px"
                  height="17px"
                  fill="#FFFFFF"
                >
                  <path d="M21,17H7V3H21M21,1H7A2,2 0 0,0 5,3V17A2,2 0 0,0 7,19H21A2,2 0 0,0 23,17V3A2,2 0 0,0 21,1M3,5H1V21A2,2 0 0,0 3,23H19V21H3M15.96,10.29L13.21,13.83L11.25,11.47L8.5,15H19.5L15.96,10.29Z" />
                </svg>
              </span>
              <label className="text-white text-sm md:text-xs">
                More Photos
              </label>
            </div>
          </button>
        </div>
      </div>

      {width <= 767 ? <SliderFull /> : null}

      {/* Modal for displaying images */}
      <Modal
        isOpen={isModalVisible}
        ariaHideApp={false}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "black",
            zIndex: 1000,
            display: "flex",
            alignItems: "center", // Center vertically
            justifyContent: "center",
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
            padding: "0",
          },
        }}
      >
        <div className="modal-content p-4">
          <button className="close-button text-white" onClick={closeModal}>
            <img src={close} className="w-4" alt="" />
          </button>

          {/* Inside the modal content, update the Carousel component as follows: */}
          {selectedImage && (
            <Carousel
              showArrows={true} // Set showArrows to true to display arrows in the carousel
              emulateTouch={true}
              selectedItem={selectedImageIndex}
              showStatus={false} // Set showStatus to false to hide the carousel status
              showThumbs={false}
              style={{
                display: "",
                justifyContent: "",
                alignItems: "center",
                background: "black",
              }}
            >
              {imageUrlss.map((imageUrl, index) => (
                <div
                  key={index}
                  style={{
                    height: "80%",
                    width: "30%",
                    margin: "auto",
                    background:
                      index === selectedImageIndex ? "transparent" : "black", // Set the background color to transparent for the selected image
                  }}
                >
                  {index !== selectedImageIndex ? (
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      style={{
                        height: "500px",
                        width: "700px",
                        margin: "100px auto",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <img
                      src={selectedImage}
                      alt={`Image ${index + 1}`}
                      style={{
                        height: "100%",
                        width: "700%",
                        margin: "100px auto",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>
              ))}
            </Carousel>
          )}
        </div>
      </Modal>
      <ShareModal isOpen={isShareModalOpen} onClose={closeShareModal} />

      <ToastContainer />
    </div>
  );
};

export default ListingPhotos;
