import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Result } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';
import AccountsDrowpdown from '../accountDropdown/AccountsDropdown';
import DashboardAccountCard from '../DashboardAccountCard/DashboardAccountCard';
import './DashboardAccounts.scss';

function NewAccountModal({ onCreate, isFirst=false, setIsNoAccounts }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsNoAccounts(true)
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      setIsComplete(true);
      form.resetFields();
    });
  };

  return (
    <>
      <Button className='da-btn add-account-button' type="primary" onClick={showModal}>{isFirst ? "Create Account" : "Add Account"}</Button>
      <Modal
        open={isModalOpen}
        title="Create New Account"
        okText="Create"
        onCancel={hideModal}
        // onOk={handleCreate}
        footer={
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={hideModal} style={{ marginRight: 8, display: isComplete ? "none": "flex" }}>Cancel</Button>
              <Button onClick={handleCreate} style={{ marginRight: 8, display: isComplete ? "none": "flex" }}>Create</Button>
              <Button type="primary" onClick={hideModal} style={{ display: isComplete ? "flex" : "none" }}>OK</Button>
            </div>
          }
      >
        {isComplete ?
        <Result
            icon={<SmileOutlined />}
            title="Congratulations, your account has been successfully created!"
        />
        :
        <Form form={form} layout="vertical">
          <Form.Item
            className='da-acc-create-form-input'
            name="accountName"
            label="Account Name"
            rules={[
              { 
                required: true, 
                message: 'Please enter an account name' 
              },
              {
                max: 15,
                message: "Valid name is from 1 to 15 characters",
              },
              {
                pattern: /^(?=.*[a-zA-Z])[a-zA-Z\s]{1,15}$/,
                message: 'Valid name is from 1 to 15 characters, only Latin letters are allowed.'
              }
          ]}
          >
            <Input width='' maxLength={15} placeholder="Enter account name" />
          </Form.Item>
        </Form>
        }
      </Modal>
    </>

  );
}

export default function DashboardAccounts() {
  const [isAccountAdd, setIsAccountAdd] = useState(true);
  const [isNoAccounts, setIsNoAccounts] = useState(true);
  const { authUser: { uid } } = useAuth();
  const {
    accountsArr,
    currentAccountName,
    updateAccountId,
    updateAccountsArr,
    updateCurrentAccountName,
    updateAccountsIds,
  } = useDash();


  useEffect(() => {

    if(!accountsArr?.length) {
        setIsNoAccounts(false);
    }
  });

  const handleCreateAccount = async (values) => {
    const accountId = await accountManager.addAccount(values.accountName.trim(), uid);
    const newAcc = { name: values.accountName, amount: '0.00', frozenAmount: '0.00', accountId };

    const arr = accountsArr;
    arr.push(newAcc);
    updateAccountsArr(arr);
    updateAccountId(accountId);
    
    updateCurrentAccountName(newAcc.name);
    setIsAccountAdd(true);
  };

  const handleAccountSelect = (account) => {

    updateCurrentAccountName(account.label);
    updateAccountId(account.key);

  };

  return (
    <>
        {
            accountsArr?.length && isNoAccounts
        ?
        <>
            <div className="dashboard-accounts-header">
                <div className="dashboard-accounts-header-currentAccount">
                <h1>{currentAccountName ? currentAccountName : "No Accounts"} </h1>
                </div>
                {accountsArr.length ?
                <div className="dashboard-accounts-header-options">
                    <AccountsDrowpdown accountName={currentAccountName} onSelect={handleAccountSelect} accountAdded={{ isAccountAdd, setIsAccountAdd }} />
                    <NewAccountModal onCreate={handleCreateAccount}  setIsNoAccounts={setIsNoAccounts}  />
                </div>
                :
                <div>
                    <NewAccountModal onCreate={handleCreateAccount} setIsNoAccounts={setIsNoAccounts} />
                </div>
                    }

            </div>
            <DashboardAccountCard></DashboardAccountCard>
        </>
        :
            <div className='dashboard-no-accounts'>
                <h1 className='dashboard-no-accounts-heading'><span>Oops!</span> Looks like you don't have an account yet.</h1>
                <NewAccountModal onCreate={handleCreateAccount} isFirst={true} setIsNoAccounts={setIsNoAccounts} />
            </div>
        }
    </>);
}





