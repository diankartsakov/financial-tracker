import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';

export default function AccountsDrowpdown({accountName, onSelect, accountAdded: {isAccountAdd}, accountAdded: {setIsAccountAdd}}) {
    const [items, setItems] = useState([]);
    const {isLoaded, accountsArr } = useDash();
    
    useEffect(() => {
        if (isLoaded && isAccountAdd) {
            const items = accountsArr.map(a => {
                return {
                    label: a.name,
                    key: a.accountId,
                }
            });
            setItems(items);
            setIsAccountAdd(false);
        }
    });

    const onClick = ({ key }) => {
        const acc = accountsArr.find(a => a.accountId === key);
        onSelect(acc);
    };

    return (
        <Dropdown
            menu={{
            items,
            onClick,
            }}
        >
            <a onClick={(e) => e.preventDefault()}>
            <Button>
                <Space>
                    {accountName || "Choose Account"}
                    <DownOutlined />
                </Space>
            </Button>
            </a>
        </Dropdown>
    );
}
