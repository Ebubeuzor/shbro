import React, { useState } from 'react';
import { Modal, Button, Dropdown, Space  } from "antd";

const Popup = ({ isModalVisible, handleCancel, children ,title , className,centered,width}) => {
  
  return(
    <div>
        
        <Modal
            title={title}
            open={isModalVisible}
            onCancel={handleCancel}
            // footer={null}
            classNames={className}
            centered={centered}
            width={width}
            
           
        > 
          {children}
        </Modal>

    </div>
);
};

export default Popup;



