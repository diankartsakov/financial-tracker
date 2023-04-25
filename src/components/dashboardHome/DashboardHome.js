
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useEffect, useState } from "react";
import { Empty, Skeleton } from 'antd';
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";
import expenseIMG from "../../assests/images/expense-logo.png";
import reportsIMG from "../../assests/images/reports-logo.png";
import amountIMG from "../../assests/images/accounts-logo.png";

import { getTotalBalance, getTotalFrozenBalance } from "../../assests/utils/dashboardUtils";
import { Link } from 'react-router-dom';
import AccountsDonutChart from "../accountsDonutChart/accountsDonutChart";

export default function DashboardHome() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        accountsArr,
    } = useDash();
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate] = useState(getDateWithSuffixDay());

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <>
            <div className="dashboard-wrapper">
                <div className="dashboard-greeting">
                    <h1 className="dashboard-greeting-greet">Welcome back, {email}! </h1>
                    <p className="dashboard-greeting-date">{currentDate}</p>
                </div>
                {isLoading 
                ?
                <>
                    <Skeleton active />
                </>

                :
                    <div className="content-wrapper">
                        <div className="intro">
                            <div className="intro-amount" style={{display: "flex", flexDirection: "row"}} >
                                <div className="card-info">
                                    <h2 className="card-info-title">Accounts Amount</h2>
                                    <p className="card-info-amount">{getTotalBalance(accountsArr).toFixed(2)} BGN</p>
                                </div>
                                <div className="donut-wrapper">
                                {accountsArr?.length === 0 || getTotalBalance(accountsArr) === 0? (
                                    <>
                                    <div className="ft-donut-no-accounts">
                                        <Empty />
                                    </div>
                                    </>
                                ) : (
                                    <AccountsDonutChart frozen={false} />
                                )}
                                </div>
                            </div>
                            <div className="intro-amount" style={{display: "flex", flexDirection: "row"}} >
                                <div className="card-info"> 
                                    <h2 className="card-info-title">Accounts Frozen Amount</h2>
                                        <p className="card-info-frozen-amount">{getTotalFrozenBalance(accountsArr).toFixed(2)} BGN</p>
                                </div>
                                <div className="donut-wrapper">
                                    {   accountsArr?.length === 0 || getTotalFrozenBalance(accountsArr) === 0  ? 
                                    <>
                                        <div className="ft-donut-no-accounts"><Empty/></div>
                                    </>
                                    : 
                                        <AccountsDonutChart frozen={true}/>
                                    }
                                </div>
                            </div>
                        </div>
                       
                            <div className="accounts-data">
                                <div className="card-link-wrapper">
                                    <div className="profile-card-expense">
                                        <div className="profile-card-expense-text">
                                            <Link to="reports">
                                                <p>GO TO</p>
                                                <h2>REPORTS</h2>
                                            </Link>
                                        </div>
                                        <div className="profile-card-expense-image-wrapper">
                                            <img src={reportsIMG} alt=""/>
                                        </div>
                                    </div>
                                    <div className="profile-card-expense">
                                        <div className="profile-card-expense-text profile-card-expense-text-accounts">
                                            <Link to="accounts">
                                                <p>GO TO</p>
                                                <h2>ACCOUNTS</h2>
                                            </Link>
                                        </div>
                                        <div className="profile-card-expense-image-wrapper">
                                            <img src={amountIMG} alt=""/>
                                        </div>
                                    </div>
                                    <div className="profile-card-expense">
                                        <div className="profile-card-expense-text profile-card-expense-text-expense">
                                            <Link to="expense">
                                                <p>GO TO</p>
                                                <h2>EXPENSE</h2>
                                            </Link>
                                        </div>
                                        <div className="profile-card-expense-image-wrapper">
                                            <img src={expenseIMG} alt=""/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                    </div>
                    
                }           
            </div>
        </>
    );
}