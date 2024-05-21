import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/svg/avatar-icon.svg";
import CustomModal from "../CustomModal";
import { FaCamera } from "react-icons/fa"; // Import the camera icon
import Header from "../Navigation/Header";
import Footer from "../Navigation/Footer";
import { useStateContext } from "../../ContextProvider/ContextProvider";
import axios from '../../Axios'
import { message, notification } from 'antd';
export default function usersShow() {
  const { user, setUser, setHost, setAdminStatus, host } = useStateContext();
  const navigate = useNavigate();


  // Takes you back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };
  const [profilePicture, setProfilePicture] = useState(defaultProfile);
  const [visiblePicture, setVisiblePicture] = useState(defaultProfile);
  const [work, setWork] = useState("");
  const [speak, setSpeak] = useState("");
  const [lives, setLives] = useState("");
  const [occupation, setOccupation] = useState("");
  const [loading, setLoading] = useState(true);
  const [reRender, setRerender] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);



  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      // Use FileReader to read the selected image and update the profilePicture state
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setProfilePicture(base64String);
        setVisiblePicture(base64String);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, error) => {
    api[type]({
      message: type === "error" ? 'Error' : "Succesfull",
      description: error,
      placement: 'topRight',
      className: 'bg-green'
    });
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    if (work == "" || speak == "" || lives == "" || occupation == "") {

      return;
    }

    try {
      profilePicture != defaultProfile && await axios.put(`/userDetail/${user.id}`, { profilePicture: profilePicture });
      const aboutUserResponse = await axios.post("/createOrUpdateAboutUser", {
        work: work,
        speaks: speak,
        lives_in: lives,
        occupation: occupation,
      });
      setLoading(false)
      // console.log('PUT request successful ', response.data);
      message.success("Updated Successfuly")
    } catch (error) {
      setLoading(false)
      console.error('Error making PUT request', error);
      openNotificationWithIcon("error", error.response.data);
      return;
    } finally {
      closeModal()

      setRerender(true);
    }


    // You can now do something with the form data, such as sending it to an API.
  };

  // Function to handle form field changes
  const handleWorkChange = (event) => {
    setWork(event.target.value);

  };

  const handleSpeakChange = (event) => {
    setSpeak(event.target.value);

  };

  const handlelivesChange = (event) => {
    setLives(event.target.value);

  };

  const handleOccupationChange = (event) => {
    setOccupation(event.target.value);

  };

  useEffect(() => {
    setRerender(false);
    setLoading(true);
    const fetchUserData = async () => {
      try {
        // Make a request to get the user data
        const response = await axios.get('/user'); // Adjust the endpoint based on your API

        if (response.status === 200 && response.data) {
          const userId = response.data.id; // Assumed 'id' is the correct property; adjust as necessary

          // Make a request to get the reviews based on the user ID
          const reviewResponse = await axios.get(`/hostReview/${userId}`);

          setWork(reviewResponse.data.data.aboutUser[0].work);
          setOccupation(reviewResponse.data.data.aboutUser[0].occupation);
          setLives(reviewResponse.data.data.aboutUser[0].lives_in);
          setSpeak(reviewResponse.data.data.aboutUser[0].speaks);


        }
        // Set the user data in state
        setUser(response.data);
        setHost(response.data.host);
        setAdminStatus(response.data.adminStatus);
        setVisiblePicture(response.data.profilePicture ? `https://shortletbooking.com/${response.data.profilePicture}` : "");

      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        // Set loading to false regardless of success or error
        setLoading(false);

      }
    };

    fetchUserData();
  }, [reRender]);



  return (
    <>

      <div>
        {contextHolder}
        <Header />
        <div className="p-4 ">
          <div className="flex justify-between  md:hidden" >
            <div >
              <button onClick={handleGoBack}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  height="24px"
                  viewBox="0 0 24 24"
                >
                  <title>keyboard-backspace</title>
                  <path d="M21,11H6.83L10.41,7.41L9,6L3,12L9,18L10.41,16.58L6.83,13H21V11Z" />
                </svg>
              </button>
            </div>

            <div>
              {!loading && <button onClick={openModal}>Edit</button>}
            </div>

          </div>
          <div className="md:grid md:grid-cols-2 gap-3 md:w-2/3 md:mx-auto md:my-10">
            <div>
              {!loading ? <section className="bg-orange-400 py-5 px-2 rounded-lg my-10 shadow-lg">
                <div>
                  <div className="flex items-center  space-x-5 flex-wrap space-y-4">
                    <div>
                      <label htmlFor="profilePictureInput" className="w-fit">
                        <div
                          className="cursor-pointer bg-slate-200"
                          style={{
                            backgroundImage: `url(${user.profilePicture ? `https://shortletbooking.com/${user.profilePicture}` : profilePicture})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                          }}
                        >
                        </div>
                      </label>
                    </div>
                    <div className="text-white  text-center">
                      <h1 className="text-2xl">Welcome {user.name || "user"}</h1>
                      <span>{host === 0 || host == null ? "Guest" : "Host"}</span>
                    </div>
                  </div>
                </div>
              </section>
                :
                <section className=" skeleton-loader py-5 px-2 rounded-lg my-10 md:h-44 h-52 w-full">

                </section>
              }

              {!loading ?
                <section className="mt-10 md:shadow-lg md:p-5 md:border md:rounded-xl">
                  <div className="my-10">
                    <h1 className="text-2xl font-medium">
                      {user.name ? user.name.split(' ')[0] : "user"}'s confirmed Information
                    </h1>

                    <div className="my-2">
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="green"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <div>
                          <p>Email Address: {user.email}</p>
                        </div>
                      </div>

                      {user.phone && <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="green"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <div>
                          <p>Phone Number:{user.phone}</p>
                        </div>
                      </div>}


                      {!(user.verified === "Not Verified" || user.verified === null) ? <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="green"
                        >
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        <div>
                          <p>Identity Verified</p>
                        </div>
                      </div> : ""}





                    </div>

                  </div>


                  {(user.verified === "Not Verified" || user.verified === null) ? <div className="my-10">
                    <h1 className="text-2xl font-medium">Verify your identity</h1>

                    <div className="">
                      <div>
                        <p>
                          Before you book or Host on Shbro, you’ll need to complete
                          this step.
                        </p>
                      </div>
                      <div>
                        <Link to="/AddGovvernmentId">
                          <button className="py-2 px-8   my-4 border hover:bg-orange-400 hover:text-white">
                            Get verified
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div> : ""}
                </section>
                :
                <section>

                  <section className=" skeleton-loader mt-10 hidden md:block   md:p-5  md:rounded-xl h-60 w-full" />

                  <div className=" skeleton-loader h-6 mb-4 w-[80%]  md:hidden block " />
                  <div className=" skeleton-loader h-6 mb-4 w-[70%]  md:hidden block " />
                  <div className=" skeleton-loader h-6 mb-4 w-[65%]  md:hidden block " />
                  <div className=" skeleton-loader h-6 mb-4 w-[60%]  md:hidden block " />

                </section>



              }

            </div>

            <div className="flex justify-center items-end  ">
              {!loading ?
                <div className="md:shadow-lg md:p-5 md:border md:rounded-xl">
                  {!user.profilePicture ?
                    <h1 className="text-2xl font-medium">
                      It's time to create your profile
                    </h1>
                    :
                    <h1 className="text-2xl font-medium mb-2">
                      Edit your profile
                    </h1>}


                  <div className="">
                    <div>
                      {!user.profilePicture ?

                        <p>
                          Your Shbro profile is an important part of every
                          reservation. Create yours to help other Hosts and guests get
                          to know you.
                        </p>
                        :
                        <p>
                          Your Shbro profile plays a crucial role in every reservation.
                          If you already have a profile, consider updating it to help other
                          Hosts and guests get to know you better.
                        </p>}

                    </div>
                    <div>
                      <button
                        className="py-2 px-8 bg-orange-400 text-white my-4"
                        onClick={openModal}
                      >
                        {!user.profilePicture ? "Create profile" : "Edit profile "}
                      </button>
                    </div>
                  </div>
                </div>
                :
                <section className=" skeleton-loader mt-10 md:block hidden   md:p-5  md:rounded-xl h-60 w-full" />

              }
            </div>
            <CustomModal isOpen={isModalOpen} onClose={closeModal}>
              {loading ?
                <div className=' w-full h-screen flex items-center justify-center'>
                  <div class="containerld"></div>

                </div>
                :
                <form onSubmit={handleSubmit} className="md:w-2/3  mx-auto p-4">
                  {/* Modal content */}
                  <div className="my-4  mx-auto ">
                    {/* <h1>Create Your Profile</h1> */}
                    <div>
                      <label
                        htmlFor="profilePictureInput"
                        className="block text-2xl font-medium mb-2"
                      >
                        Upload Profile Picture
                      </label>
                      <div className="relative w-fit">
                        {profilePicture && (
                          <div
                            className="cursor-pointer bg-slate-200"
                            style={{
                              backgroundImage: `url(${visiblePicture})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              width: "150px",
                              height: "150px",
                              borderRadius: "50%",
                            }}
                          />
                        )}

                        <div className="flex items-center  absolute top-0 ">
                          <input
                            type="file"
                            id="profilePictureInput"
                            name="profilePictureInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Trigger the file input when the button is clicked
                              document
                                .getElementById("profilePictureInput")
                                .click();
                            }}
                            className="bg-orange-400 hover:bg-orange-700 text-white  rounded-full h-8 w-8 flex justify-center items-center"
                          >
                            <FaCamera />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className=" overflow-auto example ">
                      <h1 className="block text-2xl font-medium my-4">
                        Your profile
                      </h1>
                      <p>
                        The information you share will be used across Shbro to help
                        other guests and Hosts get to know you. Learn more
                      </p>
                      <div className="flex flex-wrap gap-5 mt-4">
                        <div className="my-4 w-full md:w-2/5">
                          <label
                            htmlFor="school"
                            className="block text-xl font-medium mb-2"
                          >
                            Where do you work ?
                          </label>
                          <input
                            type="text"
                            id="work"
                            name="work"
                            onChange={handleWorkChange}
                            value={work}
                            className="border rounded-md p-2 w-full"
                          // Add any necessary onChange or value props here
                          />
                        </div>
                        <div className="my-4 w-full md:w-2/5">
                          <label
                            htmlFor="school"
                            className="block text-xl font-medium mb-2"
                          >
                            What is your occupation ?
                          </label>
                          <input
                            type="text"
                            id="occupation"
                            name="occupation"
                            onChange={handleOccupationChange}
                            value={occupation}
                            className="border rounded-md p-2 w-full"
                          // Add any necessary onChange or value props here
                          />
                        </div>
                        <div className="my-4 w-full md:w-2/5">
                          <label
                            htmlFor="school"
                            className="block text-xl font-medium mb-2"
                          >
                            What language do you speak ?
                          </label>
                          <input
                            type="text"
                            id="language"
                            name="language"
                            onChange={handleSpeakChange}
                            value={speak}
                            className="border rounded-md p-2 w-full"
                          // Add any necessary onChange or value props here
                          />
                        </div>
                        <div className="my-4 w-full md:w-2/5">
                          <label
                            htmlFor="school"
                            className="block text-xl font-medium mb-2"
                          >
                            Where do you live ?
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            onChange={handlelivesChange}
                            value={lives}
                            className="border rounded-md p-2 w-full"
                          // Add any necessary onChange or value props here
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="p bg-orange-400 hover:bg-orange-500 py-2 px-10 text-white rounded-lg flex justify-center items-center"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              }
            </CustomModal>
          </div>
        </div>
        <Footer />
      </div>

    </>
  );
}
