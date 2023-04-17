import { Modal, Form, Input, Spin, Button } from 'antd';
import { useEffect, useState } from 'react';
import AlertMessage from '../alertMessage/AlertMessage';
import { isValidNumber } from '../../assests/utils/validations';
import "./newExpenseModal.scss";

export default function NewExpenseModal({ open, onCancel, category, onSubmit, serverResult,}) {
    const [amount, setAmount] = useState(0);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onAmountChange = (e) => {
        const amountInput = e.target.value;
        if (isValidNumber(amountInput) && amountInput > 0) {
            setAmount(e.target.value);
            isError && setIsError(false);
        } else {
            setIsError(true)
        }
    }

    useEffect(() => {
        return () => {
            setAmount(0);
        }
    }, [open]);

    
    const handleOk = async () => {
        setIsLoading(true);
        const result = await onSubmit(amount);
        setIsLoading(false);
        console.log(result);
    };

  return (
    <Modal
      open={open}
      title="New Expense"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
        <Spin spinning={isLoading}>
            {serverResult 
            ?
                serverResult.ok ? "Success" : "Failed"

            :

            <Form layout="vertical" className="ft-new-expense-form">
                {isError && <AlertMessage description={"Invalid Amount. Please enter a positive numeric value."}/>}
                <p className='category'>Category: {category}</p>
                <Form.Item
                label="Amount"

                rules={[{ required: true, message: 'Please enter an amount' }]}
                >
                <Input type="number" className="ft-expense-amount" value={amount} onChange={onAmountChange} />
                </Form.Item>
            </Form>
        }
            
        </Spin>
     
    </Modal>
  );
};
