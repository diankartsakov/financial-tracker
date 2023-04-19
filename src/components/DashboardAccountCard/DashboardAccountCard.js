import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { getAccount } from '../../services/firebaseFirestoreAccounts';
import { Link } from 'react-router-dom';
import './DashboardAccountCard.scss';

export default function DashboardAccountCard({ currency = 'BGN', }) {
    const { accountId, accountsArr, currentAccountName } = useDash();
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const [frozenBalance, setfrozenBalance] = useState(0);
    const [accountName, setAccountName] = useState('');

    useEffect(() => {

        if (accountsArr?.length) {
            const accountUpdate = accountsArr.find(acc => accountId === acc.accountId);
            // console.log("update");
            setBalance(accountUpdate.amount);
            setAccountName(accountUpdate.name);
            setfrozenBalance(accountUpdate.frozenAmount);
        }
    }, [accountId]);


    return (
        <>
            {
                accountsArr?.length && accountId
                    ?
                    <div className='da-account-form-details'>
                        <Card className='da-account-form-card'>
                            <div className='da-account-form-balance'>
                                <span className='da-account-form-balance-label'>Available:</span>
                                <span className='da-account-form-balance-value'>{`${balance.toFixed(2)} ${currency}`}</span>
                            </div>

                            <div className='da-account-form-balance-frozen'>
                                <span className='da-account-form-balance-frozen-label'>Frozen:</span>
                                <span className='da-account-form-balance-frozen-value'>{`${frozenBalance.toFixed(2)} ${currency}`}</span>
                            </div>
                            <div className='da-account-form-name'>{accountName}</div>
                            <div className='da-account-form-buttons'>
                                <Link to="/dashboard/deposit">
                                    <Button className='da-btn' type="primary" >Deposit</Button>
                                </Link>

                                <Link to="/dashboard/expense">
                                    <Button className='da-btn' type="primary" >Expense</Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                    :
                    <div className='da-account-form-no-account'>NO ACCOUNTS. YOU NEEED TO CREATE ONE</div>
            }

        </>

    );
};
