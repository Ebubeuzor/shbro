import React from "react";
import room from "../../assets/room.jpeg";
import {Link} from "react-router-dom";
import WishlistsSet from "./WishlistsSet";
import BottomNavigation from "../Navigation/BottomNavigation";

const Wishlists=()=>{

  const wishlist_groups= [
    { id: 1,title:"1 bed",saves:1,url:"https://a0.muscache.com/im/pictures/airflow/Hosting-778167635492331048/original/dcf9d96a-d764-472a-9bdc-da6251467660.jpg?im_w=720"},
    { id: 2,title:"Shared bathroom",saves:2,url:"https://a0.muscache.com/im/pictures/airflow/Hosting-778167635492331048/original/dcf9d96a-d764-472a-9bdc-da6251467660.jpg?im_w=720"},
    { id: 3,title:"Penthouse in La Juarez",saves:3,url:room},
    
    // it should have a "url" object aswell for Svg images  
  ];

  const wishlist=wishlist_groups.map(group=>(
    <Link to={"/WishlistsSet"} key={group.id}>
        <div className=" rounded-[0.25em] overflow-hidden  relative bg-cover" >
          <div className=" overflow-hidden aspect-video relative rounded-[0.25em] block ">
            <div className=" absolute start-0 end-0  m-0 p-0 block  ">
              <img className=" absolute opacity-100 transition block object-cover align-middle overflow-hidden   " src={group.url}></img>
            </div>
            <div className=" h-full w-full  items-end box-border flex flex-row  ">
              <div className=" pt-14 px-3 pb-3 start-0 end-0 m-0 absolute box-border block bg-black/40 text-white">
                    <h3 className=" box-border block ">{group.title}</h3>
                    <div className=" text-xs font-normal ">{group.saves} Saves</div>
              </div>
            </div>
          </div>

        </div>
      </Link>
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
                <section>
                  <div className="grid xl:grid-cols-4 gap-6 overflow-hidden    md:grid-cols-3 my-6   lg:gap-4 md:gap-4 grid-cols-1   ">
                      {wishlist}
                  </div>
                </section>

              </div>

              
            </div>
          </div>
          <BottomNavigation/>
      </div>
    );


}

export default Wishlists;
