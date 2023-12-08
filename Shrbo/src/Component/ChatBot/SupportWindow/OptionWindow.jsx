// BotComponent.jsx
import React, { useState } from 'react';
import {styles} from '../Style';



const OptionWindow = ({ selectedOption , close }) => {
  const handleOptionClick = (option) => {
    selectedOption(option);
  };

  return (
    <div className="transition-5  flex flex-col gap-5 md:gap-0 cursor-default bg-slate-800 z-[2000] bottom-0  overflow-hidden md:rounded-xl fixed h-full w-full md:w-[320px] md:h-[450px] lg:h-[420px] md:bottom-[103px] md:right-6 md:max-h-[calc(100% - 48px)] md:max-w-[calc(100% - 48px)] " style={{
        ...styles.supportWindow,
        ...{
            // opacity:props.visible ? '1':'0'
        
      }
}}>
       <div className=" close-button text-white text-end z-50 w-full top-2 right-2 absolute flex justify-end items-center cursor-pointer pr-1  " onClick={close}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" width={"22px"} height={"22px"} viewBox="0 0 24 24"><title>window-close</title>
                    <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>
            </div>
         

           <div style={{ height:'0px'}}>
                <div style={styles.stripe}           />

            </div>

         

           
            
            <div className=' text-xl flex flex-col gap-2 w-full relative   top-[30%] md:top-[10%] px-5 md:h-[40%] h-[60%] font-semibold  '  >
                <div className=' flex gap-2 '>

                  <div className=' flex -space-x-4  ' >
                    <img
                    src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                    className="w-10 rounded-full"
                    alt="Avatar" />
                          <img
                      src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                      className="w-10 rounded-full"
                      alt="Avatar" />
                        <img
                      src="https://tecdn.b-cdn.net/img/new/avatars/2.webp"
                      className="w-10 rounded-full"
                      alt="Avatar" />

                  </div>
                  {/* <svg xmlns="http://www.w3.org/2000/svg" width={"25px"} height={"25px"} fill='rgb(251,146,60)'  viewBox="0 0 24 24"><title>robot-happy-outline</title>
                    <path d="M10.5 15.5C10.5 15.87 10.4 16.2 10.22 16.5C9.88 15.91 9.24 15.5 8.5 15.5S7.12 15.91 6.78 16.5C6.61 16.2 6.5 15.87 6.5 15.5C6.5 
                    14.4 7.4 13.5 8.5 13.5S10.5 14.4 10.5 15.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 
                    19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 
                    5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 
                    14V16H3V17H5V20H19V17H21V16M15.5 13.5C14.4 13.5 13.5 14.4 13.5 15.5C13.5 15.87 13.61 16.2 13.78 16.5C14.12 15.91 14.76 15.5 15.5 
                    15.5S16.88 15.91 17.22 16.5C17.4 16.2 17.5 15.87 17.5 15.5C17.5 14.4 16.61 13.5 15.5 13.5Z" /></svg> */}


                
                          <p className='text-white text-2xl  '>Hello👋,</p>

                </div>
              

                 <p className=' text-white ' >Welcome! Please select a support:</p>
                 <p className=' text-white text-sm mt-2 '> having any issue ?, let us know   </p>
              
          
            </div>


         <div className=' relative md:top-[15%] top-[12%] flex font-medium flex-col gap-4  md:gap-2 pt-6 mt-12 md:mt-2 md:p-4  p-6 text-slate-50  h-full bg-slate-50 overflow-hidden ' >

                <button className=' rounded-xl bg-orange-400 p-3 md:p-2 hover:bg-orange-300 transition-colors hover:text-slate-600   '  onClick={() => handleOptionClick('Shrbo Support')}>Shrbo Support</button>
                <button className=' rounded-xl bg-orange-400 p-3 md:p-2 hover:bg-orange-300 transition-colors hover:text-slate-600   '  onClick={() => handleOptionClick('Find booking questions')}>Find booking questions</button>
                <button className=' rounded-xl bg-orange-400 p-3 md:p-2 hover:bg-orange-300 transition-colors hover:text-slate-600   '  onClick={() => handleOptionClick('Find hosting questions')}>Find hosting questions</button>
                <button className=' rounded-xl bg-orange-400 p-3 md:p-2 hover:bg-orange-300 transition-colors hover:text-slate-600   '  onClick={() => handleOptionClick('Live chat')}>Live chat</button>
        </div>
    </div>
  );
};

export default OptionWindow;
 