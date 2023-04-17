import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { getAccount } from '../../services/firebaseFirestoreAccounts';
import { Link } from 'react-router-dom';

export default function DashboardAccountCard({ currency = 'BGN',  }) {
    const { accountId, accountsArr, currentAccountName } = useDash(); 
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [accountName, setAccountName] = useState('');
    const balanceColor = balance >= 0 ? 'green' : 'red';

    useEffect(() => {

        if (accountsArr?.length) {
            const accountUpdate = accountsArr.find(acc => accountId === acc.accountId);
            // console.log("update");
            setBalance(accountUpdate.amount);
            setAccountName(accountUpdate.name);
        }
    }, [accountId]);

    const balanceStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        color: balanceColor,
        textShadow: `0 0 10px ${balanceColor}`,
        textAlign: 'center',
    };
    const accountNameStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    };

    return (
        <>
        {
            accountsArr?.length && accountId
            ?
            <Card>
            <div style={balanceStyle}>{balance.toFixed(2) + " " + currency}</div>
            <div style={accountNameStyle}>{accountName}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Link to="/dashboard/deposit">
            <Button type="primary" >Deposit</Button>
            </Link>

            <Link to="/dashboard/expense">
                <Button type="primary" >Expense</Button>
            </Link>
            </div>
            </Card>
            : 
            <div>NO ACCOUNTS. YOU NEEED TO CREATE ONE</div>
        }

      </>

    );
};
