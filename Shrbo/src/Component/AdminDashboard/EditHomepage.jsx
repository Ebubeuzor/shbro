import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminNavigation/AdminHeader";
import axoisInstance from "../../Axios";
import { notification } from "antd";


export default function EditHomepage() {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the image state to the base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubtitleChange = (e) => {
    setSubtitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image); // Use the base64 string directly
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      console.log(formData);

      // Make the Axios POST request to your API endpoint
      const response = await axoisInstance.post("/homepage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      // Show a success notification
      notification.success({
        message: "Submission Successful",
        description: "Your changes have been saved successfully.",
      });

      // Handle success, e.g., show a success message or redirect to another page
      // ...
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Reload the page
      window.location.reload();

    } catch (error) {
      // Handle error, e.g., show an error message
      console.error("Error:", error.response.data);
      notification.error({
        message: "Submission Failed",
        description: "Failed to save changes. Please try again.",
      });
    }
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="hidden md:block overflow-scroll example bg-orange-400 text-white w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>

        <div className="md:w-4/5 w-full p-4 h-[100vh]">
        
          <h1 className="text-2xl font-semibold mb-4">Edit Homepage</h1>
          <div className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <p className="text-gray-400 text-sm">
            This is where you can upload the main image for your homepage
            </p>
          </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Homepage Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 p-2 border rounded w-full"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>

              {image ? (
                <img
                  src={image}
                  alt="Selected Image"
                  className="mb-4 w-48 rounded-md"
                />
              ) : (
                <div className="text-gray-600 mb-4">No image selected</div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Title Text
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 border rounded w-full"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Subtitle Text
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 border rounded w-full"
                  value={subtitle}
                  onChange={handleSubtitleChange}
                />
              </div>

              <button
                type="submit"
                className="bg-orange-400 text-white p-2 rounded hover:bg-orange-600"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
