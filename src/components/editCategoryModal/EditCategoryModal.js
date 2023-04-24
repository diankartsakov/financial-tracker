import React, { useState } from 'react';
import CategorySettings from '../categorySettings/CategorySettings';
import { Modal, Spin, Result, Button } from "antd";
import { SmileOutlined } from '@ant-design/icons';
import AlertMessage from "../alertMessage/AlertMessage";

export default function EditCategoryModal({onSubmit, modal: {modalOpen, setModalOpen}, data}) {
    const [resetForm, setResetForm] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleClose = () => {
      setError("");
      setResetForm(true);
      setIsCompleted(false);
      setModalOpen(false);
    };

  return (
    <>
      <Modal 
      title="Edit Category"
      open={modalOpen}
      onCancel={handleClose}
      onOk={handleClose}
      width="600px"
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleClose} style={{ marginRight: 8, display: isCompleted ? "none": "flex" }}>Cancel</Button>
          <Button type="primary" onClick={handleClose} style={{ display: isCompleted ? "flex" : "none" }}>OK</Button>
        </div>
      }
      >
         <Spin spinning={isLoading}>
            {
                isCompleted
                    ?
                        <Result
                            icon={<SmileOutlined />}
                            title="Congratulations, your expense category has been successfully edited!"
                        />
                    :
                        <div className="category-modal">
                            {error && <AlertMessage message="error" type="error" description={error.error}/>}
                            <CategorySettings 
                                onCancel={handleClose}
                                onSubmit={onSubmit}
                                onError={{setError}}
                                resetForm={{resetForm, setResetForm}}
                                initialData={data}
                                setIsLoading={setIsLoading}
                                setIsCompleted={setIsCompleted}
                                formType="Edit"
                            />
                        </div>
            }

         </Spin>
      </Modal>    
    </>
  );
}
  
  
  
  
  
  