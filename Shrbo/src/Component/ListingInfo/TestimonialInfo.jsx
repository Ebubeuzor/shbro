import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import adv from "../../assets/user.png";
import PaginationExample from "../PaginationExample";
import { Pagination } from 'antd';
const TestimonialInfo = () => {

    const [current, setCurrent] = useState(3);
    const onChange = (page) => {
      console.log(page);
      setCurrent(page);
    };

    const ratinginfo=[
        { 
            id: 1,category:'Neatness',rating:'4.8',
           
          },
          { 
            id: 2,category:'Check-in',rating:'4.9',
           
          },
          { 
            id: 3,category:'Neatness',rating:'4.9',
          },
          { 
            id: 4,category:'Value',rating:'4.8',
           
          },

    ];

    const rating_category=ratinginfo.map(cat=>(
        <div key={cat.id} className=" relative px-2   md:mr-[8.33%]  w-full  md:px-2 ">
            <div className=" flex itens-center md:max-w-[83.33%] gap-6 mb-4 lg:mb-5 justify-between md:justify-end flex-row">
                <div className="  md:w-[55%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {cat.category}
                </div>
                <div className=" w-[50%] md:w-1/2 flex flex-row items-center md:ml-3" >
                    <div className=" relative h-1 w-full mr-2 rounded-sm bg-slate-300 ">
                        <span className=" absolute top-0 rounded-sm left-0 w-[50%] bg-orange-400 h-full "></span>
                    </div>
                    <span className=" text-black font-semibold text-sm ml-[6px]  ">
                            {cat.rating}
                    </span>

                </div>

            </div>
           

        </div>

       
));  

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
        <div className="slide my-3 " key={client.id}>

            <div className=" relative rounded-xl md:rounded-none border md:border-0 p-5 md:p-7 md:shadow-none shadow-md flex flex-col   justify-between h-[258px] md:h-[300px]   ">
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
                        
                        <div   className=" h-[40px] w-[40px] md:w-[58px] md:h-[58px]  overflow-hidden rounded-full bg-orange-600 m-1"  ><img src={client.min}/></div>

                        <div className=" pt-3 pl-2" > 
                            <div className=" md:text-lg  text-base font-bold text-orange-600"  ><label>{client.user} </label></div> 
                            <div className=" text-sm md:text-base"><label>{client.date}</label></div> 
                        </div>

                    </div>
            </div>

        </div>
           
));






    
  
  return(
        <div className='w-full h-full flex flex-col lg:flex-row '>

            <div className=" mx-auto w-full   box-border block text-base  ">
                <div className=" pb-8 box-border text-base ">
                    <section>
                        <div className=" pt-16  pb-4 flex flex-row items-center box-border">
                           
                            <div className=" text-3xl font-semibold">
                                <h1 className=" ">Verified Guests Feedback </h1>
                            </div>
                        </div>
                    </section>
                </div>


                
            <div className=' flex flex-row  md:max-h-40 md:h-40 h-36 max-h-36 mb-8   w-full ' >
                <div className=' rounded-md bg-slate-100 flex flex-col items-center p-4 md:p-6 gap-1 text-center  ' >
                        <div>
                            <span className='text-lg md:text-2xl text-orange-400 font-bold ' > 5/5 </span>
                        </div>
                        <div><span className="text-orange-400 mr-1 text-lg md:text-2xl">&#9733; &#9733; &#9733; &#9733;</span></div>
                        <div className=' text-xs md:text-base '>140 Verified ratings</div>
                </div>

                <div className=' w-[60%] h-full  md:w-[70%]'>
                    <div className=" items-stretch  justify-start flex-wrap w-full md:h-full overflow-hidden flex ">
                                    {rating_category}                 
                    </div>
                </div>

            </div>
            </div>




            <div className='  h-full md:overflow-y-scroll example' >
                <div className=' w-full mb-8 uppercase '><span>Comments From Verified Guests  </span></div>
                <div> {slides} </div>

                <Pagination current={current} className=' text-center text-orange-500 ' onChange={onChange} total={50} />
            </div>


        

        </div>
);
};

export default TestimonialInfo;