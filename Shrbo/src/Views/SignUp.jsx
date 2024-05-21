import React from "react";
import google from "../assets/google.png";
import logo from "../assets/logo.png";
import axios from "../Axios.js";
import { useState, useEffect, useRef } from "react";
import { notification } from "antd";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyEmailLink, setVerifyEmailLink] = useState([]);
  const verifyEmail = useRef(null);
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const hostid = params.get("hostid");
  const hostremtoken = params.get("hostremtoken");
  const hosthomeid = params.get("hosthomeid");
  const encrptedCoHostemail = params.get("cohostemail");
  const [showPassword, setShowPassword] = useState(false);

  const [googleUrl, setGoogleUrl] = useState("");

  useEffect(() => {
    try {
      // Make a GET request to the Google OAuth endpoint

      axios.get("/auth").then((response) => {
        setGoogleUrl(response.data.url);
        console.log(response.data);
      });

      // // Redirect the user to the Google sign-in page
      // if(response.data.url){
      //   window.location.href = response.data.url;

      // }
    } catch (error) {
      console.error("Error:", error);
      // Handle error if needed
    }
  }, []);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, error) => {
    api[type]({
      message: type === "error" ? "Error" : "Succesfull",
      description: error,
      placement: "topRight",
      className: "bg-green",
    });
  };

  console.table({
    hostremtoken,
    hostid,
    hosthomeid,
    encrptedCoHostemail,
  });

  const handleSubmmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make a POST request to your API endpoint
      const response = await axios.post("/signup", {
        email,
        name,
        password,
        hostremtoken,
        hostid,
        hosthomeid,
        encrptedCoHostemail,
      });

      // Handle the success response
      console.log(response.data); // You can customize this based on your API response
      if (response.data) {
        /// Live Chat unAuthenticated user logic
        localStorage.removeItem("gnT");
        localStorage.removeItem("gnU");
        localStorage.removeItem("gnUID");


        setLoading(false);
        openNotificationWithIcon("success");
        setVerifyEmailLink(response.data.link);
        // verifyEmail.current.click();
        console.log(response.data.link);
        window.location.href = response.data.link;
      }
      // Show success notification
    } catch (error) {
      setLoading(false);
      // Handle the error
      console.error("Error:", error);

      if (error.response.data.message) {
        openNotificationWithIcon("error", error.response.data.message);
      } else {
        openNotificationWithIcon("error", error.response.data);
      }
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      {contextHolder}
      {loading ? (
        <div className=" w-full h-screen flex items-center justify-center">
          <div class="containerld"></div>
        </div>
      ) : (
        <div className="flex h-full  flex-1 flex-col lg:justify-center px-6 py-16 lg:py-10 bg-slate-50/30 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-16 w-auto"
              src={logo}
              alt="Your Company"
            />
            <h2 className="mt-2 text-center text-2xl md:text-2xl font-medium leading-9  text-gray-900">
              Create an account
            </h2>
            <h3 className="text-center mt-1 px-3  tracking-tight text-gray-400">
              Please complete the registration process to create an account.{" "}
            </h3>
          </div>

          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm border rounded lg:bg-blend-darken bg-white    p-6 lg:p-8">
            {!encrptedCoHostemail && (
              <div>
                <a href={googleUrl}>
                  <button
                    type="submit"
                    className="flex w-full gap-1 justify-center rounded-md border-0 ring-2 ring-inset ring-gray-300   px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-50"
                  >
                    <img width={"24px"} height={"24px"} src={google} />
                    <span>Sign in with Google </span>
                  </button>
                </a>
              </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmmit}>
              {!encrptedCoHostemail && (
                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                  <p className="mx-4 mb-0 text-gray-500 text-sm text-center font-semibold ">
                    or
                  </p>
                </div>
              )}
              <div>
                <label
                  htmlFor="Fullname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    id="Fullname"
                    name="Fullname"
                    type="text"
                    autoComplete="name"
                    value={name}
                    placeholder="Enter Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm focus:border-orange-300 focus:border-2  placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    autoComplete="email"
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:border-orange-300 focus:border-2 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border px-2 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 focus:border-orange-300 focus:border-2 sm:text-sm sm:leading-6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash
                        className="h-5 w-5 text-gray-500"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <FaEye
                        className="h-5 w-5 text-gray-500"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 "
                >
                  Sign up
                </button>
              </div>
            </form>

            {!encrptedCoHostemail && (
              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to={"/LogIn"}
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Log in
                </Link>
              </p>
            )}
          </div>

          <div className="mt-3 text-center text-xs sm:mx-auto sm:w-full sm:max-w-sm">
            <label>
              By singing up,you have read and agree to our
              <Link
                to={"/TermsofService"}
                className=" text-indigo-600 hover:underline "
              >
                {" "}
                Terms & Conditions
              </Link>{" "}
              and
              <Link
                to={"/PrivacyPolicy"}
                className=" text-indigo-600 hover:underline "
              >
                {" "}
                Privacy policy
              </Link>
              .
              <a
                href={verifyEmailLink}
                ref={verifyEmail}
                className=" hidden "
              ></a>
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
