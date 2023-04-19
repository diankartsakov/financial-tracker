import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useState } from 'react';
import { useReport } from '../dashboardReports/DashboardReportsProvider';

export default function ReportsDropdown() {
    const { accountId, accountsArr } = useDash();
    const { reportAccount, updateReportAccount } = useReport();
    console.log(reportAccount);
    // const [fromAccount, setfromAccount] = useState(props.currentAcc? props.currentAcc :'Choose Account');

    const items = accountsArr.map(a => {
        return {
            label: a.name,
            key: a.accountId,
        };
    }).filter(e => e.key !== accountId);

    const onClick = ({ key }) => {
        const acc = items.find(a => a.key === key);
        // console.log(acc);
        updateReportAccount({
            reportAccountId: acc.key,
            reportAccountName: acc.label,
        });
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
                    {reportAccount.reportAccountName}
                    <DownOutlined />
                </Space>
            </Button>
            </p>
        </Dropdown>
    );
}
