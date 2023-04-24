import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useState } from 'react';
import moneyIMG from '../../assests/images/amount-logo.png';
import './transferDropdown.scss'; 

export default function TransferDropdown(props) {
    const { accountId, accountsArr } = useDash();
    const [fromAccount, setfromAccount] = useState(props.currentAcc? props.currentAcc :'Choose Account');

    
    const createOption =  (acc) => {

        return (
            <div className="account-option-wrapper">
                <h2 className="account-option-title">{acc.name}</h2>
                <div className="account-option-amount-wrapper">
                    <img src={moneyIMG} alt="money logo"/>
                    <p>{acc.amount} BGN</p>
                </div>
            </div>
        )
    }
    
    
    
    const items = accountsArr.map(a => {
        return {
            label: createOption(a),
            key: a.accountId,
        };
    }).filter(e => e.key !== accountId);

    const onClick = ({ key }) => {

        const acc = items.find(a => a.key === key);

        setfromAccount(acc);
        props.onSelect(acc);

    };
    
    return (
        <Dropdown
            menu={{
                items,
                onClick
            }}
        >
            <p onClick={(e) => e.preventDefault()}>
            <Button className='da-transfer-dropdown-button'>
                <Space>
                    {fromAccount?.label || fromAccount}
                    <DownOutlined />
                </Space>
            </Button>
            </p>
        </Dropdown>
    );
}
