import React from "react";
import logo from "../assets/logo.png"
import Footer from "../Component/Navigation/Footer";
import BottomNavigation from "../Component/Navigation/BottomNavigation";
import HelpNavigation from "../Component/HelpNavigation";
export default function PrivacyPolicy() {
    return (

        <div>
             <BottomNavigation/>
        <HelpNavigation/>

        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
     
        <div className="mx-auto grid max-w-3xl lg:max-w-4xl grid-cols-1 gap-x-8 gap-y-16 ">
            
        {/* <div className=" absolute top-6 ">
        <img
              className=" w-[70px] h-[70px] max-w-none   "
              src={logo}
              alt=""
            />
        </div> */}

          <div className="">
            <div className="lg:pr-4">
              <div className="lg:max-w-2xl max-w-xl">
                <p className="text-base font-semibold leading-7 text-orange-500">Shrbo privacy policy</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
                <p className="mt-6 text-xl leading-8 text-gray-700">
                Welcome to Shortlet Booking (Shrbo), a platform dedicated to providing you with exceptional 
                short-term accommodation experiences while prioritizing your privacy and data security. 
                This Privacy Policy outlines how we collect, use, and protect your personal information and 
                data. We are committed to ensuring your trust, and we take your privacy seriously. Please take 
                the time to read and understand this policy to make informed decisions about using our platform.
                </p>
              </div>
            </div>
          </div>

           {/* <div className="-ml-12 -mt-12 p-12 lg:overflow-hidden">
            <img
              className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
              alt=""
            />
          </div>  */}
          
          <div className="">
            <div className="lg:pr-4">
              <div className="max-w-lg text-base leading-7 text-gray-700 lg:max-w-2xl">

                <h2 className="  text-2xl font-semibold tracking-tight text-gray-900">  Data Collection and Usage</h2>
                <p className="mt-6">
                At Shrbo, we collect various types of data to improve your experience and provide 
                you with personalized services. This includes, but is not limited to:
                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">User Account Information</strong>When you create a Shrbo account,
                       we collect personal information such as your name, email address, and contact details. This enables us to create 
                       and maintain your account, provide customer support, and keep you updated on your bookings.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Booking Data</strong> When you make a booking through our 
                      platform, we collect information about your reservation, such as the property, check-in and check-out dates, 
                      and booking preferences. This information helps us manage your reservations and improve our service.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Payment Information</strong> To facilitate secure 
                      transactions, we collect payment information, including credit card details, billing address, 
                      and payment history. This data is processed securely and used solely for booking and payment purposes.


                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Communications</strong> We may collect data 
                      from your interactions with our platform, including messages, reviews, and feedback. 
                      This helps us enhance your experience and address any concerns.


                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Technical and Device Information</strong> We collect information 
                      about your device, browser, IP address, and operating system. This data assists us in ensuring platform security, 
                      compatibility, and functionality.

                    </span>
                  </li>
                          
                </ul>


                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">  Data Sharing</h2>
                <p className="mt-6">
                We value your trust, and we are committed to maintaining the privacy of your 
                data. Shrbo does not sell, rent, or trade your personal information to 
                third parties. However, to provide you with our services, we may share your data with the following parties:

                </p>
                <ul role="list" className="mt-8 space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Hosts </strong>If you make a booking, we share your reservation 
                      information with the host of the property you've booked. This ensures a smooth check-in process and enables 
                      hosts to prepare for your stay.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Service Providers</strong> We engage service providers, 
                      such as payment processors and customer support tools, to facilitate our platform's functionality. 
                      These providers may access your data only as needed to perform their services.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Legal Obligations</strong> We may disclose 
                      your information to comply with legal obligations, such as responding to court orders, 
                      government requests, and law enforcement inquiries.



                    </span>
                  </li>
                 
                          
                </ul>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Data Security</h2>
                <p className="mt-6">
                We employ strict security measures to protect your data and ensure its confidentiality. 
                This includes encryption, regular security audits, and access controls. However, 
                no data transmission or storage system can be guaranteed 100% secure. 
                While we take every precaution to protect your data, we cannot guarantee absolute security.

                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900"> Cookies and Tracking Technologies</h2>
                <p className="mt-6">
                Our platform uses cookies and similar tracking technologies to improve user experience 
                and analyze usage patterns. Cookies are small data files that are stored on your 
                device. By using our platform, you consent to the use of these cookies for the 
                purposes of improving functionality, understanding user behavior, and delivering targeted content.


                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Your Privacy Choices</h2>
                <p className="mt-6">
                You have choices regarding the data you provide to us:
                </p>
                <ul role="list" className="mt-2 space-y-3 text-gray-600">
                  <li className="flex gap-x-3">
                    {/* <CloudArrowUpIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Account Information: </strong>You can review and 
                      update your account information in the account settings. You can also delete your account at any time.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <LockClosedIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Communications:</strong> You can choose 
                      to opt out of promotional communications at any time by following the unsubscribe instructions in our emails.

                    </span>
                  </li>
                  <li className="flex gap-x-3">
                    {/* <ServerIcon className="mt-1 h-5 w-5 flex-none text-indigo-600" aria-hidden="true" /> */}
                    <span>
                      <strong className="font-semibold text-gray-900">Cookies:</strong> Most browsers 
                      allow you to control and manage cookies. You can modify your browser settings to accept or reject cookies.




                    </span>
                  </li>
                 
                          
                </ul>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Children's Privacy</h2>
                <p className="mt-6">
                Our platform is not intended for users under the age of 18. We do not knowingly collect 
                information from children. If we become aware that we have collected personal data from 
                a child without parental consent, we will take appropriate steps to delete such information.


                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Updates to Privacy Policy</h2>
                <p className="mt-6">
                We may update this Privacy Policy from time to time to reflect changes in our practices. 
                You will be notified of any significant changes, and we encourage you to review the policy periodically.

                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Contact Us</h2>
                <p className="mt-6">
                If you have questions or concerns about your privacy, this Privacy Policy, or your data, please 
                contact us at shortletbookingltd@gmail.com.


                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Data Access and Correction</h2>
                <p className="mt-6">
                We believe in transparency and your right to access and correct your data. If you wish to access, 
                correct, or update any of your personal information, please log in to your Shrbo account and make the 
                necessary changes. If you encounter any difficulties in accessing or editing your data, our customer support 
                team is ready to assist you. We will respond to your request within a reasonable timeframe to ensure that your 
                data is accurate and up to date.



                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Data Retention</h2>
                <p className="mt-6">
                We retain your data for as long as necessary to fulfill the purposes outlined in this Privacy 
                Policy, unless a longer retention period is required by law or regulation. Inactive accounts 
                may be subject to data deletion after an extended period of inactivity to ensure we maintain a streamlined platform.



                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Third-Party Links</h2>
                <p className="mt-6">
                Our platform may contain links to third-party websites and services. While we strive to maintain 
                the highest standards of data security and privacy, we cannot guarantee the practices of these third parties. 
                We recommend reviewing the privacy policies of any linked sites to ensure your data is handled in a manner 
                that aligns with your expectations.




                </p>


                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">International Data Transfer</h2>
                <p className="mt-6">
                By using Shrbo, you acknowledge and consent to your data being transferred and stored internationally. 
                Your data may be processed in countries that have different data protection laws. We take all necessary 
                measures to ensure your data remains secure and is handled in accordance with this Privacy Policy.

                </p>


                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Changes to This Policy</h2>
                <p className="mt-6">
                We will update this Privacy Policy periodically to reflect changes in our practices and 
                comply with evolving data protection laws. When we make significant changes, you will be notified. 
                We encourage you to review this policy regularly to stay informed about how we are protecting your data.

                </p>

                <h2 className=" mt-8  text-2xl font-semibold tracking-tight text-gray-900">Contact Us</h2>
                <p className="mt-6">
                If you have questions or concerns about your privacy, this Privacy Policy, or your data, 
                please do not hesitate to contact us at shortletbookingltd@gmail.com. Your privacy matters to us, 
                and we are committed to maintaining the security and confidentiality of your data while delivering exceptional 
                short-term accommodation experiences.


                </p>








                <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900"></h2>
                <p className="mt-6">
                By using Shrbo, you agree to the terms outlined in this Privacy Policy. Your trust is vital to us, 
                and we are committed to maintaining the privacy and security of your data while providing you with 
                exceptional short-term accommodation experiences. Thank you for choosing Shrbo for your accommodation needs.


                </p>
              </div>
            </div>
          </div>
        </div>    
      </div>
      <Footer/>
        </div>
    )
  }
  