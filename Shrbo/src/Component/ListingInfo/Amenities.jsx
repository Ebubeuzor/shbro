import React ,{ useState } from "react";
import Popup from "../../hoc/Popup";
import PopupFull from "../../hoc/PopupFull";




    const Amenities=()=>{
        const [isPopupOpen, setIsPopupOpen] = useState(false);
        const [open, setOpen] = useState(false);

        const openPopup = () => {
            setIsPopupOpen(true);
        };

        const closePopup = () => {
            setIsPopupOpen(false);
        };

      
        const showDrawer = () => {
          setOpen(true);
        };
        const onClose = () => {
          setOpen(false);
        };

        const amenities_info = [
            { id: 1,text:"1 bed"},
            { id: 2,text:"Shared bathroom"},
            { id: 3,text:"Host or others may share home "},
            { id: 4,text:"Iron"},
            { id: 5,text:"Swiming pool"},
            { id: 6,text:"Hot tub"},
            { id: 7,text:"Free parking"},
            { id: 8,text:"EV charger"},
            { id: 9,text:"Crib"},
            { id: 10,text:"Gym",},
         
            // it should have a "url" object aswell for Svg images  
          ];
    
          
           // Amenities Like 2 bedroom, living room, 3 bath room ,  cinema Room 
        const amenities=amenities_info.map(amenity=>(
                <div key={amenity.id} className=" relative px-[6px]  w-full md:w-1/2 md:px-2 ">
                    <div className=" flex items-center md:max-w-[83.33%]  pb-4 justify-end flex-row-reverse ">
                        <div>{amenity.text}</div>
                        <div className=" mr-4 min-w-[24px]">
                                     <svg xmlns="http://www.w3.org/2000/svg" 
                                                    viewBox="0 0 24 24"
                                                    width="14px"
                                                    height="14px"
                                        >
                                        <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,
                                        5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,
                                        5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,
                                        3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,
                                        5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,
                                        20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                    </svg>
                        </div>

                    </div>
                   

                </div>
    
               
        ));  





       return( 
                <div className=" box-border block text-[#222222] font-normal text-base w-full  " >
                        <div className=" py-12 ">
                            <section>
                                <div className="pb-6">
                                    <div className=" font-semibold text-xl">
                                        <h2 className=" text-2xl font-semibold ">Amenities</h2>
                                    </div>
                                </div>
                                <div className=" flex items-stretch justify-start flex-wrap w-full h-[238px] md:h-full overflow-hidden  ">
                                        {amenities}
                                </div>
                                <div className=" mt-4  md:mt-6 ">
                                    <button type="button" className=" rounded-lg hidden md:inline-block relative border transition-shadow py-[13px] px-[23px] text-base font-semibold" onClick={openPopup}>
                                        See all {amenities_info.length} amenities
                                    </button>

                                    {/* This button shows the drawer instead of Popup and it is only visible on mobile view */}
                                    <button type="button" className=" rounded-lg inline-block relative border transition-shadow py-[13px] px-[23px] md:hidden text-base font-semibold" onClick={showDrawer}>
                                        See all {amenities_info.length} amenities
                                    </button>

                                    <Popup isModalVisible={isPopupOpen} handleCancel={closePopup} title={"Amenities"}   >
                                                    {amenities}
                                    </Popup>
                                    {/* Drawer Popup */}
                                    <PopupFull title={"Amenities"} open={open} onClose={onClose}  >
                                        {amenities}
                                    </PopupFull>


                                    
                                    {/* {isPopupOpen&& <div className=" fixed inset-0 flex items-center justify-center  z-[100] bg-white  " >ggggggggggggggg </div> } */}



                                </div>
                            </section>

                        </div>
                    


                    </div>
        );

    };

export default Amenities;