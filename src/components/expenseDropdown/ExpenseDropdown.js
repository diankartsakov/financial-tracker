import { useDash } from "../../pages/dashboardPage/DashboardProvider"
import "./expenseDropdown.scss";
import moneyIMG from "../../assests/images/amount-logo.png"
import { Dropdown, Button, Space, } from "antd";
import {  DownOutlined  } from '@ant-design/icons';

export default function ExpenseDropdown() {
    const {accountsArr, accountId, currentAccountName, updateAccountId, updateCurrentAccountName } = useDash();

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

    const items = accountsArr.map(acc => {
        return {
            label: createOption(acc),
            key: acc.accountId,
        }
    }).filter(e => e.key !== accountId);

    const onClick = ({ key }) => {
        const acc = accountsArr.find(a => a.accountId === key);

        updateAccountId(acc.accountId);
        updateCurrentAccountName(acc.name);

    };

    return (
        <Dropdown
        menu={{
            items,
            onClick
        }}
        className="expense-dropdown"
        >
            <div onClick={(e) => e.preventDefault()}>
            <Button className="expense-dropdown-button">
                <Space>
                    {currentAccountName || "No Account" }
                    <DownOutlined />
                </Space>
            </Button>
            </div>
        </Dropdown>
     )
}