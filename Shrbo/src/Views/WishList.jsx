import React from "react";
import Wishlists from "../Component/WishList/Wishlists";
import Header from "../Component/Navigation/Header";

const WishList=()=>{

    return(
    <div>
        <Header/>
         <div className=" block h-full px-6 md:px-10 xl:px-20 max-w-7xl  m-auto  ">
        <Wishlists/>
    
     </div>
    </div>
    );


}

export default WishList;
