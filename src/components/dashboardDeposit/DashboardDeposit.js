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
import DashboardDepositCardComponent from '../dashboardDepositFlipCard/DashboardDepositCardComponent';
import CardDepositPng from '../../assests/images/card-deposit.png';
import TransferDepositPng from '../../assests/images/transfer-deposit.png';
import DashboardDepositFlipCardCheckout from '../dashboardDepositFlipCard/DashboardDepositFlipCardCheckout';


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

  const [flipCardState, setFlipCardState] = useState(null);

  const handleCardComponentChange = async (data) => {

    setFlipCardState(data);

  };

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

      setmodalMessage(['Invalid Amount', "Please enter a valid amount in the following format: '0.00'"]);
      setModalVisible(true);
    }
    else {
      setAmount(Number(newAmount));
    }
  };

  const handleFromAccountSelect = (acc) => {

    console.log(acc);

    setFromAccount(acc);

  };

  // const handleOk = () => {
  //   setModalVisible(false);
  //   if (modalMessage[1] === 'Please enter a positive amount.' ||
  //     modalMessage[1] === "Please enter a valid amount in the following format: 'X.XX'."
  //   ) {
  //     form.resetFields(['amount']);
  //   }

  // };

  const handleCancel = () => {

    setModalVisible(false);
    if (modalMessage[1] === 'Please enter a positive amount.' ||
      modalMessage[1] === "Please enter a valid amount in the following format: '0.00'"

    ) {
      form.resetFields(['amount']);
    }
  };

  const validateData = (item, regex) => {

    if (!flipCardState) {
      return false;
    }

    console.log(item);
    console.log(regex);

    let result = regex.test(item);


    return result;

  };

  const handleContinueToCheckoutClick = async () => {

    const values = await form.validateFields();

    console.log(values);

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

    if (depositType === 'card') {

      if (!validateData(flipCardState.cardNumber, /^(\d{4}\s){3}\d{4}$/)) {
        setmodalMessage(['Invalid Information', 'Please enter your full card number.']);
        setModalVisible(true);
        return;
      }
      if (!validateData(flipCardState.cardHolder, /^\s*[a-zA-Z]+\s+[a-zA-Z]+(\s+[a-zA-Z]+)?\s*$/)) {
        setmodalMessage(['Invalid Information', 'Please enter your full names.']);
        setModalVisible(true);
        return;
      }
      if (!validateData(flipCardState.cardCvv, /^[0-9]{3,4}$/)) {
        setmodalMessage(['Invalid Information', 'Please enter your CVV code.']);
        setModalVisible(true);
        return;
      }
      if (values && flipCardState) {
        setCurrentStep(1);
        setConfirmationData({ ...flipCardState, amount: values.amount, depositType }, () => {
          console.log(confirmationData);
        });
      }
    }
    else if (values) {



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
        // onOk={handleOk}
        onCancel={handleCancel}
        title={modalMessage[0]}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            OK
          </Button>,
          // <Button key="ok" type="primary" onClick={handleOk}>
          //   OK
          // </Button>,
        ]}
      >
        {modalMessage[1]}
      </Modal>

      {currentStep === 0 && (<div className='da-deposit-form-details'>
        <Form className='da-ant-form' form={form} onFinish={handleContinueToCheckoutClick}>
          <h3>Deposit Form</h3>

          <Form.Item className='da-ant-form-item' name="depositType" initialValue="card">
            <Radio.Group onChange={handleDepositTypeChange} value={depositType}>
              <Radio className='da-radio da-card-radio' value="card">
                <img src={CardDepositPng} alt="Credit/Debit Card" />
              </Radio>
              <Radio className='da-radio da-transfer-radio' value="account">
                <img src={TransferDepositPng} alt="Transfer" />
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item className='da-amount-wrapper' name="amount">
            <Input className='da-enter-amount' type="number" name="amount" placeholder="Please enter your Deposit amount" value={amount} onChange={handleAmountChange} />
          </Form.Item>



          {depositType === 'card' && (
            <>

              <DashboardDepositCardComponent
                onChange={handleCardComponentChange}

              ></DashboardDepositCardComponent>
            </>
          )}

          {depositType === 'account' && (
            <Form.Item className='da-transfer-dropdown'>
              <TransferDropdown onSelect={handleFromAccountSelect} currentAcc={fromAccount}></TransferDropdown>
            </Form.Item>
          )}

          <Form.Item className='da-ant-form-item'>
            <Button className='da-btn da-checkout-btn' type="primary" htmlType="submit">
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
              <Form.Item className='da-ant-form-item da-checkout-info'>
              <div className='da-checkout-img-div'>
              {depositType === 'card' ?
                  <img src={CardDepositPng} alt="Credit/Debit Card" /> :
                  <img src={TransferDepositPng} alt="Transfer" />
                }
              </div>
                <div className='da-checkout-amount'>{`${Number(confirmationData.amount).toFixed(2)} BGN`}</div>
              </Form.Item>
              {confirmationData.depositType === 'card' && (
                <>
                  <DashboardDepositFlipCardCheckout
                    cardNumber={confirmationData.cardNumber}
                    cardHolder={confirmationData.cardHolder}
                    cardMonth={confirmationData.cardMonth}
                    cardYear={confirmationData.cardYear}
                    cardCvv={confirmationData.cardCvv}
                  >
                  </DashboardDepositFlipCardCheckout>
                </>
              )}
              {confirmationData.depositType === 'account' && (

                <Form.Item className='da-ant-form-item da-checkout-info'>
                  <div className='da-checkout-from-acc'>From Account:</div>
                  {fromAccount.label}

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

