import React, { useState } from 'react';
import { Form, Input, Radio, Select, Button } from 'antd';
import { Row, Col } from 'react-bootstrap';

const { Option } = Select;

export default function DashboardDeposit () {
  const [depositType, setDepositType] = useState('card');

  const handleDepositTypeChange = e => {
    setDepositType(e.target.value);
  };

  const handlePayButtonClick = () => {
    // Handle payment logic here
  };

  return (
    <Form onFinish={handlePayButtonClick}>
      <Form.Item label="Amount">
        <Input type="number" name="amount" />
      </Form.Item>

      <Form.Item label="Deposit Type">
        <Radio.Group onChange={handleDepositTypeChange} value={depositType}>
          <Radio value="card">Card Deposit</Radio>
          <Radio value="account">Transfer from Account Deposit</Radio>
        </Radio.Group>
      </Form.Item>

      {depositType === 'card' && (
        <>
          <Row>
            <Col xs={12} sm={6}>
              <Form.Item label="Card Number">
                <Input type="number" name="cardNumber" />
              </Form.Item>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Item label="Expiration Date">
                <Input type="text" name="expirationDate" placeholder="MM/YY" />
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
          <Select name="accountId">
            <Option value="1">Account 1</Option>
            <Option value="2">Account 2</Option>
            <Option value="3">Account 3</Option>
          </Select>
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

