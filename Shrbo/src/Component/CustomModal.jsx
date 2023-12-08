import React from "react";

export default function CustomModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay bg-black opacity-50 absolute inset-0 overflow-auto"></div>
      <div className="modal bg-white rounded-lg p-6 z-10">
        
        <div className="modal-content h-[100vh] w-[100vw] overflow-auto p-10">
        <button
            onClick={onClose}
            className="bg-orange-400 hover:bg-orange-700 text-white py-2 px-4 rounded mt-4"
          >
            Close
          </button>
          {children}
         
        </div>
      </div>
    </div>
  );
}
