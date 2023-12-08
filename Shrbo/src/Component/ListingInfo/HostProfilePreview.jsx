import React from "react";
import { Link } from "react-router-dom";
import {StarOutlined,CheckCircleOutlined} from '@ant-design/icons';

const HostProfilePreview=()=>{

    

    const host_info = [
        { id: 1,text:"No deals---yet!"},
        // { id: 2,text:"Quick to Respond"},
        { id: 3,text:" 5 other hostings"},

        // it should have a "url" object aswell for Svg images  
        // the host info required here is Max 3 nothing more
      ];

    const host=host_info.map(
        info=>(
            <span key={info.id}  className="flex flex-nowrap content-normal bg-slate-300   flex-row px-4  py-6 gap-4   
            lg:justify-normal  lg:items-center  lg:flex-row   min-h-[82px]
            rounded-lg border lg:py-2 lg:px-6  "  >
            <div className="   ">
                <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                width="24px"
                height="24px"
                ><path d="M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,
                20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,
                1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,
                4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z" /></svg>
            </div>
            <div className="  overflow-hidden text-ellipsis box-border block  "> 
                <div className=" text-base  overflow-clip    font-semibold ">{info.text}</div>
            </div>
        </span>    

        )
    );  





    return(
         <div className="w-full mb-6 ">
            <div className=" mb-6 box-border block ">
                <h2 className=" text-2xl font-semibold" >About your host</h2>

            </div>
            <div className=" flex flex-col gap-8 max-w-[380px] box-border " >
                <div className=" relative block bg-slate-100 rounded-md " >
                    <div className=" px-8 py-6 gap-6 min-h-[230px] w-full flex flex-col font-bold  rounded-2xl ">
                        <div className=" flex-grow flex flex-col items-center justify-center gap-2 relative ">
                            {/* add bg position */}
                            <div className=" relative box-border block h-[85px] w-[85px] 
                            bg-[url('https://a0.muscache.com/im/pictures/user/82130759-fbba-4012-ac60-51d5b0e4801e.jpg?im_w=240')] 
                            bg-center rounded-[50%] bg-cover bg-no-repeat   ">
                                  <CheckCircleOutlined className=" text-white text-xl bg-orange-500 rounded-[50px] absolute bottom-0 right-0   " />

                            </div>
                            <div className=" items-center flex flex-col max-w-[153px] box-border">
                                <div className="w-[153px] h-auto font-bold text-center flex-grow-0 flex-shrink-0 ">
                                    <span className=" text-2xl m-0 break-keep inline-block ">
                                            Christi-Anna
                                    </span>

                                </div>
                                <span className=" text-sm font-semibold gap-1 items-center flex">
                              <span>Verified</span>

                                </span>
                                
                            </div>

                        </div>

                        <div className=" flex flex-row gap-3 self-center items-center justify-center w-full box-border font-bold " >
                            <div className=" flex flex-col gap-[2px]  items-center  text-center justify-center text-3xl">
                                <span className=" flex gap-[2px] items-center  box-border font-bold text-xl">
                                        52
                                </span>
                                <span className=" text-xs font-semibold" >
                                        Reviews
                                </span>

                            </div>
                            <hr className=" mt-8 border-0 border-t-2  block  w-[20px]  text-3xl ">
                            </hr>
                            <div className=" flex flex-col gap-[2px]  items-center  justify-center text-3xl">
                                <span className=" flex gap-[2px] items-center box-border font-bold text-xl">
                                        <div className=" flex flex-row items-center gap-[2px]">
                                                4.9
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
                                </span>
                                <span className=" text-xs font-semibold" >
                                        Rating
                                </span>

                            </div>
                            <hr className=" mt-8  border-0 border-t-2  w-[20px]  block  text-3xl ">
                            </hr>
                            <div className=" flex flex-col gap-[2px]  items-center text-center justify-center   text-3xl">
                                <span className=" flex gap-[2px]  items-center box-border font-bold text-xl">
                                        2
                                </span>
                                <span className=" text-xs font-semibold " >
                                        Years hosting
                                </span>

                            </div>
                            {/* <hr className=" m-0 border-0 border-t-2 w-full  block  text-3xl ">
                            </hr> */}

                        </div>

                    </div>

                    {/* Max 3 Main Informations about the host eg  Occupation -- How many hosted properties---- etc  */}

                    <div className="box-border px-7 lg:px-8 py-6 gap-2 flex-col w-full flex ">
                      
                                {host}
                    </div>

                    



                    <div className="block w-full box-border px-7 lg:px-8 pb-4 " >
                       <Link to="/UserDetails">
                       <button className=" w-full text-base font-normal text-white rounded-md border border-solid py-[14px] px-6 bg-[#222222]  ">
                                View host Profile
                        </button>
                       </Link>

                    </div>

                </div>
                
            </div>
          

        </div>



    );

}

export default HostProfilePreview;