import {  DownOutlined  } from '@ant-design/icons';
import {  Dropdown, Space, Button } from  "antd";
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { useEffect, useState } from 'react';
import { SmileOutlined } from '@ant-design/icons';
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
        <>
            {
                accountsArr.length !== 0
                ?
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
                :
                <p style={{fontSize: "18px",}}>No Linked Accounts</p>
            }
        
        
        </>
    )
    
    // return (
    //     <Dropdown
    //         menu={{
    //             items,
    //             onClick
    //         }}
    //     >
    //         <p onClick={(e) => e.preventDefault()}>
    //         <Button>
    //             <Space>
    //                 {reportAccount.reportAccountName}
    //                 <DownOutlined />
    //             </Space>
    //         </Button>
    //         </p>
    //     </Dropdown>
    // );
}
