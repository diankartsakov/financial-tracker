import {  DownOutlined, SmileOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';

export default function AccountsDrowpdown({accountName, onSelect, accountAdded: {isAccountAdd}, accountAdded: {setIsAccountAdd}}) {
    const {isLoaded, accountsArr, accountId } = useDash();
    const [items, setItems] = useState(accountsArr);
    
    useEffect(() => {
        const items = accountsArr.map(a => {
            return {
                label: a.name,
                key: a.accountId,
            };
        }).filter(acc => acc.key !== accountId);

        setItems(items);
        setIsAccountAdd(false);
    }, [accountsArr, accountId, isAccountAdd, isLoaded]);

    const onClick = ({key}) => {
        const acc = items.find(a => a.key === key);

        if (acc) {
            onSelect(acc);
        }
        
    };

    return (
        <Dropdown
            menu={
                accountsArr.length > 1 
                ? {
                items,
                onClick
                }
                :
                {
                    items: [{label: <p style={{fontSize: "18px", padding: "0px", margin:"0px",}}><SmileOutlined></SmileOutlined> No Other Accounts</p>}]
                } 
            }
            // menu={{
            // items,
            // onClick,
            // }}
        >
            <p onClick={(e) => e.preventDefault()}>
            <Button>
                <Space>
                    {accountName || "Choose Account"}
                    <DownOutlined />
                </Space>
            </Button>
            </p>
        </Dropdown>
    );
}
