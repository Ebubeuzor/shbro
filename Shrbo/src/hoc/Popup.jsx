import React from 'react';
import { Modal } from 'antd';
import PopupFull from './PopupFull';

const Popup = ({ isModalVisible, handleCancel, children, title, className, centered, width,drawer }) => {
  // console.log('Modal Content:', children);

  return (
    <div>
      {!drawer?<Modal
        title={title}
        open={isModalVisible}
        onCancel={handleCancel}
        className={className}
        centered={centered}
        width={width}
        footer={null}
      >
        <div className=''>
        {children}
        </div>
      </Modal>
      :
      <PopupFull title={title} onClose={handleCancel} open={isModalVisible}>
        <>
       {children}
        </>
      </PopupFull>  
    }
    </div>
  );
};

export default Popup;
