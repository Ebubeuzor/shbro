import React, { useState, useRef ,useEffect} from "react";
import SettingsNavigation from "../SettingsNavigation";
import GoBackButton from "../../GoBackButton";
import { Select } from "antd";
import { Button, Result,notification} from 'antd';
import axios from '../../../Axios'
import { useStateContext } from "../../../ContextProvider/ContextProvider";
import { Link } from "react-router-dom";
import {styles} from '../../ChatBot/Style';
import {LoadingOutlined}  from '@ant-design/icons';
import { FaCloudUploadAlt } from "react-icons/fa";

const { Option } = Select;

export default function AddGovernmentId() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [fileImage , setFileImage]=useState(null);
  const [message, setMessage] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [submittedImages, setSubmittedImages] = useState();
  const [previewLiveImage, setPreviewLiveImage] = useState();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [succesfull,setSuccesfull]=useState();
  const {user,setUser,setHost,setAdminStatus}=useStateContext(false);
  const videoRef = useRef(null);
  const imageRef=useRef(null);
  const [loading,setLoading]=useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make a request to get the user data
        const response = await axios.get('/user'); // Adjust the endpoint based on your API
        

        // Set the user data in state
        setUser(response.data);
        setHost(response.data.host);
        setAdminStatus(response.data.adminStatus);
      

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // Set loading to false regardless of success or error
        // setLoading(false);
        
      }
    };

    fetchUserData();
  }, []); 


  const handleDocumentChange = (value) => {
    setSelectedDocument(value);
  };
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // The result will be the base64 representation of the image
        const base64String = reader.result;
        // setUploadedImage(base64String);
        setFileImage(base64String);
        addToSubmittedImages(URL.createObjectURL(file));
        // Call the function to process the image here (e.g., validation)
      };
      reader.readAsDataURL(file);
    }
  };


  const addToSubmittedImages = (image) => {
    setSubmittedImages(image);
  };


  const startCamera = async () => {
  try {
    if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const permissionStatus = await navigator.permissions.query({ name: 'camera' });

      if (permissionStatus.state !== 'granted') {
        console.error('Permission to access the camera is not granted.');
        // Handle the case where permission is not granted
        // For example, you might want to display a message to the user
      }
    } else {
      console.error('getUserMedia is not supported.');
    }
  } catch (error) {
    console.error('Error starting camera:', error);
  }
};


