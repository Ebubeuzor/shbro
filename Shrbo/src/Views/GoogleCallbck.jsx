import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';
import axiosClient from '../axoisClient';
import Cookies from "js-cookie"; // Import the Cookies library

function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { setUser, setToken } = useStateContext();

  useEffect(() => {
    fetchGoogleCallback();
  }, []);

  const fetchGoogleCallback = () => {
    axiosClient
      .get(`/auth/callback${location.search}`)
      .then((response) => {
        setUser(response.data.user);
        setToken(response.data.access_token);

        // Check if there's a previous URL stored in a cookie
        const redirectPath = Cookies.get("redirectPath");

        // If there's a previous URL, navigate to it and remove the cookie
        if (redirectPath) {
          navigate(redirectPath);
          Cookies.remove("redirectPath");
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return null;
}

export default GoogleCallback;
