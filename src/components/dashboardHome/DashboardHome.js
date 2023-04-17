
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useEffect, useState } from "react";
import { Skeleton } from 'antd';
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";
import { getTotalBalance } from "../../assests/utils/dashboardUtils";
import { Link } from 'react-router-dom';
import LogarithmicBarChart from "../accountsDonutChart/accountsDonutChart";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";

export default function DashboardHome() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        accountId,
        accountsIds,
        accountsArr,
        currentAccountName,
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
                            <ProfileCardInfo className="ft-profile-card" title="Current Account" content={<Link to={"accounts"}>{currentAccountName}</Link>}/>
                            <ProfileCardInfo className="ft-profile-card" title="Total Accounts" content={<p>{accountsArr.length}</p>}/>
                            <ProfileCardInfo className="ft-profile-card" title="Total Balance"
                            content={<p>{getTotalBalance(accountsArr).toFixed(2)} BGN</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Total Balance"
                            content={<p>{getTotalBalance(accountsArr).toFixed(2)} BGN</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Total Balance"
                            content={<p>{getTotalBalance(accountsArr).toFixed(2)} BGN</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Total Balance"
                            content={<p>{getTotalBalance(accountsArr).toFixed(2)} BGN</p>}/>
                            
                            
                            {/* <p>Is Loaded DashContext: {isLoaded ? "true" : "false"}</p>
                            <p>Current AccountID: {accountId ? accountId : `${accountId}`}</p>
                            <p>Account IDS: {accountsIds?.length ? accountsIds.join(", ") : "[]"}</p>
                            {accountsArr.map(acc => {
                                return (
                                    <p key={acc.accountId}>{acc.name} with balance: {acc.amount}</p>
                                )
                            })}  
                            <p>Total balance: {totalBalance.toFixed(2)}BGN</p>  */}
                        </div>
                        <div className="donut-wrapper">
                            {accountsArr?.length === 0 ? <div>No Accounts</div> : <LogarithmicBarChart/>}
                        </div>
                    </div>
                }           
            </div>
        </>
    );
}