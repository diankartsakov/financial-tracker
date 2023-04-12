import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { getAccount } from '../../services/firebaseFirestoreAccounts';

export default function DashboardAccountCard({ currency = 'BGN' }) {

    const [balance, setBalance] = useState(0);
    
    const {
        
        accountId,
        accountsArr

    } = useDash();

    useEffect (() => {

      const getBalance = async () => {
        const balance = await getAccount(accountId);
        setBalance(balance);
      }

      getBalance();

    },[]);
     
    
    

    console.log(balance + "BALANCE HEREE");
    
    const balanceColor = balance >= 0 ? 'green' : 'red';

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

    const onDepositClick  = () => {

    };
    const onExpenseClick  = () => {

    };
    const onTransferClick  = () => {

    };
    
    return (
      <Card>
        <div style={balanceStyle}>{balance.toFixed(2) + " " + currency}</div>
        <div style={accountNameStyle}>{accountsArr.find(acc => acc.accountId = accountId).name}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <Button type="primary" onClick={onDepositClick}>Deposit</Button>
          <Button type="primary" onClick={onExpenseClick}>Expense</Button>
          <Button type="primary" onClick={onTransferClick}>Transfer</Button>
        </div>
      </Card>
    );
};
