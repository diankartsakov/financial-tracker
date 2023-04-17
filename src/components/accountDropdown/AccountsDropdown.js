import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';

export default function AccountsDrowpdown({accountName, onSelect, accountAdded: {isAccountAdd}, accountAdded: {setIsAccountAdd}}) {
    const {isLoaded, accountsArr } = useDash();
    const [items, setItems] = useState(accountsArr);
    
    useEffect(() => {
        // console.log("dropdown render");
        if (isLoaded && isAccountAdd) {
            // console.log("dropdown render2");
            const items = accountsArr.map(a => {
                return {
                    label: a.name,
                    key: a.accountId,
                };
            });

            if (items.length === 0) {
                items.push({
                    label: "Empty Account List",
                    key: "no-acc",
                })
            }

            setItems(items);
            setIsAccountAdd(false);
        }
    }, [accountsArr, isAccountAdd, isLoaded, setIsAccountAdd]);

    const onClick = ({key}) => {
        const acc = items.find(a => a.key === key);

        if (acc) {
            onSelect(acc);
        }
        
    };

    return (
        <Dropdown
            menu={{
            items,
            onClick,
            }}
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
