import { Modal, Form, Input, Button } from 'antd';
import { useState } from 'react';
import AlertMessage from '../alertMessage/AlertMessage';
import { isValidNumber } from '../../assests/utils/validations';

export default function NewExpenseModal({ open, onCancel, category, onSubmit }) {
    const [amount, setAmount] = useState("");
    const [isError, setIsError] = useState(false);

    const onAmountChange = (e) => {
        const amountInput = e.target.value;
        if (isValidNumber(amountInput) && amountInput > 0) {
            setAmount(e.target.value);
            isError && setIsError(false);
        } else {
            setIsError(true)
        }
    }

    const handleOk = () => {
    onSubmit(amount);
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
      <Form layout="vertical">
        {isError && <AlertMessage description={"Invalid Amount. Please enter a positive numeric value."}/>}
        <Form.Item label="Category">
          <Input value={category} disabled />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please enter an amount' }]}
        >
          <Input type="number" value={amount} onChange={onAmountChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
