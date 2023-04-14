import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Button } from "antd";
import AlertMessage from "../alertMessage/AlertMessage";

export default function CategoryFormModal({onSubmit, setCategories, categoryName="Create Category"}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState("");
    console.log("from fm")
    const handleOpen = () => {
      setModalOpen(true);
    };
  
    const handleClose = () => {
      setError("");
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
          {error && <AlertMessage message="error" type="error" description={error.error}/>}
          <CategorySettings onCancel={handleClose} onSubmit={onSubmit} setCategorries={setCategories} onError={{setError}}/>
        </div>
      </Modal>    
    </>
  );
}
  
  
  
  
  
  