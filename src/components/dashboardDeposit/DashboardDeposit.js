import React, { useState } from 'react';
import { Form, Input, Radio, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';
import TransferDropdown from '../transferDropdown/TransferDropdown';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';

export default function DashboardDeposit () {
  const [depositType, setDepositType] = useState('card');
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');

  const { accountId }= useDash();


  const handleDepositTypeChange = e => {
    setDepositType(e.target.value);
  };
  const handleAmountChange = e => {
    setAmount(e.target.value);
  };
  const handleFromAccountChange = e => {
    setFromAccount(e.target.value);
  };

  const handlePayButtonClick = () => {
  
    if(depositType === 'card'){

      accountManager.initiateTransaction(accountId, amount, 'Deposit', 'Card Deposit');

    }else {

      accountManager.initiateTransaction(accountId, amount, 'Transfer', 'Internal Transfer',fromAccount);

    }

  };

  return (
    <Form onFinish={handlePayButtonClick}>
      <Form.Item label="Amount">
        <Input type="number" name="amount" onChange={handleAmountChange}/>
      </Form.Item>

      <Form.Item label="Deposit Type">
        <Radio.Group onChange={handleDepositTypeChange} value={depositType}>
          <Radio value="card">Card Deposit</Radio>
          <Radio value="account">Transfer from Account</Radio>
        </Radio.Group>
      </Form.Item>

      {depositType === 'card' && (
        <>
          <Row>
            <Col xs={12} sm={6}>
              <Form.Item label="Card Number">
                <Input type="text" name="cardNumber" maxLength={16}/>
              </Form.Item>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Item label="Expiration Date">
                <Input type="month" name="expirationDate" placeholder="MM/YY" />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xs={12} sm={6}>
              <Form.Item label="CVV">
                <Input type="number" name="cvv" />
              </Form.Item>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Item label="Card Holder Name">
                <Input type="text" name="cardHolderName" />
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      {depositType === 'account' && (
        <Form.Item label="Account">
          <TransferDropdown value="" onChange= {handleFromAccountChange}></TransferDropdown>
        </Form.Item>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Pay
        </Button>
      </Form.Item>
    </Form>
  );
};

