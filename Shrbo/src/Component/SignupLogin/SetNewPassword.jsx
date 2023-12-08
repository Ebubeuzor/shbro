import React from "react";
import google from "../../assets/google.png"
import logo from "../../assets/logo.png"
import { useState } from "react";
import {  notification} from 'antd';

const SetNewPassword=()=>{   

    const [email,setEmail]=useState('');
    const [name,setName]=useState('');
    const [password,setPassword]=useState('');

    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type) => {
        api[type]({
        message: 'Notification Title',
        description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        placement:'bottom',
        className:'bg-green'
    });
    };

    const handleSubmmit=()=>{

        console.log("wwwwww")
        openNotificationWithIcon("success")


    } 




    return(
    
    
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
             {contextHolder}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src={logo}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl md:text-3xl font-bold leading-9  text-gray-900">
            Set new password
          </h2>
          <h3 className="text-center mt-1 px-3  tracking-tight text-gray-400" >must be at least 8 characters. </h3>
        </div>

   

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-5"    onSubmit={handleSubmmit}  >


                                    
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-base font-medium leading-6 text-gray-900">
                  Password
                </label>
             
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-base font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
             
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* <div className="text-sm  text-right">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}

            <div>
              <button
                type="submit"
             
                className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-3 text-base font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 "
              >
                 Reset password 
              </button>
            </div>
          </form>

      
          <div className=" pr-[18px] text-center w-full   md:block cursor-pointer md:relative mt-10  text-sm text-gray-500 ">
            <button className=" flex gap-2 w-full justify-center    " >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill=" grey "
              >
                <title>keyboard-backspace</title>
                <path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" />
              </svg>
              <a href="#" className="font-semibold leading-6 ">
                Back to log in
            </a>
            </button>
            </div>
        </div>
      </div>
    
    )



}


export default SetNewPassword;