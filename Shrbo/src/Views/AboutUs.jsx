import React from "react";
import Header from "../Component/Navigation/Header";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import Footer from "../Component/Navigation/Footer";
import { Button } from "antd";
import HelpNavigation from "../Component/HelpNavigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function AboutUs() {
  return (
    <div>
      {/* <Header /> */}
      <BottomNavigation />
      <div className="grid grid-cols-1 pt-24  md:grid-cols-3 py-8">
      <HelpNavigation/>
        <div className="container md:w-[80%] col-span-2 mx-auto p-4">
          <h1 className="text-3xl font-semibold mb-4">About Us</h1>
          <p className="mb-4">
            Welcome to Shortlet Booking (Shrbo), your gateway to exceptional
            short-term accommodation experiences.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Founding Vision</h2>
            <p>
              Established in September 2023 by our visionary founders, Edwin
              Ndubuisi and Orji Kingsley, Shortlet Booking (Shrbo) was conceived
              with a singular purpose in mind: to create a secure sanctuary for
              individuals seeking to rent homes. Our founder's passion for safe,
              comfortable, and unique accommodations ignited the spark that
              continues to drive Shrbo today.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Our Mission and Vision
            </h2>
            <p>
              At Shrbo, our unwavering mission is to serve our people right in
              the heart of their homes and provide safe, distinctive
              accommodations for individuals all across Africa. Our vision
              extends beyond mere transactions; it's about creating an ecosystem
              where hospitality, convenience, and personalization intersect
              seamlessly.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Core Values</h2>
            <p>
              At the core of our existence lie the values of mutual respect,
              transparency, honesty, and genuine care. These values are more
              than words; they're the guiding principles that underpin every
              interaction, fostering trust and mutual respect among our
              community of hosts and guests.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Unmatched Availability
            </h2>
            <p>
              We understand that travel is often unpredictable. That's why our
              support team is available 24/7, ensuring your comfort and peace of
              mind during your stay in our rentals.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Our Commitment to Excellence
            </h2>
            <p>
              More than a platform, Shrbo is a thriving community built on
              trust, shared experiences, and memorable moments. We are committed
              to delivering excellence in every aspect of your journey, from
              booking to check-out.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Innovation at the Core
            </h2>
            <p>
              Innovation is in our DNA. We continually explore cutting-edge
              solutions to enhance your experience. By staying at the forefront
              of the short-term rental industry, we ensure that your travels are
              nothing short of exceptional.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Customer-Centric Approach
            </h2>
            <p>
              Our culture thrives on collaboration, innovation, and a relentless
              focus on our customers. We actively seek your feedback and adapt
              our platform to meet your ever-evolving needs.
            </p>
          </div>
          <p>
            At Shrbo, we are not just redefining accommodation; we are
            reimagining your entire journey. Join us in creating unforgettable
            memories, one stay at a time.
          </p>
        </div>
        <div className="moreInfo mx-auto md:w-[80%] px-4 my-4 pb-32">
      <h1 className="text-2xl font-semibold">
        <FontAwesomeIcon icon={faPhone} className="text-orange-600 text-xl mr-4" />
        Need to get in touch?
      </h1>
      <p>We’ll start with some questions and get you to the right place.</p>
      <div className="mt-10">
        <Button>About Us</Button>
      </div>
    </div>
      </div>
      <Footer />
    </div>
  );
}
