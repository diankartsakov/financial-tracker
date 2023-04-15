import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Button } from "antd";
import AlertMessage from "../alertMessage/AlertMessage";

export default function EditCategoryModal({onSubmit, modal: {modalOpen, setModalOpen}, data}) {
    const [resetForm, setResetForm] = useState(false);
    const [error, setError] = useState("");
    console.log(data);
    const handleClose = () => {
      setError("");
      setResetForm(true);
      setModalOpen(false);
    };

  return (
    <>
      <Modal 
      title="Edit Category"
      open={modalOpen}
      onCancel={handleClose}
      okButtonProps={{ style: { display: 'none' } }}
      width="600px">
        <div className="category-modal">
          {error && <AlertMessage message="error" type="error" description={error.error}/>}
          <CategorySettings 
            onCancel={handleClose}
            onSubmit={onSubmit}
            onError={{setError}}
            resetForm={{resetForm, setResetForm}}
            initialData={data}
          />
        </div>
      </Modal>    
    </>
  );
}
  
  
  
  
  
  