const capturePhoto = async () => {
  try {
    const permissionStatus = await navigator.permissions.query({ name: 'camera' });

    if (permissionStatus.state === 'granted') {
      // Permission to access the camera is granted
      if (videoRef.current) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Convert the captured image to base64
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64String = dataUrl; // Extract the base64 portion

        setUploadedImage(base64String);
       
        setPreviewLiveImage(dataUrl)

        // Call the function to process the image here (e.g., validation)

        // Remove the video stream after capturing
        if (videoRef.current.srcObject) {
          videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    } else {
      console.error('Permission to access the camera is not granted.');
      // Handle the case where permission is not granted for capturing
    }
  } catch (error) {
    console.error('Error capturing photo:', error);
  }
};



  const handleSubmit = async() => {
    // Add your logic to handle the form submission here.
    // You can access selectedDocument, uploadedImage, and submittedImages.
    console.log("Selected Document:", selectedDocument);
    console.log("Uploaded Image:", uploadedImage);
    console.log("Submitted Images:", fileImage);

    if(!(selectedDocument==null||uploadedImage==null ||submittedImages==null)){
  
      const data={
        government_id:fileImage,     
        verification_type:`${selectedDocument}`,
        live_photo:uploadedImage,
      }
  
      updateData(data);
    }else{
      
      openNotificationWithIcon("error","No Field Should be Left Empty ")
    }


 
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type,error) => {
      api[type]({
      message: type==="error"?'Error':"Succesfull",
      description:error,
      placement:'topRight',
      className:'bg-green'
  });
  };

  const updateData=async(data)=>{
    setLoading(true);
    try {
      const response= await axios.put(`/userDetail/${user.id}`,data);
      console.log('PUT request successful for Email', response.data);
      setSuccesfull(true);

    } catch (error) {
      console.error('Error making PUT request', error);
      if(error.response.data.message){
        
        openNotificationWithIcon("error",error.response.data.message)
      }else{

        openNotificationWithIcon("error",error.response.data)
      }
    }finally{
      setLoading(false);
    }
  }


  return (
    <div className="container max-w-2xl mx-auto p-4">
      
      {contextHolder}
      {succesfull?
       <div className=" h-full flex items-center justify-center ">
         <Result
         status="success"
         className=" md:h-screen flex flex-col items-center justify-center "
         title={<div className=" md:text-3xl">Successfully Updated Your Government ID!</div>}
         subTitle={<div className=" md:text-base">Your ID card has been Submitted successfully and would be Reviewed by Shrbo Team, you will receive an Email when this is done.</div>}
         extra={[
              <div    key={"Console"} className=" w-full flex justify-center items-center">
             <Link
              to={"/Settings"}
            //  type="button"
             className="flex  justify-center rounded-md border
             px-3 py-1.5 text-sm text-white bg-slate-700 transition-colors  hover:bg-slate-600
             leading-6 shadow-sm 
              hover:text-white
             focus-visible:outline focus-visible:outline-2 
             focus-visible:outline-offset-2 
            //  focus-visible:outline-orange-400 "
             >
             
             Go to Account
           </Link>
                
              </div>
          //  <Button key="buy" onClick={()=>{setSuccesfull(false)}}>Try Again</Button>,
         ]}
       />

       </div>
     
          :
      <>
          {loading?

              <>
              <div
                className="transition-3"
                style={{
                    ...styles.loadingDiv,
                    ...{
                        zIndex:loading? '10':'-1',
                        display:loading? "block" :"none",
                        opacity:loading? '0.33':'0',
                    }
                }}

            />
            <LoadingOutlined 
                className="transition-3"
                style={{
                    ...styles.loadingIcon,
                    ...{
                        zIndex:loading? '10':'-1',
                        display:loading? "block" :"none",
                        opacity:loading? '1':'0',
                        fontSize:'42px',
                        top:'calc(50% - 41px)',
                        left:'calc(50% - 41px)',


                    }
                
                
                }}
            />
            </>
            :
            
        <>
      
      <GoBackButton />
      <SettingsNavigation title="Government Info" text="Government info" />
      <h1 className="text-2xl font-bold">Upload Government ID Card</h1>
      <p className="mt-2 text-gray-600">
        It looks like this isn't a photo of a valid form of ID. Please provide a
        photo of the type of ID you selected. If this is incorrect, try taking
        another photo and make sure the information on your ID is clearly
        visible.
      </p>
      <Select
        value={selectedDocument}
        onChange={handleDocumentChange}
        className="mt-4"
        placeholder="Select identity document to upload"
      >
        <Option value="driversLicense">Driver's License</Option>
        <Option value="passport">International Passport</Option>
        <Option value="nationalIDCard">National Identity Card</Option>
        <Option value="nationalIDNumber">
          National Identity Number (Slip)
        </Option>
      </Select>
      {/* <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-4 p-2 border border-gray-300 rounded hidden tim"
        /> */}
          <div className="text-center">
                  <div className=" my-6">
                    <label
                      htmlFor={imageRef}
                      onClick={()=>imageRef.current.click()}
                      className="cursor-pointer block w-full  mx-auto bg-orange-300 text-white rounded-md p-4 text-center transition duration-300 hover:bg-orange-600"
                    >
                      <div className="mb-4">
                        <FaCloudUploadAlt className="text-4xl mx-auto" />
                      </div>
                      <p className="mb-2">Click or Drag Photos Here</p>
                      <p className="text-sm">Choose a clear picture</p>
                      <input
                        type="file"
                        ref={imageRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        // key={fileInputKey}
                        className="hidden"
                        // id={fileInputKey}
                      />
                    </label>
                  </div>
                </div>
      <div className="mt-4">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded" />
        <div className="flex justify-between mt-2">
          <button
            onClick={startCamera}
            className="w-1/2 p-2 m-2 bg-orange-400 text-white rounded hover m-2:bg-orange-500"
            >
            Start Camera
          </button>
          <button
            onClick={capturePhoto}
            className="w-1/2 p-2 m-2 bg-orange-400 text-white rounded hover m-2:bg-orange-500"
          >
            Capture Photo
          </button>
        </div>
        <div className="mt-4">
    <h2 className="text-xl font-semibold">Submitted Image:</h2>
      </div>
      {submittedImages&& (
    
      <img
        src={submittedImages}
        alt={`Submitted Image`}
        className="mt-2 w-full max-w-md rounded"
      />

)}
  {previewLiveImage&& (
<img
        src={previewLiveImage}
        alt={`Live Image`}
        className="mt-2 w-full max-w-md rounded"
      />

      )}
  </div>


      {message && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Message:</h2>
          <p className="mt-2">{message}</p>
        </div>
      )}
      {confirmationMessage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Confirmation:</h2>
          <p className="mt-2">{confirmationMessage}</p>
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 p-2 bg-orange-400 text-white rounded hover:bg-orange-500"
        >
        Submit
      </button>
        </>
          }
        </>
         }
    </div>
  );
}
