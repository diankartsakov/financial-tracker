import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';
import { useReport } from '../dashboardReports/DashboardReportsProvider';

export default function ReportsDropdown() {
    const { accountsArr } = useDash();
    const { reportAccount, updateReportAccount } = useReport();

    const items = accountsArr.map(a => {
        return {
            label: a.name,
            key: a.accountId,
        };
    }).filter(e => e.key !== reportAccount.reportAccountId);

    const onClick = ({ key }) => {
        const acc = items.find(a => a.key === key);
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
