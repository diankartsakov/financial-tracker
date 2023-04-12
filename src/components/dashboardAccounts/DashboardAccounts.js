import { useState } from 'react';
import { Modal, Form, Input, Button} from 'antd';
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import accountManager from '../../services/AccountManager';
import AccountsDrowpdown from '../accountDropdown/AccountsDropdown';
import DashboardAccountCard from '../DashboardAccountCard/DashboardAccountCard';

function NewAccountModal({onCreate}) {
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
        console.log(values);
        onCreate(values);
        hideModal();
        form.resetFields();
      });
    };
  
    return (
      <>
        <Button type="primary" onClick={showModal}>Add Account</Button>
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
        isLoaded,
        accountsArr,
        currentAccountName,
        isLoadedUpdate,
        updateAccountId,
        updateAccountsArr,
        updateCurrentAccountName
    } = useDash();

    const handleCreateAccount = async (values) => {
        console.log('Creating account with name:', values.accountName);
        // handle create account logic here
        const accountId = await accountManager.addAccount(values.accountName, uid);
        const newAcc = {name: values.accountName, accountId};
        
        const arr = accountsArr;
        arr.push(newAcc);

        updateAccountsArr(arr);
        setIsAccountAdd(true);
      };

      const handleAccountSelect = (account) => {
        updateCurrentAccountName(account.name);
        updateAccountId(account.accountId);
      };

    return (
    <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>{currentAccountName ? currentAccountName : "Accounts"} </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
              <AccountsDrowpdown onSelect={handleAccountSelect} accountAdded={{isAccountAdd, setIsAccountAdd}}/>
              <NewAccountModal onCreate={handleCreateAccount}/>
            </div>
        </div>
        <DashboardAccountCard></DashboardAccountCard>
    </>);
}





