import React from "react";
import room from "../../assets/room.jpeg";
import { Link } from "react-router-dom";
import WishlistsSet from "./WishlistsSet";
import BottomNavigation from "../Navigation/BottomNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Wishlists = ({ wishlists, loading }) => {
  const wishlist_groups = [...wishlists];

  const wishlist = wishlist_groups.map((group) => (
    <Link to={!(group.saves === 0) ? (group.link || "/WishlistsSet") : null} key={group.id}>
      <div className=" rounded-[0.25em] overflow-hidden  relative bg-cover">
        <div className=" overflow-hidden aspect-video relative rounded-[0.25em] block ">
          <div className=" absolute h-full start-0 end-0  m-0 p-0 block bg-slate-100/60  ">
            {!(group.url === null) ?
              <img
                className=" absolute  min-h-full opacity-100 transition w-full block object-cover align-middle overflow-hidden   "
                src={group.url}
              ></img>
              :
              <div className=" p-4 w-full h-full ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="grey" width={"64px"} viewBox="0 0 24 24">
                  <title>heart-cog-outline</title>
                  <path d="M16.5 5C14.96 5 13.46 6 12.93 7.36H11.07C10.54 6 9.04 5 7.5 5C5.5 5 4 
              6.5 4 8.5C4 11.39 7.14 14.24 11.89 18.55L12 18.65L12 18.63C12 18.75 12 18.88 12 
              19C12 19.71 12.12 20.4 12.32 21.06L12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 
              5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 
              8.5C22 9.8 21.59 11 20.84 12.25C20.25 12.09 19.63 12 19 12C18.87 12 18.74 12 18.6 12C19.5 
              10.79 20 9.65 20 8.5C20 6.5 18.5 5 16.5 5M23.83 20.64L22.83 22.37C22.76 22.5 22.63 22.5 22.5 
              22.5L21.27 22C21 22.18 20.73 22.34 20.43 22.47L20.24 23.79C20.22 23.91 20.11 24 20 24H18C17.86 
              24 17.76 23.91 17.74 23.79L17.55 22.47C17.24 22.35 16.96 22.18 16.7 22L15.46 22.5C15.34 22.5 15.21 
              22.5 15.15 22.37L14.15 20.64C14.09 20.53 14.12 20.4 14.21 20.32L15.27 19.5C15.25 19.33 15.24 19.17 
              15.24 19S15.25 18.67 15.27 18.5L14.21 17.68C14.11 17.6 14.09 17.47 14.15 17.36L15.15 15.63C15.22 15.5 
              15.35 15.5 15.46 15.5L16.7 16C16.96 15.82 17.25 15.66 17.55 15.53L17.74 14.21C17.76 14.09 17.87 14 18 
              14H20C20.11 14 20.22 14.09 20.23 14.21L20.42 15.53C20.73 15.65 21 15.82 21.27 16L22.5 15.5C22.63 15.5 
              22.76 15.5 22.82 15.63L23.82 17.36C23.88 17.47 23.85 17.6 23.76 17.68L22.7 18.5C22.73 18.67 22.74 18.83 
              22.74 19S22.72 19.33 22.7 19.5L23.77 20.32C23.86 20.4 23.89 20.53 23.83 20.64M20.5 19C20.5 18.17 19.83 17.5 19 
              17.5S17.5 18.17 17.5 19 18.16 20.5 19 20.5C19.83 20.5 20.5 19.83 20.5 19Z" /></svg>
              </div>

            }
          </div>
          <div className=" h-full w-full  items-end box-border flex flex-row  ">
            <div className=" pt-10 px-3 pb-3 start-0 end-0 m-0 absolute box-border  block bg-gray-400/40 text-white">
              <h3 className=" box-border block ">{group.title}</h3>
              <div className=" text-xs font-normal ">{group.saves} Saves</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  ));

  const SkeletonLoader = Array.from({ length: 3 }).map((group, index) => (
    <div key={index} className=" skeleton-loader text-transparent ">
      <div className=" overflow-hidden aspect-video rounded-[0.25em] block ">
        <div className="  h-full start-0 end-0  m-0 p-0 block  ">
          {/* <img className=" absolute  min-h-full opacity-100 transition block object-cover align-middle overflow-hidden   " src=""></img> */}
        </div>
        <div className=" h-full w-full  items-end box-border flex flex-row  ">
          <div className=" pt-10 px-3 pb-3 start-0 end-0 m-0  box-border  block  ">
            <h3 className=" box-border block "></h3>
            <div className=" text-xs font-normal "></div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div className=" min-h-[100dvh] relative block box-border">
      <div className=" main block box-border mb-32">
        <div className=" mr-auto">
          <div className=" mb-6 mt-8 ">
            <section>
              <div className=" md:pt-3 pb-2 text-black">
                <div className=" font-semibold text-4xl ">
                  <h1 className=" p-0 m-0 ">Wishlists</h1>
                </div>
              </div>
            </section>
            {!loading ? (
              <section>
                {wishlist_groups.length > 0 ? (
                  <div className="grid xl:grid-cols-4 gap-6 overflow-hidden    md:grid-cols-3 my-6   lg:gap-4 md:gap-4 grid-cols-1   ">
                    {wishlist}
                  </div>
                ) : (
                  <div className="flex justify-center items-center mt-60 mb-60">
                    <div className="text-gray-600 text-2xl flex flex-col items-center">
                      <p>You haven't created any Wishlists yet.</p>
                      <p>Start adding places you love!</p>{" "}
                      <FontAwesomeIcon
                        icon={faHeart}
                        size="2x"
                        className="mt-4"
                      />
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section>
                <div className="grid xl:grid-cols-4 gap-6 overflow-hidden    md:grid-cols-3 my-6   lg:gap-4 md:gap-4 grid-cols-1   ">
                  {SkeletonLoader}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlists;
