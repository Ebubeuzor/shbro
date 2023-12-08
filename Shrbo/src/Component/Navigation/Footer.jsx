import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="hidden md:block bg-gray-900 text-white p-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-base font-bold mb-4">Contact and Support</h2>
            <p className='text-sm'>Email: info@shortletbooking.com</p>
            <p className='text-sm'>Telephone: +2347080646809</p>
            <p className='text-sm'>Address: 18, Akpera Oshi Close, Works And Housing Estate, 3rd Avenue Gwarinpa, Abuja, FCT, Nigeria</p>
          </div>
          <div>
            <h2 className="text-base font-bold mb-4">About Us</h2>
            <ul>
              <li className='text-sm'><Link to="/aboutus">About Shbro</Link></li>
              <li className='text-sm'><Link to="/SupportAndHelp">Customer Support and Information</Link></li>
              <li className='text-sm'><Link to="/ContactSupport">Help Center</Link></li>
              <li className='text-sm'><Link to="/CancellationPolicy">Cancellation options</Link></li>
              <li className='text-sm'><Link to="/FAQAccordion">Frequently Asked Questions (FAQ)</Link></li>
              <li className='text-sm'><Link to="/HostHomes">Shrbo Your Space</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-base font-bold mb-4">Legal and Policy Links</h2>
            <ul>
       
              <li className='text-sm'><Link to="/TermsofService">Terms of Service</Link></li>
              <li className='text-sm'><Link to="/PrivacyPolicy">Privacy policy</Link></li>
            </ul>
          </div>
        </div>

        
      </div>
      <div className="text-center">
        <img src={Logo} className="w-20 h-20 mx-auto" alt="Shbro Logo" />
        <div className="mt-4  space-x-5">
          <Link to="https://twitter.com/your-twitter-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="1x" className="text-white mr-2" />
          </Link>
          <Link to="https://facebook.com/your-facebook-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="1x" className="text-white mr-2" />
          </Link>
          <Link to="https://instagram.com/your-instagram-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="1x" className="text-white" />
          </Link>
        </div>
        <p className='mt-10 text-sm'>&copy; 2023 Shrbo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
