import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Button } from "antd";
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

export default function CategoryFormModal({categoryName="Create Category"}) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
      setModalOpen(true);
    };
  
    const handleClose = () => {
      setModalOpen(false);
    };

  return (
    <>
      <Button type="primary" onClick={handleOpen}>
          Add Category
      </Button>
      <Modal 
      title="Add Category"
      open={modalOpen}
      onCancel={handleClose}
      okButtonProps={{ style: { display: 'none' } }}
      width="600px">
        <div className="category-modal">
          <h2>{categoryName}</h2>
          <CategorySettings onCancel={handleClose}/>
        </div>
      </Modal>    
    </>
  );
}
  
  
  
  
  
  