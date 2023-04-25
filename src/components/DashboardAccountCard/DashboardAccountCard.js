import React, { useEffect, useState } from 'react';
import { Card, Button } from 'antd';
import { useDash } from '../../pages/dashboardPage/DashboardProvider';
import { getAccount } from '../../services/firebaseFirestoreAccounts';
import { Link } from 'react-router-dom';
import './DashboardAccountCard.scss';
import FrozenImg from '../../assests/images/frozen-logo.png';
import AmountImg from '../../assests/images/amount-logo.png';

export default function DashboardAccountCard({ currency = 'BGN', }) {
    const { accountId, accountsArr, currentAccountName } = useDash();
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState('0.00');
    const [frozenBalance, setfrozenBalance] = useState('0.00');
    const [accountName, setAccountName] = useState('');

    useEffect(() => {

        if (accountsArr?.length) {
            const accountUpdate = accountsArr.find(acc => accountId === acc.accountId);
            setBalance(accountUpdate.amount);
            setAccountName(accountUpdate.name);
            setfrozenBalance(accountUpdate.frozenAmount);
        }
    }, [accountId, accountsArr]);


    return (
        <>
            {
                accountsArr?.length && accountId
                    ?
                    <div className='da-account-form-details'>
                        <Card className='da-account-form-card'>
                            <div className='da-account-form-balance'>
                                <img src={AmountImg} alt="Available: "></img>
                                <div className='da-balance-hover'>This is your total available balance.</div>
                                <div className='da-account-form-balance-value'>{`${balance} ${currency}`}</div>
                            </div>

                            <div className='da-account-form-balance-frozen'>
                                <img src={FrozenImg} alt="Frozen: "></img>
                                <div className='da-balance-hover'>This is your total frozen expenses balance.</div>
                                <span className='da-account-form-balance-frozen-value'>{`${frozenBalance} ${currency}`}</span>
                            </div>
                            <div className='da-account-form-name'>{accountName}</div>
                            <div className='da-account-form-buttons'>
                                <Link to="/dashboard/deposit">
                                    <Button className='da-btn account-card-btn' type="primary" >Deposit</Button>
                                </Link>

                                <Link to="/dashboard/expense">
                                    <Button className='da-btn account-card-btn' type="primary" >Expense</Button>
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
