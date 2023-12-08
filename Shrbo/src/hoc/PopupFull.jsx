import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Drawer, Space } from 'antd';

const PopupFull = ({title,onClose,open,children}) => {
 
  return (
    <div className=' '>
      <Drawer
        title={title}
        width={"100%"}
        onClose={onClose}
        open={open}
        stylesBody={{
          paddingBottom: 80,
        }}
      
      >
        {children}
       
      </Drawer>
    </div>
  );
};
export default PopupFull;