import React, { useState } from "react";
import AdminHeader from "./AdminNavigation/AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Axios from "../../Axios";
import { notification } from "antd";
import { Spin } from "antd";

export default function SocialPage() {
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await Axios.post("/createSocialMediaLink", {
        facebook_url: links.facebook,
        instagram_url: links.instagram,
        twitter_url: links.twitter,
      });

      console.log("Response:", response.data);
      // Show success notification
      notification.success({
        message: "Success",
        description: "Social media links saved successfully",
      });

      // Optionally, clear the form after submission
      setLinks({
        facebook: "",
        instagram: "",
        twitter: "",
      });
    } catch (error) {
      console.error("Error submitting links:", error);
      // Handle the error appropriately
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-[100vh]">
      <AdminHeader />
      <div className="flex">
        <div className="bg-orange-400 overflow-scroll example text-white hidden md:block md:w-1/5 h-[100vh] p-4">
          <AdminSidebar />
        </div>
        <div className="w-full md:w-4/5 p-4 h-[100vh] overflow-auto example">
          <h2 className="text-lg font-semibold mb-4">Social Media Links</h2>
          <p className="text-gray-400 text-sm mb-4">
            The Social Page is where you can manage the links to your website's
            Facebook, Instagram, and Twitter accounts. It provides a simple form
            where you can enter or update these links. This helps keep your
            website connected to your social media presence without needing to
            edit the website directly.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="facebook" className=" mb-2 flex items-center gap-2">
                <FaFacebook /> Facebook:
              </label>
              <input
                type="text"
                id="facebook"
                name="facebook"
                value={links.facebook}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="instagram" className=" mb-2 flex items-center gap-2">
                <FaInstagram /> Instagram:
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                value={links.instagram}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="twitter" className=" mb-2 flex items-center gap-2">
                <FaTwitter /> X:
              </label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={links.twitter}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
