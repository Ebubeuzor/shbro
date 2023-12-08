import React from "react";
import Header from "../Component/Navigation/Header";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import Footer from "../Component/Navigation/Footer";
import { Button } from "antd";
import HelpNavigation from "../Component/HelpNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export default function CancellationPolicy() {
  return (
    <div>
      {/* <Header /> */}
      <BottomNavigation />
      <div className="grid grid-cols-1 pt-24  md:grid-cols-3 py-8">
        <HelpNavigation />
        <div className="container md:w-[80%] col-span-2 mx-auto p-4">
          <h1 className="text-3xl font-semibold mb-4">Cancellation Policy</h1>
          <p className="mb-4">
            At Shrbo, we understand that flexibility is essential when planning
            your travel accommodations. Whether your travel plans change or
            unexpected circumstances arise, we offer a range of cancellation
            options to suit your needs. Our goal is to ensure that you have the
            peace of mind to book with confidence. Below, we outline our
            cancellation options and the steps you can take in various
            situations.
          </p>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {" "}
              Flexible Cancellation Policy
            </h2>
            <p>
              We offer a flexible cancellation policy that allows you to cancel
              your reservation free of charge within 48 hours of booking,
              provided that the check-in date is at least 10 days away. We
              believe in giving our guests the freedom to plan their trips
              without financial stress in the early stages of booking.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Moderate Cancellation Policy
            </h2>
            <p>
              Our moderate cancellation policy strikes a balance between
              flexibility and predictability. If you need to cancel your
              reservation within 7 days of the check-in date, you are eligible
              for a refund of 50% of the total booking amount. This policy is
              designed to help both guests and hosts manage their plans
              effectively.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {" "}
              Strict Cancellation Policy
            </h2>
            <p>
              For those who appreciate certainty, we offer a strict cancellation
              policy. Cancellations made within 5 days of the check-in date are
              non-refundable. This option is ideal for travelers who are
              confident in their plans and prefer a no-nonsense approach to
              cancellations.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Early Departures and No-Shows
            </h2>
            <p>
              We understand that circumstances may arise that lead to early
              departures or no-shows. In such cases, no refunds will be
              provided, and the total booking amount will be charged. This
              policy ensures fairness to hosts who rely on accurate booking
              information.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Requesting Reservation Modifications
            </h2>
            <p>
              If your travel plans change but you wish to adjust your
              reservation, we allow you to request modifications to your
              reservation dates free of charge. These modifications are subject
              to availability and potential rate changes. However, please note
              that modifications made within 5-7 days of the check-in date will
              be treated as cancellations and will follow the cancellation
              policy outlined above.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Updated Hosting Standards
            </h2>
            <p>
              Shrbo strictly implements Hosting Standards to ensure that if the
              guest did not stay in the booked apartment due to issues or
              complications from the host, the guest is entitled to a full
              refund. The reservation must be cancelled on the host’s behalf,
              and the following penalties will apply: A cancellation fee of
              N20,000 will be deducted from the host's account. The calendar for
              the specific dates will be marked as unavailable or blocked until
              the cancellation fee is cleared.
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Booking with Confidence
            </h2>
            <p>
              We want you to book with confidence, knowing that you have options
              to accommodate changes in your plans. Our range of cancellation
              policies is designed to give you the flexibility you need, while
              also providing hosts with a reliable way to manage their
              properties.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Understanding Your Cancellation Options
            </h2>
            <p>
              Before booking, we recommend that you carefully review the
              specific cancellation policy associated with the property you are
              interested in. Each property may have its own cancellation policy,
              and the details will be clearly outlined during the booking
              process. This ensures that you are fully informed of the terms and
              conditions specific to your chosen accommodation.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Contacting Our Support Team
            </h2>
            <p>
              If you have questions or need further assistance regarding your
              reservation, our dedicated support team is here to help. You can
              reach out to us via email at shortletbookingltd@gmail.com or by
              phone at +2349036043230. We are committed to providing exceptional
              customer support to ensure your experience with Shrbo is both
              convenient and stress-free.
            </p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Book with Confidence</h2>
            <p>
              At Shrbo, we believe in offering our guests the flexibility and
              support they need to make the most of their travel experiences. We
              want you to book with confidence, knowing that you have options to
              adapt to changing circumstances. Thank you for choosing Shrbo for
              your accommodation needs, and we look forward to providing you
              with an exceptional stay.
            </p>
          </div>
        </div>
        <div className="moreInfo mx-auto md:w-[80%] px-4 my-4 pb-32">
          <h1 className="text-2xl font-semibold">
            <FontAwesomeIcon
              icon={faPhone}
              className="text-orange-600 text-xl mr-4"
            />
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
