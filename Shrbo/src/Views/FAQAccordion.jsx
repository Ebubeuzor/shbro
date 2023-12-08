import React, { useState } from "react";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HelpNavigation from "../Component/HelpNavigation";
import Footer from "../Component/Navigation/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <button
        className="w-full p-4 bg-gray-200 hover:bg-gray-300 flex items-center justify-between rounded-lg"
        onClick={toggleAccordion}
      >
        <span className="text-left">{question}</span>
        <span
          className={`transform ${
            isOpen ? "rotate-180" : "rotate-0"
          } transition-transform`}
        >
          &#9660;
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 mt-1 rounded-b-lg">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQAccordion = () => {
  const faqData = [
    {
      question: "How can I contact Shrbo's support team?",
      answer:
        "Shrbo's customer support team can be reached via email at shortletbookingltd@gmail.com or by phone at +2349036043230.",
    },
    {
      question: "What should I do if I encounter technical issues on Shrbo?",
      answer:
        "For any technical issues on the Shrbo platform, users can reach out to the support team for assistance.",
    },
    {
      question: "Is there a knowledge base available for common queries?",
      answer:
        "Yes, there is a comprehensive knowledge base available on the Shrbo platform to address common queries and concerns.",
    },
    {
      question: "How can I report inappropriate behavior or content?",
      answer:
        "Users can report any inappropriate behavior or content by using the reporting feature available on the Shrbo platform.",
    },
    {
      question: "How does Shrbo ensure the security of user data?",
      answer:
        "Shrbo employs advanced security measures to protect user data, including encryption and strict access controls.",
    },
    {
      question: "How can I change my account settings and preferences?",
      answer:
        "Account settings and preferences can be changed by accessing the respective section in the user profile settings.",
    },
    {
      question:
        "What should I do if I have concerns about a specific property or host?",
      answer:
        "If you have concerns about a specific property or host, you can contact Shrbo's customer support team for guidance and resolution.",
    },
    {
      question:
        "Does Shrbo offer accommodations for users with specific requirements?",
      answer:
        "Shrbo accommodates users with special accommodation requirements by providing a diverse range of accessible properties.",
    },
    {
      question: "How can I provide feedback to improve Shrbo's services?",
      answer:
        "Users can provide feedback and suggestions to improve the Shrbo platform by contacting the support team or using the feedback submission feature.",
    },
    {
      question:
        "What guidelines should I follow for a smooth experience on Shrbo?",
      answer:
        "Adhering to the platform's guidelines and being aware of the terms and conditions ensures a smooth and hassle-free experience on Shrbo.",
    },
    {
      question: "How can I search for accommodations on Shrbo?",
      answer:
        "Accommodations can be searched for on Shrbo by using the search bar and applying various filters such as location, dates, and property type.",
    },
    {
      question:
        "What factors should I consider when choosing a property for booking?",
      answer:
        "Factors to consider when choosing a property for booking include location, amenities, pricing, and previous guest reviews.",
    },
    {
      question: "How can I modify or cancel my booking on Shrbo?",
      answer:
        "Bookings can be modified or canceled through the 'Manage Bookings' section in the user profile or by contacting the support team.",
    },
    {
      question: "What payment options are available on Shrbo?",
      answer:
        "Shrbo offers various payment options, including credit/debit cards, and other online payment methods.",
    },
    {
      question: "How can I verify the legitimacy of a property on Shrbo?",
      answer:
        "Users can verify the legitimacy of a property by reviewing host credentials, guest reviews, and property photos and descriptions.",
    },
    {
      question:
        "What should I do in case of issues during my stay at a property?",
      answer:
        "In case of issues during the stay, users can reach out to the host directly or contact Shrbo's customer support team for assistance.",
    },
    {
      question: "Are there specific guidelines for guests on Shrbo?",
      answer:
        "Shrbo has specific guidelines for guests, including rules regarding pets, smoking, events, and general property etiquette.",
    },
    {
      question: "Where can I view reviews and ratings of properties on Shrbo?",
      answer:
        "Reviews and ratings of properties from previous guests can be viewed on the property listing page to provide insights into the property's quality and hospitality.",
    },
    {
      question: "How can I find pet-friendly accommodations on Shrbo?",
      answer:
        "Users looking for pet-friendly accommodations can apply the 'Pets Allowed' filter during their property search on Shrbo.",
    },
    {
      question: "Can I make last-minute changes to my booking on Shrbo?",
      answer:
        "Last-minute changes to bookings can be made by contacting the host directly or reaching out to the support team for assistance.",
    },
    {
      question: "How can I list my property on the Shrbo platform?",
      answer:
        "Properties can be listed on the Shrbo platform by creating a host account and following the step-by-step listing process provided.",
    },
    {
      question: "What are the criteria for becoming a Shrbo host?",
      answer:
        "The criteria for becoming a Shrbo host include providing accurate property information, adhering to hosting standards, and maintaining a positive hosting record.",
    },
    {
      question: "How can I manage and update my property listing on Shrbo?",
      answer:
        "Hosts can manage and update their property listings by accessing the 'Manage Listings' section in their host account dashboard.",
    },
    {
      question: "What steps should I take to ensure guest safety and comfort?",
      answer:
        "To ensure guest safety and comfort, hosts should perform property inspections, provide essential amenities, and adhere to safety standards and guidelines.",
    },
    {
      question:
        "How can I handle guest inquiries and communication effectively?",
      answer:
        "Effective communication with guests can be managed through the messaging feature on the Shrbo platform, providing timely responses and addressing guest concerns promptly.",
    },
    {
      question:
        "What are the best practices for setting competitive pricing for my property?",
      answer:
        "Competitive pricing can be set by researching similar properties in your area, considering seasonal demand, and offering competitive rates while maintaining profitability.",
    },
    {
      question:
        "How can I ensure my property meets the required hosting standards?",
      answer:
        "Ensuring your property meets hosting standards involves maintaining cleanliness, providing accurate property information, and addressing any guest concerns promptly and professionally.",
    },
    {
      question:
        "What should I do if I encounter issues with a guest during their stay?",
      answer:
        "If issues arise during a guest's stay, it is essential to remain calm, address the concerns professionally, and communicate with the guest to find a suitable resolution.",
    },
    {
      question:
        "How can I enhance the appeal of my property listing to attract more guests?",
      answer:
        "Enhancing the appeal of your property listing can be done by adding high-quality photos, providing detailed property descriptions, and highlighting unique features and amenities.",
    },
    {
      question:
        "What steps can I take to handle guest reviews and feedback effectively?",
      answer:
        "Handling guest reviews and feedback effectively involves addressing any concerns or issues raised by guests, responding professionally and promptly, and using constructive feedback to improve the hosting experience.",
    },
    {
      question: "Cancellation Options",
      answer:
        "At Shrbo, we understand that flexibility is essential when planning your travel accommodations. Whether your travel plans change or unexpected circumstances arise, we offer a range of cancellation options to suit your needs. Our goal is to ensure that you have the peace of mind to book with confidence. Below, we outline our cancellation options and the steps you can take in various situations.\n1. Flexible Cancellation Policy\nWe offer a flexible cancellation policy that allows you to cancel your reservation free of charge within 48 hours of booking, provided that the check-in date is at least 10 days away. We believe in giving our guests the freedom to plan their trips without financial stress in the early stages of booking.\n2. Moderate Cancellation Policy\nOur moderate cancellation policy strikes a balance between flexibility and predictability. If you need to cancel your reservation within 7 days of the check-in date, you are eligible for a refund of 50% of the total booking amount. This policy is designed to help both guests and hosts manage their plans effectively.\n3. Strict Cancellation Policy\nFor those who appreciate certainty, we offer a strict cancellation policy. Cancellations made within 5 days of the check-in date are non-refundable. This option is ideal for travelers who are confident in their plans and prefer a no-nonsense approach to cancellations.\n4. Early Departures and No-Shows\nWe understand that circumstances may arise that lead to early departures or no-shows. In such cases, no refunds will be provided, and the total booking amount will be charged. This policy ensures fairness to hosts who rely on accurate booking information.\n5. Requesting Reservation Modifications\nIf your travel plans change but you wish to adjust your reservation, we allow you to request modifications to your reservation dates free of charge. These modifications are subject to availability and potential rate changes. However, please note that modifications made within 5-7 days of the check-in date will be treated as cancellations and will follow the cancellation policy outlined above.\n6. Updated Hosting Standards\nShrbo strictly implements Hosting Standards to ensure that if the guest did not stay in the booked apartment due to issues or complications from the host, the guest is entitled to a full refund. The reservation must be canceled on the host’s behalf, and the following penalties will apply:\nA cancellation fee of N20,000 will be deducted from the host's account.\nThe calendar for the specific dates will be marked as unavailable or blocked until the cancellation fee is cleared.\nBooking with Confidence\nWe want you to book with confidence, knowing that you have options to accommodate changes in your plans. Our range of cancellation policies is designed to give you the flexibility you need, while also providing hosts with a reliable way to manage their properties.\nUnderstanding Your Cancellation Options\nBefore booking, we recommend that you carefully review the specific cancellation policy associated with the property you are interested in. Each property may have its own cancellation policy, and the details will be clearly outlined during the booking process. This ensures that you are fully informed of the terms and conditions specific to your chosen accommodation.\nContacting Our Support Team\nIf you have questions or need further assistance regarding your reservation, our dedicated support team is here to help. You can reach out to us via email at shortletbookingltd@gmail.com or by phone at +2349036043230. We are committed to providing exceptional customer support to ensure your experience with Shrbo is both convenient and stress-free.\nBook with Confidence\nAt Shrbo, we believe in offering our guests the flexibility and support they need to make the most of their travel experiences. We want you to book with confidence, knowing that you have options to adapt to changing circumstances. Thank you for choosing Shrbo for your accommodation needs, and we look forward to providing you with an exceptional stay.",
    },
  ];

  return (
    <div>
      <HelpNavigation />
      <BottomNavigation />
      <div className="container pt-24 md:w-[80%]   mx-auto p-4">
        <h1 className="text-3xl text-center font-semibold my-20">
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="text-primary mr-2"
          />
          Frequently Asked Questions
        </h1>
       <div className="pb-32">
       {faqData.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
       </div>
      <Footer />
    </div>
  );
};

export default FAQAccordion;
