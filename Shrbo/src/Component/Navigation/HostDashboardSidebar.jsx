import React from 'react';
import { FaHome, FaCalendar, FaBook, FaPlusCircle } from 'react-icons/fa';

export default function HostDashboardSidebar() {
  return (
    <div>
      <ul>
        <li>
          <FaHome />
          <span>Listings</span>
        </li>
        <li>
          <FaCalendar />
          <span>Reservations</span>
        </li>
        <li>
          <FaBook />
          <span>Guidebooks</span>
        </li>
        <li>
          <FaPlusCircle />
          <span>Create a New Listing</span>
        </li>
      </ul>
    </div>
  );
}
