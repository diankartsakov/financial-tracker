import React, { useState } from 'react';
import { Form, Input, Radio, Button, Modal } from 'antd';
import { Row, Col } from 'react-bootstrap';
import TransferDropdown from '../transferDropdown/TransferDropdown';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';

export default function DashboardDeposit() {
  const [depositType, setDepositType] = useState('card');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setmodalMessage] = useState([]);
  const [form] = Form.useForm();

  const { accountId } = useDash();

  const handleDepositTypeChange = e => {
    setDepositType(e.target.value);
  };

  const handleAmountChange = e => {
    const newAmount = e.target.value;
    if (newAmount < 0) {
      setmodalMessage(['Invalid Amount','Please enter a valid amount.']);
      setModalVisible(true);
    } else {
      setAmount(newAmount);
    }
  };

  const handleFromAccountSelect = (key) => {
    setFromAccount(key);
  };

  const handleOk = () => {
    setModalVisible(false);
    if(modalMessage[1] === 'Please enter a valid amount.'){
      form.resetFields(['amount']);
    }

  };

  const handleCancel = () => {
    setModalVisible(false);
    if(modalMessage[1] === 'Please enter a valid amount.'){
      form.resetFields(['amount']);
    }
  };

  const handlePayButtonClick = () => {
    form.validateFields().then(values => {
      if (!values.amount) {
        setmodalMessage(['Invalid Amount','Please enter a valid amount.']);
        setModalVisible(true);
        return;
      }
      if (depositType === 'card') {
        accountManager.initiateTransaction(accountId, amount, 'Deposit', 'Card Deposit');
      } else {
        if (!fromAccount) {
          setmodalMessage(['Missing Information','Please select From Account.']);
          setModalVisible(true);
          return;
        }
        accountManager.initiateTransaction(accountId, amount, 'Transfer', 'Internal Transfer', fromAccount);
      }
    });
  };

  return (
    <>
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

      <Form form={form} onFinish={handlePayButtonClick}>
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
            <Row>
              <Col xs={12} sm={6}>
                <Form.Item label="Card Number" name="cardNumber" rules={[{ required: true, message: 'Please enter a valid card number' }]}>
                  <Input type="text" maxLength={16} />
                </Form.Item>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Item label="Expiration Date" name="expirationDate" rules={[{ required: true, message: 'Please enter a valid expiration date' }]}>
                  <Input type="month" name="expirationDate" placeholder="MM/YY" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xs={12} sm={6}>
                <Form.Item label="CVV" name="cvv" rules={[{ required: true, message: 'Please enter a valid CVV' }]}>
                  <Input type="number" name="cvv" />
                </Form.Item>
              </Col>

              <Col xs={12} sm={6}>
                <Form.Item label="Card Holder Name" name="cardHolderName" rules={[{ required: true, message: 'Please enter your full names.' }]}>
                  <Input type="text" name="cardHolderName" />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {depositType === 'account' && (
          <Form.Item label="From Account">
            <TransferDropdown onSelect={handleFromAccountSelect}></TransferDropdown>
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Pay
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

