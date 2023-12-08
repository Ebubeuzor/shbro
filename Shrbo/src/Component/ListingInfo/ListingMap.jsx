import React ,{ useState } from "react";
import Popup from "../../hoc/Popup";
import Map from "../../Component/Map/Map"



    const ListingMap=()=>{
                
        const [isPopupOpen, setIsPopupOpen] = useState(false);

        const openPopup = () => {
          setIsPopupOpen(true);
        };

        const closePopup = () => {
          setIsPopupOpen(false);
        };

        return(
              <div className=" py-10 block mx-auto  w-full " >
                <section>
                    <div className=" pb-2" >
                        <div className=" font-semibold text-2xl " >
                            <h2>Where it is located </h2>
                        </div>
                    </div>
                    <div className=" mb-6 block box-border" > Mexico City, Ciudad de México, Mexico   </div>
                    <div className=" overflow-hidden h-[218px] relative rounded-lg md:h-[480px] mb-8 md:overflow-visible ">
                            <Map/>
                    </div>
                </section>
                 


              </div>
        );

    }

export default ListingMap;