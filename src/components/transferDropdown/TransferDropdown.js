import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useState } from 'react';

export default function TransferDropdown() {
    const { accountsArr } = useDash();
    const [fromAccount, setfromAccount] = useState("Choose Account");

    const items = accountsArr.map(a => {
        return {
            label: a.name,
            key: a.accountId,
        };
    });


    const onClick = ({ key }) => {

        const acc = items.find(a => a.key === key);

        setfromAccount(acc.label);

    };
    
    return (
        <Dropdown
            menu={{
                items,
                onClick
            }}
        >
            <p onClick={(e) => e.preventDefault()}>
            <Button>
                <Space>
                    {fromAccount}
                    <DownOutlined />
                </Space>
            </Button>
            </p>
        </Dropdown>
    );
}
