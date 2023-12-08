import React from 'react';

const PopupDrawerComponent = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
   
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
    <div className="modal-overlay bg-black opacity-50 absolute inset-0 overflow-auto"></div>
    <div className="modal bg-white rounded-lg p-6 z-[52]">

      <div className=' border-b items-center pt-2 flex flex-wrap flex-row mt-4 h-20'>
      <button
          onClick={onClose}
          className=" text-white p-4 rounded mt-4 text-center"
        >
         <svg xmlns="http://www.w3.org/2000/svg" width={"25px"} height={"25px"} viewBox="0 0 24 24"><title>window-close</title><path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" /></svg>
        </button>

      
      </div>
      
      <div className="modal-content h-[100vh] w-[100vw] overflow-auto p-6">
      
        {children}
       
      </div>
    </div>
  </div>
  );
};

export default PopupDrawerComponent;
