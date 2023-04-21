import { Select, Modal, Form, Input, Spin, Button } from 'antd';
import { useEffect, useState } from 'react';
import AlertMessage from '../alertMessage/AlertMessage';
import { isValidNumber } from '../../assests/utils/validations';
import "./newExpenseModal.scss";
import ExpenseResult from './expenseResult/ExpenseResult';
const { Option } = Select;

export default function NewExpenseModal({ open, onCancel, category, onSubmit, serverResult, }) {
  const [amount, setAmount] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [delay, setDelay] = useState('none');

  const onAmountChange = (e) => {
    const amountInput = Number(e.target.value);
    if (isValidNumber(amountInput) && amountInput >= 0) {
      setAmount(e.target.value);
      isError && setIsError(false);
    } else {

    }
  }

  useEffect(() => {
    return () => {
      setAmount(0);
      setDelay('none');
    }
  }, [open]);


  const handleOk = async () => {
    if (isValidNumber(amount) && amount > 0) {
      isError && setIsError(false);
      setIsLoading(true);
      
      const result = await onSubmit(Number(amount), delay);
      setIsLoading(false);


    } else {
      setIsError(true)
    }
  };

  const handleSelect = async (value) => {

    await setDelay(value);

  }

  return (
    <Modal
      open={open}
      title="New Expense"
      onCancel={onCancel}
      width={"600px"}
      footer={
        serverResult ?
          []
          :
          [
            <Button key="cancel" onClick={onCancel}>
              Cancel
            </Button>
          ]
      }
    >
      <Spin spinning={isLoading}>
        {serverResult
          ?
          // serverResult.ok ? "Success" : "Failed"
          <ExpenseResult ok={serverResult.ok} message={serverResult.message} onCancel={onCancel} />

          :
          <>
            <p className='ft-expense-category'>Expense Category: <span className='ft-expense-category-name'>{category}</span></p>
            <p className='ft-expense-costs'>Cost Amount: <span className='ft-expense-category-value'>{amount || 0} BGN</span></p>


            <div className='ft-div-line'></div>
            <Form layout="vertical" className="ft-new-expense-form">
              {isError && <AlertMessage className="alert-expense" description={"Invalid Amount. Please enter a positive numeric value."} />}

              <Form.Item label="Delay">
                <Select value={delay} className="ft-delay" onChange={handleSelect}>
                  <Option value="none">None</Option>
                  <Option value="one-week">One Week</Option>
                  <Option value="one-month">One Month</Option>
                </Select>
              </Form.Item>
              <Form.Item className='ft-expense-amount-item' rules={[{ required: true, message: 'Please enter an amount' }]}
              >
                <label className='label-cost-amount'>Enter Your Cost: </label>
                <Input type="text" className="ft-expense-amount-input" value={amount} onChange={onAmountChange} />
                <p>BGN</p>
              </Form.Item>
              <Button type="primary" onClick={handleOk} className='ft-expense-pay-btn'>Pay</Button>
            </Form>
          </>
        }
      </Spin>

    </Modal>
  );
};
