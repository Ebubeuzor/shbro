// CustomModal.js

import React from "react";
import { Button } from "antd";

const ListingsModal = ({ isOpen, onRequestClose, coHosts, handleRemoveCoHost, userEmail }) => {
  console.log("User Email:", userEmail); // Log userEmail

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex justify-center z-50 items-center bg-black bg-opacity-50 ${isOpen ? "" : "hidden"}`}>
      <div className="bg-white md:w-1/2 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">Co-hosts</h2>
        {coHosts.map((cohost) => (
          <div key={cohost.id} className="flex gap-3 justify-between items-center mb-2">
            <span>{cohost.email === userEmail ? `${cohost.email} (you)` : cohost.email}</span>
            <Button type="link" onClick={() => handleRemoveCoHost(cohost.id)}>Remove</Button>
          </div>
        ))}
        <Button className="mt-4" onClick={onRequestClose}>Close</Button>
      </div>
    </div>
  );
};

export default ListingsModal;
