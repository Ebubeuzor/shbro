import React, { useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import PopupFull from "../../hoc/PopupFull";
import TestimonialInfo from "./TestimonialInfo";
import logoImage from "../../assets/shbro logo.png";

const Testimonial = ({ reviews }) => {
  const [open, setOpen] = useState(false);
  console.log(reviews);

  const openPopup = () => {
    setOpen(true);
  };

  const closePopup = () => {
    setOpen(false);
  };

  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce(
      (sum, review) => sum + review.ratings,
      0
    );
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(reviews);
  let content;

  if (reviews.length === 0) {
    content = (
      <div className="text-center h-20 flex justify-center items-center">
        <p>No reviews yet.</p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="w-full mt-6 md:mt-6 ">
          <Splide
            options={{
              rewind: false,
              gap: "20px",
              autoplay: true,
              mediaQuery: "min",
              breakpoints: {
                760: {
                  perPage: 2,
                  arrows: true,
                },
              },
              arrows: false,
              perPage: 1,
              pauseOnFocus: true,
              type: "loop",
              pagination: false,
            }}
          >
            {reviews.map((review, index) => (
              <SplideSlide key={index}>
                <div className="slide my-3">
                  <div className="relative rounded-2xl border p-5 md:p-10 shadow-md flex flex-col justify-between h-[258px] md:h-[300px]">
                    <img
                      src={review.user_profilePic || logoImage }
                      alt={review.title}
                      className="object-cover w-[80px] h-[80px] rounded-full absolute top-10 left-4"
                    />
                    <div className="ml-20">
                      <p className="text-lg font-semibold pb-3">
                        {review.user_name}
                      </p>
                      <p className="text-lg font-semibold pb-3">
                        {review.title}
                      </p>
                      <div className="text-sm">
                        <label>{review.comment}</label>
                      </div>
                    </div>
                    <span className="absolute right-2 bottom-2 flex gap-2 items-center">
                      <div className="flex items-center gap-2">
                        {review.ratings}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="14px"
                          height="14px"
                        >
                          <path
                            d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,
                    5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,
                    5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,
                    3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,
                    5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,
                    20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"
                          />
                        </svg>
                      </div>
                    </span>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        <div className="mt-8 md:mt-8 ">
          <button
            type="button"
            className="rounded-lg inline-block relative border transition-shadow py-[13px] px-[23px] text-base font-semibold"
            onClick={openPopup}
          >
            See all {reviews.length} reviews
          </button>

          <PopupFull title={""} open={open} onClose={closePopup}>
            <TestimonialInfo reviews={reviews} />
          </PopupFull>
        </div>
      </>
    );
  }

  const getReviewText = () => {
    if (reviews.length === 0) {
      return "0 reviews";
    } else {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.ratings,
        0
      );
      const averageRating = totalRating / reviews.length;

      if (averageRating === 0) {
        return "0";
      } else if (averageRating >= 4.5) {
        return "Exceptional";
      } else if (averageRating >= 4) {
        return "Excellent";
      } else if (averageRating >= 3) {
        return "Good";
      } else if (averageRating >= 2) {
        return "Fair";
      } else {
        return "Poor";
      }
    }
  };

  return (
    <div className="w-full py-12">
      <div className="w-full">
        <div className="text-2xl font-semibold ">
          <span className="inline-flex mr-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18px"
              height="18px"
            >
              <path
                d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,
                    5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,
                    5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,
                    3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,
                    5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,
                    20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z"
              />
            </svg>
          </span>
          <span className="inline-flex box-border">
            <h2 className="flex gap-3">
              <span
                aria-hidden="true"
                dir="ltr"
                className="text-2xl font-semibold"
              >
                {reviews.length > 0 ? averageRating.toFixed(1) : "0"}
              </span>
              <hr className="border-0 border-t-2 border-black block mt-5 w-1 text-3xl "></hr>
              <div className="flex flex-col md:flexc">
                <h3 className="text-[20px] font-medium block">
                  {getReviewText()}
                </h3>
                <div className="flex box-border ">
                  <button className="relative text-orange-500 z-50 text-start text-sm ">
                    {reviews.length} reviews
                  </button>
                </div>
              </div>
            </h2>
          </span>
        </div>

        {content}
      </div>
    </div>
  );
};

export default Testimonial;
