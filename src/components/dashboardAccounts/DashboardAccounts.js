import { useState } from 'react';
import { Modal, Form, Input, Menu, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect } from "react";
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { getUserAccountsFullInfo } from '../../services/firebaseFirestoreAccounts';
import accountManager from '../../services/AccountManager';

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
    const { authUser: { uid } } = useAuth();
    const {
        isLoaded,
        accountsArr,
        isLoadedUpdate,
        updateAccountId,
        updateAccountsArr,
        currentAccountName,
        updateCurrentAccountName
    } = useDash();

    const handleCreateAccount = (values) => {

        console.log(values);
        console.log('Creating account with name:', values.accountName);

        // handle create account logic here

        let arr = accountsArr;
        console.log(arr);

        arr.push(values.accountName);

        updateAccountsArr(arr);

        accountManager.addAccount(values.accountName, uid);
      };

      const handleAccountSelect = (account) => {
        updateCurrentAccountName(account.name);
        updateAccountId(account.accountId);
      };

    // useEffect(() => {
    //     if (isLoaded) {
    //         // console.log("no");
    //     } else {
    //         const accounts = async () => {
    //             const accountsArr = await getUserAccountsFullInfo(uid);

    //             updateAccountsNames(accountsArr);
    //             isLoadedUpdate(true);
    //         };
    //         accounts();

    //     }
    // }, []);

    const getAccountsDropdownMenu = () => {
        return (
            <Menu>
                {accountsArr ? accountsArr.map((account) => {
                    return <Menu.Item key={account.accountId} onClick={() => handleAccountSelect(account)}>
                        {account.name}
                    </Menu.Item>;
                }) :
                    <div></div>
                }
            </Menu>
        );
    };

    return (<>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>{currentAccountName ? currentAccountName : "Accounts"} </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown overlay={getAccountsDropdownMenu}>
                    <Button style={{ marginRight: '8px' }}>
                        Accounts<UserOutlined />
                    </Button>
                </Dropdown>
                <NewAccountModal onCreate={handleCreateAccount}/>
            </div>
        </div>
    </>

    );
}





