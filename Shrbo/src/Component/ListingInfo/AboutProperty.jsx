import React, { useState } from "react";
import Popup from "../../hoc/Popup";

const AboutProperty = () => {


  return (
    <div className=" py-3 mb-6  ">
      <div className=" mb-4 md:mb-6 box-border block ">
        <h2 className=" text-2xl font-semibold">About Property</h2>
      </div>

      <div>
        <div className=" text-xl px-2  mb-2 font-semibold">
          <p>La Maison du Bayou -</p>
        </div>
        <div>
          <span>
            La Maison du Bayou Petite Anse is situated across from Bayou Petite
            Anse with a glimpse of a Louisiana swamp equipped with moss on live
            oak trees and palmettos. Hear the peaceful sounds of the habitat
            Acadiana has to offer. Enjoy real Cajun Country living in this home
            located on the outskirts of New Iberia. 10 minutes away from Jungle
            Gardens, Tabasco Plant, Avery Island, LA, & Rip Van Winkle Gardens,
            Jefferson Island, LA. 30 minutes from Lafayette, LA
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutProperty;
