import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Spin } from "antd";
import AlertMessage from "../alertMessage/AlertMessage";

export default function EditCategoryModal({onSubmit, modal: {modalOpen, setModalOpen}, data}) {
    const [resetForm, setResetForm] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
         <Spin spinning={isLoading}>
            <div className="category-modal">
              {error && <AlertMessage message="error" type="error" description={error.error}/>}
              <CategorySettings 
                onCancel={handleClose}
                onSubmit={onSubmit}
                onError={{setError}}
                resetForm={{resetForm, setResetForm}}
                initialData={data}
                setIsLoading={setIsLoading}
              />
            </div>

         </Spin>
      </Modal>    
    </>
  );
}
  
  
  
  
  
  