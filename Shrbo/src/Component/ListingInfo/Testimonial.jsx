import React,{useState} from "react";
import { Splide, SplideSlide} from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import adv from "../../assets/user.png";
import PopupFull from "../../hoc/PopupFull";
import TestimonialInfo from "./TestimonialInfo";





const Testimonial=()=>{

    const [open, setOpen] = useState(false);

    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };


    const clients= [
        { 
          id: 1,user:'Sophie Moore',date:'august 28 2023',
          min:adv, header:'"They’re amazing plumbers"',
          review:'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant morbi tristique senectus et netus et uteu sem integer vitae.'
        },
        { 
            id: 2,user:'Sophie Moore',date:'august 28 2023',
            min:adv, header:'"They’re amazing plumbers"',
            review:'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant morbi tristique senectus et netus et uteu sem integer vitae.'
          },
          { 
            id: 3,user:'Sophie Moore',date:'august 28 2023',
            min:adv, header:'"They’re amazing plumbers"',
            review:'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant morbi tristique senectus et netus et uteu sem integer vitae.'
          },
          { 
            id: 4,user:'Sophie Moore',date:'august 28 2023',
            min:adv, header:'"They’re amazing plumbers"',
            review:'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant morbi tristique senectus et netus et uteu sem integer vitae.'
          },
          { 
            id: 5,user:'Sophie Moore',date:'august 28 2023',
            min:adv, header:'"They’re amazing plumbers"',
            review:'Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant morbi tristique senectus et netus et uteu sem integer vitae.'
          },
                
        
      ];


    const slides=clients.map((client)=>(
        <SplideSlide key={client.id}>
            <div className="slide my-3 ">

                <div className=" relative rounded-2xl border p-5 md:p-7 shadow-md flex flex-col  justify-between h-[258px] md:h-[300px]   ">
                        <div className=" overflow-hidden text-ellipsis box-border block">
                            <p className=" text-lg text-ellipsis overflow-clip md:text-xl font-semibold pb-3 ">
                                {client.header}
                            </p>

                            <div className="  overflow-hidden text-ellipsis box-border block text-sm   md:text-lg "  >
                                <label className="sm overflow-clip ">
                                    {client.review}
                                </label>

                            </div>

                        </div>
                        <span className=" absolute right-10 bottom-10 flex  gap-[2px] justify-end items-center box-border md:font-semibold font-bold md:text-2xl text-base">
                                        <div className=" flex flex-row items-center gap-[2px]">
                                                4.9
                                             <svg xmlns="http://www.w3.org/2000/svg" 
                                                    viewBox="0 0 24 24"
                                                    width="14px"
                                                    height="14px">
                                                <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,
                                                5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,
                                                5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,
                                                3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,
                                                5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,
                                                20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                             </svg>
                                        </div>
                            </span>
                      
                        <div className="flex justify-items-start flex-row items-center box-border  mt-5  w4/5">
                            
                            <div   className=" h-[40px] w-[40px] md:w-[58px] md:h-[58px]  overflow-hidden rounded-full bg-orange-500 m-1"  ><img src={client.min}/></div>

                            <div className=" pt-3 pl-2" > 
                                <div className=" md:text-lg  text-base font-bold text-orange-500"  ><label>{client.user} </label></div> 
                                <div className=" text-sm md:text-base"><label>{client.date}</label></div> 
                            </div>

                        </div>
                </div>

            </div>
            

        </SplideSlide>
       

    ));

//     const ratinginfo=[
//         { 
//             id: 1,category:'Neatness',rating:'4.8',
           
//           },
//           { 
//             id: 2,category:'Check-in',rating:'4.9',
           
//           },
//           { 
//             id: 3,category:'Neatness',rating:'4.9',
//           },
//           { 
//             id: 4,category:'Value',rating:'4.8',
           
//           },

//     ];

//     const rating_category=ratinginfo.map(cat=>(
//         <div key={cat.id} className=" relative px-2 mr-[8.33%]  w-full md:w-1/2 md:px-2 ">
//             <div className=" flex itens-center md:max-w-[83.33%]  mb-4 justify-end flex-row">
//                 <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
//                     {cat.category}
//                 </div>
//                 <div className=" w-[75%] md:w-1/2 flex flex-row items-center ml-3" >
//                     <div className=" relative h-1 w-full mr-2 rounded-sm bg-slate-300 ">
//                         <span className=" absolute top-0 rounded-sm left-0 w-[96%] bg-black h-full "></span>
//                     </div>
//                     <span className=" text-black font-semibold text-sm ml-[6px]  ">
//                             {cat.rating}
//                     </span>

//                 </div>

//             </div>
           

//         </div>

       
// ));  
    







    return(
        <div className="w-full py-12 ">
                <div className=" w-full ">

                    <div className="text-2xl font-semibold  ">

                            <span className=" inline-flex mr-2 ">                                                       
                                             <svg xmlns="http://www.w3.org/2000/svg" 
                                                    viewBox="0 0 24 24"
                                                    width="18px"
                                                    height="18px">
                                                <path d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,
                                                5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,
                                                5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,
                                                3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,
                                                5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,
                                                20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                             </svg>
                                       
                            </span>
                            <span className=" inline-flex box-border">
                                <h2 className=" flex gap-3" >
                                    <span aria-hidden="true" dir="ltr" className=" text-2xl font-semibold">
                                                    5.0
                                    </span>
                                    <hr className="  border-0 border-t-2 border-black  block mt-5  w-1  text-3xl ">
                            </hr>
                                    <div className=" flex flex-col md:flexc"> 
                                            <h3 className=" text-[20px]  font-medium block"> 
                                                Exceptional
                                            </h3>
                                         
                                            <div className=" flex box-border ">
                                                <button className="relative text-orange-500 z-50 text-start text-sm  ">
                                                {clients.length} reviews
                                                </button>
                                            </div>
                                    </div>
                                </h2>

                            </span>                    
                    </div>        

{/* 
                    <div className=" md:flex items-stretch my-8 justify-start flex-wrap w-full max-h-[258px] md:h-full overflow-hidden hidden  ">
                                {rating_category}                 
                    </div> */}


                    <div className=" w-full mt-6 md:mt-6  ">

                             
                        <Splide  options={ {
                                        rewind: false,
                                        gap: '20px',
                                       
                                        autoplay:true,
                                        mediaQuery: 'min',
                                        breakpoints: {
                                              760: {
                                                perPage:2,
                                                arrows:true,
                                            
                                              },
                                        },
                                        arrows:false,
                                        perPage:1,
                                        pauseOnFocus:true,
                                        type: 'loop',
                                        pagination: false,
                                       
                                                                            }}>
                            {slides}
                        </Splide>







                    </div>

                    <div className=" mt-8  md:mt-8 ">
                                    <button type="button" className=" rounded-lg inline-block relative border transition-shadow py-[13px] px-[23px] text-base font-semibold" onClick={openPopup} >
                                        See all {clients.length} reviews
                                    </button>

                                    <PopupFull title={""} open={open} onClose={closePopup} >
                                        <TestimonialInfo/>
                                        
                                    </PopupFull>

                    </div>                    




                </div>


        </div>


    )










}





export default Testimonial;