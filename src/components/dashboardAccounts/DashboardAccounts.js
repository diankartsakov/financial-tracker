import { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';
import AccountsDrowpdown from '../accountDropdown/AccountsDropdown';
import DashboardAccountCard from '../DashboardAccountCard/DashboardAccountCard';
import './DashboardAccounts.scss';

function NewAccountModal({ onCreate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      // console.log(values);
      onCreate(values);
      hideModal();
      form.resetFields();
    });
  };

  return (
    <>
      <Button className='da-btn' type="primary" onClick={showModal}>Add Account</Button>
      <Modal
        open={isModalOpen}
        title="Create New Account"
        okText="Create"
        onCancel={hideModal}
        onOk={handleCreate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="accountName"
            label="Account Name"
            rules={[{ required: true, message: 'Please enter an account name' }]}
          >
            <Input placeholder="Enter account name" />
          </Form.Item>
        </Form>
      </Modal>
    </>

  );
}

export default function DashboardAccounts() {
  const [isAccountAdd, setIsAccountAdd] = useState(true);
  const { authUser: { uid } } = useAuth();
  const {
    accountsArr,
    currentAccountName,
    updateAccountId,
    updateAccountsArr,
    updateCurrentAccountName
  } = useDash();

  const handleCreateAccount = async (values) => {
    console.log('Creating account with name:', values.accountName);
    // handle create account logic here
    const accountId = await accountManager.addAccount(values.accountName, uid);
    const newAcc = { name: values.accountName, amount: 0, accountId };

    const arr = accountsArr;
    arr.push(newAcc);

    updateAccountsArr(arr);
    setIsAccountAdd(true);
  };

  const handleAccountSelect = (account) => {

    updateCurrentAccountName(account.label);
    updateAccountId(account.key);

  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1>{currentAccountName ? currentAccountName : "No Accounts"} </h1>
        </div>
        {accountsArr.length ?
          <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
            <AccountsDrowpdown accountName={currentAccountName} onSelect={handleAccountSelect} accountAdded={{ isAccountAdd, setIsAccountAdd }} />
            <NewAccountModal onCreate={handleCreateAccount} />
          </div>
          :
          <div>
            <NewAccountModal onCreate={handleCreateAccount} />
          </div>
            }

      </div>
      <DashboardAccountCard ></DashboardAccountCard>
    </>);
}





