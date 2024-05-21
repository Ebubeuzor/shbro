import React, { useState, useEffect } from "react";
import Card from "../Component/Card";
import { Link } from "react-router-dom";
import ProfileIcon from "../assets/svg/id-card-line-icon.svg";
import Padlock from "../assets/svg/lock-icon.svg";
import PaymentIcon from "../assets/svg/credit-card-icon.svg";
import BellIcon from "../assets/svg/bell-icon.svg";
import Footer from "../Component/Navigation/Footer";
import Header from "../Component/Navigation/Header";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HostModal from "../Component/Dashboard/HostModal";
import  { useStateContext } from "../ContextProvider/ContextProvider";
import axios from "../Axios";
import logo from "../assets/logo.png"
import { SwapOutlined } from "@ant-design/icons";

import { Skeleton } from 'antd';

export default function Settings() {
  const [isHostModalOpen, setHostModalOpen] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const {user,setUser,setHost,setAdminStatus , host, adminStatus,coHost,setCoHost}=useStateContext();
  const [userName,setUserName]=useState();
  const [userEmail,setUserEmail]=useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setHostModalOpen(true);
      } else {
        setHostModalOpen(false);
      }
    };

    // Initial check
    handleResize();

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make a request to get the user data
        const response = await axios.get('/user'); // Adjust the endpoint based on your API
        setUserName(response.data.name);
        setUserEmail(response.data.email);

        // Set the user data in state
        setUser(response.data);
        setHost(response.data.host);
        setAdminStatus(response.data.adminStatus);
        setCoHost(response.data.co_host)
      

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // Set loading to false regardless of success or error
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); 



    

  return (
    <div>

      
      <Header />

      <div className="pb-32">
        {isHostModalOpen && (
          <HostModal isOpen={true} onClose={() => setHostModalOpen(false)} userData={user} hostStatus={host} coHostStatus={coHost} adminStatus={adminStatus} />
        )}

        <div className="max-w-2xl md:mx-auto mx-9">
          <div className="my-14">
            <h1 className="text-4xl font-medium">Account</h1>
            <div className="text-base">
             {user.name?<> <span className="font-medium text-orange-500">{userName||user.name},</span>
              <span>{userEmail||user.email}</span></> : <span className="skeleton-loader text-transparent ">'Loading................................................................................'</span>
              
              }
              <br />
              <Link to="/UsersShow" className="underline ">
                Go to profile
              </Link>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <Link to="/Profile">
              <Card
                icon={ProfileIcon}
                title="Personal Info"
                text="Manage your account information and preferences."
              />
            </Link>
            <Link to="/security">
              <Card
                icon={Padlock}
                title="Security"
                text="Enhance the security of your account with password and login management options."
              />
            </Link>

           {coHost!=1&&<Link to="/payments">
              <Card
                icon={PaymentIcon}
                title="Payment Method"
                text="Manage your payment methods "
              />
              
            </Link>}

            <Link to="/AccountNotifications">
              <Card
                icon={ProfileIcon}
                title="Notifications "
                text="Control how and when you receive notifications from Shrbo."
              />
            </Link>
            <Link to="/TransactionHistory">
              <Card
                svg={<svg xmlns="http://www.w3.org/2000/svg" width={"38px"} height={"38px"} className="mb-5" viewBox="0 0 24 24"><title>swap-horizontal</title><path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z" /></svg>}
                title="Transaction History"
                text="View your transaction history."
              />
            </Link>
         
          </div>
        </div>
      </div>
      <BottomNavigation />
      <Footer />
    
    </div>
  );
}
