import React, { useEffect, useRef } from "react";
import google from "../../assets/google.png"
import axiosClient from "../../axoisClient"
import { useState } from "react";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import {  notification} from 'antd';
import { useStateContext } from "../../context/ContextProvider";
import logo from "../../assets/logo.png";

const Signup=()=>{   

    const {token,setToken,setUser} = useStateContext();
    const [loginUrl, setLoginUrl] = useState(null);
    const [error, setError] = useState({__html: ""});
      
    const navigate = useNavigate();
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

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

    const handleSubmmit=(ev)=>{
      ev.preventDefault();
      let data={
        'name' : nameRef.current.value,
        'email' : emailRef.current.value,
        'password' : passwordRef.current.value
      };

      axiosClient.post('/signup',data)
      .then((data) => {
        console.log(data.data.link);
        window.location.href = data.data.link;
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          if (error.response.data.errors) {
            const finalError = Object.values(error.response.data.errors).reduce((accum, next) => [
              ...accum, ...next
            ], []);
            setError({ __html: finalError.join("<br/>") });
          } else {
            const finalError = Object.values(error.response.data.message).reduce((accum, next) => [
              ...accum, ...next
            ], []);
            setError({ __html: finalError.join("") });
          }
        }
      });
    } 

    
    useEffect(() => {
      fetch('https://shortletbooking.com/api/auth', {
          headers : {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
          }
      })
      .then((response) => {
          if (response.ok) {
              return response.json();
          }
          throw new Error('Something went wrong!');
      })
      .then((data) => setLoginUrl( data.url ))
      .catch((error) => console.error(error));
    }, [])


    return(
    
    
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
             {contextHolder}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-16   w-auto"
            src={logo}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl md:text-3xl font-bold leading-9  text-gray-900">
            Create an account
          </h2>
          <h3 className="text-center mt-1 px-3  tracking-tight text-gray-400" >Please complete the registration process to create an account. </h3>
        </div>

   
      {loginUrl != null && (
        <div>
          <div>
            <button
              type="submit"
              className="flex w-full mb-2 gap-1 justify-center rounded-md border-0 ring-2 ring-inset ring-gray-300   px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-50"
            >
              <img width={"24px"} height={"24px"} src={google} />
              <a href={loginUrl}>Sign in with Google   </a>
            </button>
          </div>
                                    
          <div
            className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p
              className="mx-4 mb-0 text-gray-500 text-sm text-center font-semibold ">
              OR
            </p>
          </div>

        </div>
        )}

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-5" method="post"   onSubmit={handleSubmmit}  >
            
            {
              error.__html && (
                  <div className="bg-red-500 rounded py-2 px-3 text-white" dangerouslySetInnerHTML={error}>

                  </div>
              )
            }

            <div>
              <label htmlFor="Fullname" className="block text-base font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="Fullname"
                  name="Fullname"
                  ref={nameRef}
                  type="text"
                  autoComplete="name"
                  placeholder="Enter Name"
                  required
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  ref={emailRef}
                  autoComplete="email"
                  placeholder="Enter your email"
                  required
                  className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
             
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
             
                className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 "
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account? {' '}
            <a href="/Login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Log in
            </a>
          </p>
        </div>
        
        <div className="mt-5 text-center text-sm sm:mx-auto sm:w-full sm:max-w-sm">
          <label>
           
            <Link to={"/TermsofService"} className=" text-indigo-600 hover:underline " > Terms & Conditions</Link> and  
            <Link to={"/PrivacyPolicy"} className=" text-indigo-600 hover:underline " > Privacy policy</Link>.

          </label>
        </div>

      </div>
    
    )



}


export default Signup;