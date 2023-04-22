import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Button, Spin } from "antd";
import AlertMessage from "../alertMessage/AlertMessage";

export default function CategoryFormModal({onSubmit, categoryName="Create Category"}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpen = () => {

      setModalOpen(true);
    };
    
    const handleClose = () => {
      setError("");
      setResetForm(true);
      setModalOpen(false);
    };

    return (
        <>
        <Button type="primary" className="da-btn" onClick={handleOpen}>
            Add Category
        </Button>
        <Modal 
        title="Add Category"
        open={modalOpen}
        onCancel={handleClose}
        okButtonProps={{ style: { display: 'none' } }}
        width="600px">
            <Spin spinning={isLoading}>
                <div className="category-modal">
                <h2>{categoryName}</h2>
                {error && <AlertMessage message="error" type="error" description={error.error}/>}
                <CategorySettings 
                    onCancel={handleClose}
                    onSubmit={onSubmit}
                    onError={{setError}}
                    resetForm={{resetForm, setResetForm}}
                    setIsLoading={setIsLoading}
                />
                </div>
            </Spin>
        </Modal>    
        </>
  );
}
  
  
  
  
  
  