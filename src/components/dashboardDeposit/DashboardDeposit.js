import React, { useState } from 'react';
import { Form, Input, Radio, Button, Modal, Steps, Result } from 'antd';
import TransferDropdown from '../transferDropdown/TransferDropdown';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';
import { getUserAccountsFullInfo } from '../../services/firebaseFirestoreAccounts';
import { useAuth } from '../../firebase/auth';
import { Spin } from 'antd';
import './DashboardDeposit.scss';
import { Link } from 'react-router-dom';
import { isValidNumber } from '../../assests/utils/validations';

export default function DashboardDeposit() {
  const [depositType, setDepositType] = useState('card');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setmodalMessage] = useState([]);
  const [confirmationData, setConfirmationData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [successfulTransaction, setSuccessfulTransaction] = useState({});
  const [form] = Form.useForm();

  const { accountId, currentAccountName, accountsArr, updateAccountsArr } = useDash();
  const { authUser: { uid } } = useAuth();

  const handleDepositTypeChange = e => {
    setDepositType(e.target.value);
  };

  const handleAmountChange = e => {
    const newAmount = e.target.value;

    if (newAmount < 0) {
      setmodalMessage(['Invalid Amount', 'Please enter a positive amount.']);
      setModalVisible(true);
    } else if (!isValidNumber(newAmount) && e.target.value.length !== 0) { // if the input does not match the regex

      setmodalMessage(['Invalid Amount', "Please enter a valid amount in the following format: 'X.XX'."]);
      setModalVisible(true);
    }
    else {
      setAmount(Number(newAmount));
    }
  };

  const handleFromAccountSelect = (acc) => {

    setFromAccount(acc);
  };

  const handleOk = () => {
    setModalVisible(false);
    if (modalMessage[1] === 'Please enter a positive amount.' ||
      modalMessage[1] === "Please enter a valid amount in the following format: 'X.XX'."
    ) {
      form.resetFields(['amount']);
    }

  };

  const handleCancel = () => {
    setModalVisible(false);
    if (modalMessage[1] === 'Please enter a positive amount.' ||
      modalMessage[1] === "Please enter a valid amount in the following format: 'X.XX'."

    ) {
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
    // console.log(values);



    if (values) {
      setCurrentStep(1);
      setConfirmationData(values);

    }
  };

  const handlePayButtonClick = async () => {


    const accountObj = accountsArr.find(el => el.accountId === accountId);

    console.log(accountId);
    console.log(accountsArr);
    console.log(accountObj);


    setIsLoading(true);

    let result = {};

    if (depositType === 'card') {
      result = await accountManager.initiateTransaction(accountObj, amount, 'Deposit', 'Card Deposit');

    } else {

      if (!fromAccount) {
        setmodalMessage(['Missing Information', 'Please select From Account.']);
        setModalVisible(true);
        setIsLoading(false);
        return;
      }

      const fromAccountObj = accountsArr.find(el => el.accountId === fromAccount.key);

      console.log(fromAccount);
      console.log(accountsArr);
      console.log(fromAccountObj);

      result = await accountManager.initiateTransaction(accountObj, amount, 'Transfer', 'Internal Transfer', fromAccountObj);
    }

    // console.log(result);
    const accountsFullInfo = await getUserAccountsFullInfo(uid);
    updateAccountsArr(accountsFullInfo);
    setSuccessfulTransaction(result);
    setIsLoading(false);
    setCurrentStep(2);

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

      {currentStep === 0 && (<div className='da-deposit-form-details'>
        <Form className='da-ant-form' form={form} onFinish={handleContinueToCheckoutClick}>
          <h3>Deposit Form</h3>
          <Form.Item className='da-ant-form-item' label="Amount" name="amount"
            rules={[
              {
                required: true,
                message: 'Please enter a valid amount'
              }
            ]}
          >
            <Input type="number" name="amount" value={amount} onChange={handleAmountChange} />
          </Form.Item>

          <Form.Item className='da-ant-form-item' label="Deposit Type" name="depositType" initialValue="card">
            <Radio.Group onChange={handleDepositTypeChange} value={depositType}>
              <Radio value="card">Card Deposit</Radio>
              <Radio value="account">Transfer from Account</Radio>
            </Radio.Group>
          </Form.Item>

          {depositType === 'card' && (
            <>

              <Form.Item className='da-ant-form-item' label="Card Number" name="cardNumber"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid card number',
                    pattern: /^\d{16}$/

                  }
                ]}
              >
                <Input type="number" maxLength={16} />
              </Form.Item>

              <Form.Item className='da-ant-form-item' label="Expiration Date" name="expirationDate"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid expiration date',
                  }
                ]}>

                <Input type="month" name="expirationDate" placeholder="MM/YY" />
              </Form.Item>



              <Form.Item className='da-ant-form-item' label="CVV" name="cvv"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a valid CVV',
                    pattern: /^[0-9]{3}$/
                  }
                ]}
              >
                <Input type="number" name="cvv" />
              </Form.Item>



              <Form.Item className='da-ant-form-item' label="Card Holder Names" name="cardHolderName"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your full name',
                    pattern: /^\s*[a-zA-Z]+\s+[a-zA-Z]+(\s+[a-zA-Z]+)?\s*$/,
                    max: 25,
                    whitespace: true,
                  }
                ]}
              >
                <Input type="text" name="cardHolderName" />
              </Form.Item>
            </>
          )}

          {depositType === 'account' && (
            <Form.Item className='da-ant-form-item' label="From Account">
              <TransferDropdown onSelect={handleFromAccountSelect} currentAcc={fromAccount}></TransferDropdown>
            </Form.Item>
          )}

          <Form.Item className='da-ant-form-item'>
            <Button className='da-btn' type="primary" htmlType="submit">
              Continue to Checkout
            </Button>
          </Form.Item>
        </Form>
      </div>)}
      {currentStep === 1 && (
        <div className='da-deposit-form-details'>

          <Spin spinning={isLoading}>
            <Form className='da-ant-form'
            //onFinish={()=>{}}
            >
              <Form.Item className='da-ant-form-item'><h3>Confirm Transaction Details</h3></Form.Item>
              <Form.Item className='da-ant-form-item'>Amount: {`${Number(confirmationData.amount).toFixed(2)} BGN`}</Form.Item>
              <Form.Item className='da-ant-form-item'><p>Deposit Type: {confirmationData.depositType}</p></Form.Item>

              {confirmationData.depositType === 'card' && (
                <>
                  <Form.Item className='da-ant-form-item'>
                    <p>Card Number: {confirmationData.cardNumber}</p>
                  </Form.Item>
                  <Form.Item className='da-ant-form-item'>
                    <p>Expiration Date: {confirmationData.expirationDate}</p>

                  </Form.Item >
                  <Form.Item className='da-ant-form-item'>
                    <p>CVV: {confirmationData.cvv}</p>

                  </Form.Item>
                  <Form.Item className='da-ant-form-item'>
                    <p>Card Holder Names: {confirmationData.cardHolderName}</p>
                  </Form.Item>

                </>
              )}
              {confirmationData.depositType === 'account' && (

                <Form.Item className='da-ant-form-item'>
                  <p>From Account: {fromAccount.label}</p>
                </Form.Item>

              )}
              <Form.Item className='da-ant-form-item'>

                <Button className='da-btn' type="primary" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button className='da-btn' type="primary" onClick={handlePayButtonClick}>
                  Confirm Payment
                </Button>

              </Form.Item>
            </Form>
          </Spin>
        </div>

      )}
      {currentStep === 2 && !successfulTransaction.error && (
        <>
          <Result
            status="success"
            title="Transaction Processed Successfully !"
            subTitle={successfulTransaction.message}
            extra={[
              <Link key='successGoToAccLink' to='/dashboard/accounts'>
                <Button className='da-btn' type="primary" key='successGoToAcc'>Go To Accounts</Button>
              </Link>,
              <Link key='successGoToReportsLink' to='/dashboard/reports'>
                <Button className='da-btn' type="primary" key='successGoToReports'>Go To Reports</Button>
              </Link>,
            ]}
          >
          </Result>

        </>
      )}
      {currentStep === 2 && successfulTransaction.error && (
        <Result
          status="error"
          title="Submission Failed"
          subTitle={successfulTransaction.message}
          extra={[
            <Link to='/dashboard/accounts'>
              <Button className='da-btn' type="primary" key='failedGoToAcc'>Go To Accounts</Button>
            </Link>,
            <Button className='da-btn' type="primary" key='failedTryAgain' onClick={() => { setCurrentStep(0); }}>Try Again</Button>
          ]}
        >
        </Result>
      )}

    </>
  );
};

