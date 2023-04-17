import React, { useState } from 'react';
import { Form, Input, Radio, Button, Modal, Steps } from 'antd';
import TransferDropdown from '../transferDropdown/TransferDropdown';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';
import { getUserAccountsFullInfo } from '../../services/firebaseFirestoreAccounts';
import { useAuth } from '../../firebase/auth';
import './DashboardDeposit.scss';


export default function DashboardDeposit() {
  const [depositType, setDepositType] = useState('card');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setmodalMessage] = useState([]);
  const [confirmationData, setConfirmationData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const { accountId, currentAccountName, accountsArr, updateAccountsArr } = useDash();
  const { authUser: { uid } } = useAuth();

  const handleDepositTypeChange = e => {
    setDepositType(e.target.value);
  };

  const handleAmountChange = e => {
    const newAmount = e.target.value;
    if (newAmount < 0) {
      setmodalMessage(['Invalid Amount', 'Please enter a valid amount.']);
      setModalVisible(true);
    } else {
      setAmount(newAmount);
    }
  };

  const handleFromAccountSelect = (acc) => {
    setFromAccount(acc);
  };

  const handleOk = () => {
    setModalVisible(false);
    if (modalMessage[1] === 'Please enter a valid amount.') {
      form.resetFields(['amount']);
    }

  };

  const handleCancel = () => {
    setModalVisible(false);
    if (modalMessage[1] === 'Please enter a valid amount.') {
      form.resetFields(['amount']);
    }
  };

  const handleContinueToCheckoutClick = async () => {

    const values = await form.validateFields();

    if (!values.amount) {
      setmodalMessage(['Invalid Amount', 'Please enter a valid amount.']);
      setModalVisible(true);
      return;
    }


    if (depositType !== 'card' && !fromAccount) {
      setmodalMessage(['Missing Information', 'Please select From Account.']);
      setModalVisible(true);
      return;

    }
    console.log(values);

    if (values) {
      setCurrentStep(1);
      setConfirmationData(values);
      
    }
  }; 

  const handlePayButtonClick = async () => {

    let result = {}; 

    if (depositType === 'card') {
        result = await accountManager.initiateTransaction(currentAccountName, accountId, amount, 'Deposit', 'Card Deposit');

    } else {

        if (!fromAccount) {
          setmodalMessage(['Missing Information','Please select From Account.']);
          setModalVisible(true);
          return;
        }

        result = await accountManager.initiateTransaction(currentAccountName, accountId, amount, 'Transfer', 'Internal Transfer', fromAccount);
    }

    console.log(result);
    const accountsFullInfo = await getUserAccountsFullInfo(uid);
    updateAccountsArr(accountsFullInfo);
  };

  return (
    <>
      <Steps
        size="small"
        current={currentStep}
        items={[
          {
            title: 'Select Deposit Option',
          },
          {
            title: 'Confirm Transaction',
          },
          {
            title: 'Successful Transaction',
          },
        ]}
      />
      <Modal
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        title={modalMessage[0]}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        {modalMessage[1]}
      </Modal>

      {currentStep === 0 && (<div className='deposit-form-details'>
        <Form form={form} onFinish={handleContinueToCheckoutClick}>
          <h3>Deposit Form</h3>
          <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Please enter a valid amount' }]}>
            <Input type="number" name="amount" onChange={handleAmountChange} />
          </Form.Item>

          <Form.Item label="Deposit Type" name="depositType" initialValue="card">
            <Radio.Group onChange={handleDepositTypeChange} value={depositType}>
              <Radio value="card">Card Deposit</Radio>
              <Radio value="account">Transfer from Account</Radio>
            </Radio.Group>
          </Form.Item>

          {depositType === 'card' && (
            <>

              <Form.Item label="Card Number" name="cardNumber" rules={[{ required: true, message: 'Please enter a valid card number' }]}>
                <Input type="text" maxLength={16} />
              </Form.Item>

              <Form.Item label="Expiration Date" name="expirationDate" rules={[{ required: true, message: 'Please enter a valid expiration date' }]}>
                <Input type="month" name="expirationDate" placeholder="MM/YY" />
              </Form.Item>



              <Form.Item label="CVV" name="cvv" rules={[{ required: true, message: 'Please enter a valid CVV' }]}>
                <Input type="number" name="cvv" />
              </Form.Item>



              <Form.Item label="Card Holder Name" name="cardHolderName" rules={[{ required: true, message: 'Please enter your full names.' }]}>
                <Input type="text" name="cardHolderName" />
              </Form.Item>
            </>
          )}

          {depositType === 'account' && (
            <Form.Item label="From Account">
              <TransferDropdown onSelect={handleFromAccountSelect} currentAcc = {fromAccount}></TransferDropdown>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Continue to Checkout
            </Button>
          </Form.Item>
        </Form>
      </div>)}
      {currentStep === 1 && (
        <div className='deposit-form-details'>
          <Form 
          //onFinish={()=>{}}
          >
            <Form.Item><h3>Confirm Transaction Details</h3></Form.Item>
            <Form.Item>Amount: {`${Number(confirmationData.amount).toFixed(2)} BGN`}</Form.Item>
            <Form.Item><p>Deposit Type: {confirmationData.depositType}</p></Form.Item>

            {confirmationData.depositType === 'card' && (
              <>
                <Form.Item>
                  <p>Card Number: {confirmationData.cardNumber}</p>
                </Form.Item>
                <Form.Item>
                  <p>Expiration Date: {confirmationData.expirationDate}</p>

                </Form.Item>
                <Form.Item>
                  <p>CVV: {confirmationData.cvv}</p>

                </Form.Item>
                <Form.Item>
                  <p>Card Holder Name: {confirmationData.cardHolderName}</p>
                </Form.Item>

              </>
            )}
            {confirmationData.depositType === 'account' && (

              <Form.Item>
                <p>From Account: {fromAccount.label}</p>
              </Form.Item>

            )}
            <Form.Item>

              <Button type="secondary" onClick={() => setCurrentStep(0)}>
                Back
              </Button>
              <Button type="secondary" onClick={handlePayButtonClick}>
                Confirm Payment
              </Button>

            </Form.Item>
          </Form>
        </div>

      )}

    </>
  );
};

