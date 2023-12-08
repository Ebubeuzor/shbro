import React from "react";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HelpNavigation from "../Component/HelpNavigation";
import Footer from "../Component/Navigation/Footer";

export default function SupportAndHelp() {
  return (
    <div className="">
        <BottomNavigation/>
        <HelpNavigation/>
      <div className=" md:w-[80%] py-32 mx-auto bg-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Support and Help</h1>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
          <div className="flex space-x-4">
            <a
              href="mailto:support@example.com"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full text-sm flex items-center"
            >
              <span>Email Support</span>
            </a>
            <a
              href="tel:+1234567890"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full text-sm flex items-center"
            >
              <span>Call Support</span>
            </a>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">FAQs</h2>
          <p>Browse Frequently Asked Questions</p>
          <a href="/FAQAccordion" className="text-orange-500 hover:underline">Browse all FAQs</a>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Report an Issue</h2>
          <p>Describe the Issue:</p>
          <textarea
            rows="4"
            className="w-full rounded p-2 border border-gray-300 focus:ring focus:ring-orange-200"
            placeholder="Enter your issue description here"
          ></textarea>
          <div className="mt-4">
            <label className="block text-gray-600">Attach Screenshots (if applicable)</label>
            <input
              type="file"
              className="w-full border border-gray-300 p-2 rounded focus:ring focus:ring-orange-200"
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Feedback and Suggestions</h2>
          <p>Provide Feedback:</p>
          <textarea
            rows="4"
            className="w-full rounded p-2 border border-gray-300 focus:ring focus:ring-orange-200"
            placeholder="Enter your feedback here"
          ></textarea>
          <div className="mt-4">
            <a
              href="/submit-suggestions"
              className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full w-fit text-sm flex items-center"
            >
              <span>Submit suggestions</span>
            </a>
          </div>
        </div>
        
        <div className="mt-4">
          <a href="/settings" className="text-orange-500 hover:underline">Back to Settings</a>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-full text-sm ml-4"
          >
            Save changes
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
