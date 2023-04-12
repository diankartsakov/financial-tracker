import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';

export default function AccountsDrowpdown({onSelect, accountAdded: {isAccountAdd}, accountAdded: {setIsAccountAdd}}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [items, setItems] = useState([]);
    const {isLoaded, accountsArr, accountId} = useDash();
   
    useEffect(() => {
        if (isLoaded && isAccountAdd) {
            const items = accountsArr.map(a => {
                return {
                    label: a.name,
                    key: a.accountId,
                }
            });
            setItems(items);
            setSelectedItem(items.find(i => i.key === accountId).label);
            setIsAccountAdd(false);
        }
    });

    const onClick = ({ key }) => {
        const acc = accountsArr.find(a => a.accountId === key);
        setSelectedItem(acc.name);
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
                    {selectedItem ? selectedItem: "Choose Account"}
                    <DownOutlined />
                </Space>
            </Button>
            </a>
        </Dropdown>
    );
}
