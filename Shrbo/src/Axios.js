import axios from 'axios';
import { message} from 'antd';
const instance = axios.create({
  baseURL: 'https://shortletbooking.com/api',
});

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Check if access token is present in local storage
    const accessToken = localStorage.getItem('Shbro');

    // If access token is present, include it in the request headers
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(response=>{
	// console.log(request);
	return response;
}, error =>{
  
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.message;
    console.log("Interceptor",error.response.data.message);
    
    // Check if the error message is "Unauthenticated."
    if (errorMessage === "Unauthenticated.") {
      // logUser out if accessing auth required API's
      localStorage.removeItem("Shbro");
      localStorage.removeItem("A_Status");
      localStorage.removeItem("H_Status");
      localStorage.removeItem("CH_Status");
      localStorage.removeItem("supportAgent")
      localStorage.removeItem("supportUser")
      window.location.replace("/Login");

      // message.error("Please check your Internet connection 1");
    }
  }

  if (error.response && error.response.status === 451) {
    // Handle the status code 451 error here
    // For example, redirect to a page explaining legal restrictions
    localStorage.removeItem("Shbro");
    localStorage.removeItem("A_Status");
    localStorage.removeItem("H_Status");
    localStorage.removeItem("CH_Status");
    localStorage.removeItem("supportAgent")
    localStorage.removeItem("supportUser")
    window.location.replace("/Login");
  }

	return Promise.reject(error);
});


export default instance;
