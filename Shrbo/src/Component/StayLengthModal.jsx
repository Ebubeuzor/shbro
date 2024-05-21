import React from 'react';
import { Modal } from 'antd';

const StayLengthModal = ({ message, visible, onClose }) => {
  return (
    <Modal
      title="Stay Length"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <p>{message}</p>
    </Modal>
  );
};

export default StayLengthModal;
