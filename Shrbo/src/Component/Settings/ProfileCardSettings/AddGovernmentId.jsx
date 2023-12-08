import React, { useEffect, useState } from 'react';
import SettingsNavigation from '../SettingsNavigation';
import GoBackButton from '../../GoBackButton';
import axiosClient from '../../../axoisClient';
import { useStateContext } from '../../../context/ContextProvider';

export default function AddGovernmentId() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [message, setMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const {user,setUser,token} = useStateContext();

  const getUserInfo = () => {
    useEffect(()=>{
      axiosClient.get('user')
        .then((data) => {
          console.log(data.data);
          setUser(data.data);
          console.log(token);
        })
    }, []);
  }

  getUserInfo();
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () =>{
        setUploadedImage(file);
        setUploadedImageUrl(reader.result)
        event.target.value = '';
      }
      reader.readAsDataURL(file);
      uploadImageToServer(file);
      setMessage(
        "It looks like this isn’t a photo of a valid form of ID. Please provide a photo of the type of ID you selected. If this is incorrect, try taking another photo and make sure the information on your ID is clearly visible."
      );

      // Simulate a 3-day confirmation message
      setTimeout(() => {
        setConfirmationMessage(
          "Your ID card will take 3 working days to be confirmed."
        );
      }, 3000);
    }
  };
  

  const uploadImageToServer = (file) => {
    // Simulate uploading the image to a server (replace with actual API call)
    return new Promise((resolve, reject) => {
      // Simulating a delay for the upload
      setTimeout(() => {
        resolve();
      }, 2000);
    });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    // Log the uploaded image again when the submit button is clicked
    console.log('Submitting image:', uploadedImage);
    const data = {
      "government_id" : uploadedImage,
      uploadedImageUrl
    };
    data.government_id = data.uploadedImageUrl;
    axiosClient.put(`/userDetail/${user.id}`,data)
    .then((data) => {
      console.log('Image uploaded successfully:');
      console.log(data);
    }).catch(() => {
      console.log("Something went wrong");
    })
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <GoBackButton/>
              <SettingsNavigation title="Government Info" text="Government info" />
      <h1 className="text-2xl font-bold">Upload Government ID Card</h1>
      <p>
        It looks like this isn’t a photo of a valid form of ID. Please provide a
        photo of the type of ID you selected. If this is incorrect, try taking
        another photo and make sure the information on your ID is clearly
        visible.
      </p>
      <input
        type="file"
        accept="image/*"
        form='governmentId'
        onChange={handleImageUpload}
        className="mt-4 p-2 border border-gray-300 rounded"
      />

      {uploadedImage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Uploaded Image:</h2>
          <img
            src={uploadedImageUrl}
            alt="Uploaded ID Card"
            className="mt-2 max-w-md"
          />
        </div>
      )}

      {message && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Error Message:</h2>
          <p className="mt-2 text-red-500">{message}</p>
        </div>
      )}

      {confirmationMessage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Confirmation:</h2>
          <p className="mt-2 text-green-500">{confirmationMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <form id='governmentId' encType="multipart/form-data" onSubmit={onSubmit}>
        
        <button
          className="mt-4 p-2 bg-orange-400 text-white rounded hover:bg-orange-500"
        >
          Submit
        </button>

      </form>
    </div>
  );
}
