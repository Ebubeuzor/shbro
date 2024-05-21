import React, { useState, useRef, useEffect } from 'react';
import HostHeader from './Navigation/HostHeader';
import Footer from './Navigation/Footer';
import BottomNavigation from './Navigation/BottomNavigation';
import { FaCloudUploadAlt, FaVideo } from "react-icons/fa";
import { notification, Spin } from 'antd';
import axios from '../Axios'
import { LoadingOutlined } from '@ant-design/icons';

const ReportDamage = () => {
  const [damageDescription, setDamageDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState();
  const [bookingNumber, setBookingNumber] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(false);



  const imageRef = useRef(null);

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const handleDamageDescriptionChange = (event) => {
    setDamageDescription(event.target.value);
  };

  const handlePhotoUpload = (event) => {
    if (photos.length < 5) {
      const photo = event.target.files[0];

      if (photo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos([...photos, reader.result]);

        };
        reader.readAsDataURL(photo);
      }
    } else {
      openNotification('error', 'You can upload a maximum of 5 images.');
    }
  };

  const handleVideoUpload = (event) => {
    setVideos('');
    const video = event.target.files[0];

    if (video) {
      const fileSizeInMB = video.size / (1024 * 1024); // Convert bytes to megabytes

      if (fileSizeInMB <= 30) {
        // Set previewVideo without converting to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideos(reader.result); // Convert to base64 and set videos

        };
        reader.readAsDataURL(video);

        // Check video duration
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(video);

        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 180) {
            openNotification('error', 'Video duration should not exceed 3 minutes.');
            setVideos(''); // Clear videos state if duration exceeds limit
          }
        };
      } else {
        openNotification('error', 'Video file size should not exceed 30MB.');
      }
    }

  };



  const handleBookingNumberChange = (event) => {
    const input = event.target.value;

    // Validate booking number using regex
    const bookingNumberRegex = /^[0-9]+$/;
    if (bookingNumberRegex.test(input) || input === '') {
      setBookingNumber(input);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if any field is empty
    if (!damageDescription || !photos.length || !videos || !bookingNumber) {
      notification.error({
        message: 'Error',
        description: 'No fields should be left empty. Please fill in all the required fields.',
      });
      return;
    }

    // Set loading to true during submission
    setLoading(true);

    // Send the report to the server using Axios
    try {
      console.table({
        description: damageDescription,
        photos,
        video: [videos],
        booking_number: bookingNumber,
      })
      const response = await axios.post('/reportDamage', {
        description: damageDescription,
        photos,
        video: videos,
        booking_number: bookingNumber,
      });

      // Handle the response as needed
      console.log('API response:', response.data);

      // Reset the form after successful submission
      setDamageDescription('');
      setPhotos([]);
      setVideos('');
      setBookingNumber('');

      notification.success({
        message: 'Success',
        description: 'Report submitted successfully!',
      });
    } catch (error) {
      console.error('Error submitting report:', error.response.data.error);

      // Handle the error, e.g., show an error notification
      notification.error({
        message: 'Error',
        description: error.response.data.error,
      });
    } finally {
      // Set loading back to false after submission (whether successful or not)
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <div className=' w-full h-screen flex items-center justify-center'>
        <Spin
          indicator={
            <LoadingOutlined
              style={{
                fontSize: 24,
                color:'orange',
              }}
              spin
            />
          }
        />
      </div>
        :
        <>
          <HostHeader />
          <div className="">
            <div className="max-w-md mx-auto mt-8 p-4 py-10 pb-32 bg-white ">
              <h2 className="text-3xl font-semibold mb-4">Report Property Damage</h2>
              <form onSubmit={handleSubmit}>
                {uploadStatus && <p className="text-red-500">{uploadStatus}</p>}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Damage Description:
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 max-h-48 h-48 rounded"
                    value={damageDescription}
                    onChange={handleDamageDescriptionChange}
                  />
                </div>
                <div className="">
                  <div className=" my-6">
                    <p className="block text-gray-700 text-sm font-bold mb-2">Upload Photos(maximum of 5): </p>
                    <label
                      htmlFor={imageRef}
                      onClick={() => imageRef.current.click()}
                      className="grid place-items-center bg-orange-300 w-28 text-white text-sm rounded-md  cursor-pointer transition duration-300 hover:bg-orange-600"
                    >
                      <div className="m-3">
                        <FaCloudUploadAlt className="text-base mx-auto" />
                      </div>
                      {/* <p className="mb-2">Click or Drag Photos Here</p> */}
                      <input
                        type="file"
                        ref={imageRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        // key={fileInputKey}
                        className="hidden"
                      // id={fileInputKey}
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 mb-3 gap-4">
                  {photos.map((src, index) => (
                    <img key={index} src={src} alt={`uploaded-img-${index}`} className=" w-28 h-24  object-cover" />
                  ))}
                </div>

                {/* <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Video(30mb):
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
              />
            </div> */}

                <div className="bg-white  rounded-lg mb-7 ">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Video(maximum 30mb):
                  </label>
                  <label
                    htmlFor="videoInput"
                    className="grid place-items-center bg-orange-300 w-28 text-white text-sm rounded-md  cursor-pointer transition duration-300 hover:bg-orange-600"
                  >
                    <div className=" m-3">
                      <FaVideo className="text-base " />
                    </div>
                    {/* Click to Upload Video */}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="videoInput"
                    />
                  </label>
                </div>
                <div className="mb-3 gap-4">
                  {videos && (
                    <div className="mb-4">
                      {/* <label className="block text-gray-700 text-sm font-bold mb-2">Uploaded Video:</label> */}
                      <video className="w-full object-cover h-64">
                        <source src={videos} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Booking Number:
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded "
                    type="text"
                    placeholder='3570862711'
                    value={bookingNumber}
                    onChange={handleBookingNumberChange}
                  />
                </div>

                <button
                  className="bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500"
                  type="submit"
                  disabled={loading}
                >
                  Submit Report
                </button>
              </form>
            </div>
          </div>

          <BottomNavigation />
          <Footer />
        </>
      }
    </>
  );
};

export default ReportDamage;
