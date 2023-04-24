import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { SmileOutlined } from '@ant-design/icons';
import { Modal, Button, Spin, Result } from "antd";
import AlertMessage from "../alertMessage/AlertMessage";
import "./categoryFormModal.scss"

export default function CategoryFormModal({onSubmit, categoryName="Create Category"}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [resetForm, setResetForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const [error, setError] = useState("");

    const handleOpen = () => {

      setModalOpen(true);
    };
    
    const handleClose = () => {
      setError("");
      setIsCompleted(false);
      setResetForm(true);
      setModalOpen(false);
    };

    return (
        <>
        <Button type="primary" className="da-btn add-category-button" onClick={handleOpen}>
            Add Category
        </Button>
        <Modal 
        title={categoryName}
        open={modalOpen}
        onCancel={handleClose}
        onOk={handleClose}
        width="600px"
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} style={{ marginRight: 8, display: isCompleted ? "none": "flex" }}>Cancel</Button>
            <Button type="primary" onClick={handleClose} style={{ display: isCompleted ? "flex" : "none" }}>OK</Button>
          </div>}
        >
            <Spin spinning={isLoading}>
                {isCompleted 
                    ?
                    <Result
                    icon={<SmileOutlined />}
                    title="Congratulations, your expense category has been successfully created!"
                    />
                    :
                    <div className="category-modal">
                        {error && <AlertMessage message="error" type="error" description={error.error}/>}
                        <CategorySettings 
                            onCancel={handleClose}
                            onSubmit={onSubmit}
                            onError={{setError}}
                            resetForm={{resetForm, setResetForm}}
                            setIsLoading={setIsLoading}
                            setIsCompleted={setIsCompleted}
                            formType="Create"
                        />
                    </div>

                    
                }
            </Spin>
        </Modal>    
        </>
  );
}
  
  
  
  
  
  