
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useEffect, useState } from "react";
import { Skeleton } from 'antd';
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";
import { getTotalBalance } from "../../assests/utils/dashboardUtils";
import AccountsDonutChart from "../accountsDonutChart/accountsDonutChart";

export default function DashboardHome() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        accountId,
        accountsIds,
        accountsArr,
        isLoaded,
        isLoadedUpdate
    } = useDash();
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate] = useState(getDateWithSuffixDay());
    const [totalBalance, setTotalBalance] = useState(0);

    useEffect(() => {
        const currentTotalBalance = getTotalBalance(accountsArr);
        setTotalBalance(currentTotalBalance);
        setIsLoading(false)
        
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
                    <Skeleton active />
                :
                    <div className="content-wrapper">
                        <div className="content-info-wrapper">
                            <p>Is Loaded DashContext: {isLoaded ? "true" : "false"}</p>
                            <p>Current AccountID: {accountId ? accountId : `${accountId}`}</p>
                            <p>Account IDS: {accountsIds?.length ? accountsIds.join(", ") : "[]"}</p>
                            {accountsArr.map(acc => {
                                return (
                                    <p key={acc.accountId}>{acc.name} with balance: {acc.amount}</p>
                                )
                            })}  
                            <p>Total balance: {totalBalance.toFixed(2)}BGN</p> 
                        </div>
                        <AccountsDonutChart style={{width: "50%"}}/>
                    </div>
                }
                
                        
            </div>
        </>
    );
}