import { useState } from 'react';
import { Modal, Form, Input, Menu, Dropdown, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useEffect } from "react";
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { getUserAccounts } from "../../services/firebaseFirestoreAccounts";
import accountManager from '../../services/AccountManager';

function NewAccountModal({ visible, onCreate, onCancel }) {
    const [form] = Form.useForm();
  
    const handleCreate = () => {
      form.validateFields().then((values) => {
        onCreate(values);
        form.resetFields();
      });
    };
  
    return (
      <Modal
        visible={visible}
        title="Create New Account"
        okText="Create"
        onCancel={onCancel}
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
    );
  }

export default function DashboardAccounts() {

    const [showModal, setShowModal] = useState(false);

    const handleCreateAccount = (values) => {
        // handle create account logic here
        console.log('Creating account with name:', values.accountName);

        accountManager.addAccount(values.accountName);
        setShowModal(false);
      };
    
      const handleCancelModal = () => {
        setShowModal(false);
      };
    
      const handleShowModal = () => {
        setShowModal(true);
      };

    const { authUser: { uid } } = useAuth();
    const {
        accountId,
        accountsIds,
        isLoaded,
        updateAccountId,
        updateAccountsIds,
        isLoadedUpdate
    } = useDash();

    console.log(accountsIds);



    useEffect(() => {
        if (isLoaded) {
            // console.log("no");
        } else {
            const accounts = async () => {
                const accountsIds = await getUserAccounts(uid);
                const currentAccount = accountsIds[0] || null;

                updateAccountId(currentAccount);
                updateAccountsIds(accountsIds);
                isLoadedUpdate(true);
            };
            accounts();

        }
    }, []);

    const getAccountMenu = () => {
        return (
            <Menu>
                {accountsIds ? accountsIds.map(account => {
                    return <Menu.Item key={account}>
                        {account}
                    </Menu.Item>
                }) :
                    <div></div>
                }
            </Menu>
        );
    };

    return (<>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Accounts</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown overlay={getAccountMenu}>
                    <Button style={{ marginRight: '8px' }}>
                        Account <UserOutlined />
                    </Button>
                </Dropdown>
                <Button type="primary" onClick={handleShowModal}>Add Account</Button>
            </div>
        </div>
        <NewAccountModal visible={showModal} onCreate={handleCreateAccount} onCancel={handleCancelModal} /> 
    </>

    );
}





