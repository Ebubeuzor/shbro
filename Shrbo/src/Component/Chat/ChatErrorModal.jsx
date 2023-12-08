import React from "react";

export default function ChatErrorModal({ isOpen, onClose, errorMessage }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal fixed flex justify-center items-center inset-0 z-50">
      <div
        className="fixed bg-black inset-0 opacity-50 z-10"
        onClick={onClose}
      ></div>
      <div className="modal-content bg-white w-full md:w-1/2 z-50 p-4">
        <header className="flex items-center py-4">
          <div className="mx-auto">
            <h2 className="text-2xl">Error</h2>
          </div>
        </header>
        <div className="p-4">
          <p>{errorMessage}</p>
          <button onClick={onClose} className="bg-orange-500 text-white px-4 py-2 mt-4 rounded-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
