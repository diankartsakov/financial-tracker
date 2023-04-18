
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useEffect, useState } from "react";
import { Empty, Skeleton } from 'antd';
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";
import { getCurrentAccountBalance, getTotalBalance } from "../../assests/utils/dashboardUtils";
import { Link } from 'react-router-dom';
import LogarithmicBarChart from "../accountsDonutChart/LogarithmicBarChartDemo";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";
import { getUserAccountsTransactionsCounts } from "../../services/firebaseFirestoreAccounts";
import AccountsDonutChart from "../accountsDonutChart/accountsDonutChart";

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
    const [transactionsInfo, setTransactionsInfo] = useState({});

    useEffect(() => {

        const getTransactionsInfo = async() => {
            const info = await getUserAccountsTransactionsCounts(accountsIds);
            const currentTotalBalance = getTotalBalance(accountsArr);
            // console.log(info);
            setTransactionsInfo(info);
            setTotalBalance(currentTotalBalance);
            setIsLoading(false);
        }

        getTransactionsInfo()
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
                        <div className="content-info-wrapper">
                            <ProfileCardInfo className="ft-profile-card" title="Current Account" content={
                                currentAccountName 
                                ?
                                <Link to={"accounts"}>{currentAccountName}</Link>
                                :
                                <p>No current account</p>
                            }/>
                            <ProfileCardInfo className="ft-profile-card" title="Current Account Balance"
                            content={<p>{getCurrentAccountBalance(accountsArr, accountId)?.toFixed(2) || 0} BGN</p>}/>
                            <ProfileCardInfo className="ft-profile-card" title="Overall Accounts Count" content={<p>{accountsArr.length}</p>}/>
                            <ProfileCardInfo className="ft-profile-card" title="Overall Amount"
                            content={<p>{getTotalBalance(accountsArr).toFixed(2)} BGN</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Overall Transactions Count"
                            content={<p>{transactionsInfo.totalCount || 0}</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Overall  Deposits Count"
                            content={<p>{transactionsInfo.deposit || 0}</p>}/>
                            
                            <ProfileCardInfo className="ft-profile-card" title="Overall  Expenses Count"
                            content={<p>{transactionsInfo.expense || 0}</p>}/>
                        </div>
                        <div className="donut-wrapper">
                            {   accountsArr?.length === 0 ? 
                            <>
                                <h2 className="ft-donut-no-accounts-heading">Accounts</h2>
                                <div className="ft-donut-no-accounts"><Empty/></div>
                            </>
                            : 
                                <AccountsDonutChart/>
                            }
                        </div>
                    </div>
                }           
            </div>
        </>
    );
}