
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useEffect, useState } from "react";
import { Empty, Skeleton, Row, Col } from 'antd';
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";
import { getCurrentAccountBalance, getTotalBalance, getTotalFrozenBalance } from "../../assests/utils/dashboardUtils";
import { Link } from 'react-router-dom';
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
                    <div className="intro">
                        <div className="intro-amount" style={{display: "flex", flexDirection: "row"}} >
                              <div className="card-info">
                                 <h2 className="card-info-title">Overall Amount</h2>
                                 <p className="card-info-amount">{getTotalBalance(accountsArr).toFixed(2)} BGN</p>
                             </div>
                             <div className="donut-wrapper">
                             {accountsArr?.length === 0 ? (
                                 <>
                                <h2 className="ft-donut-no-accounts-heading">Accounts Amount</h2>
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
                                 <h2 className="card-info-title">Overall Frozen Amount</h2>
                                    <p className="card-info-frozen-amount">{getTotalFrozenBalance(accountsArr).toFixed(2)} BGN</p>
                            </div>
                            <div className="donut-wrapper">
                                {   accountsArr?.length === 0 ? 
                                <>
                                    <h2 className="ft-donut-no-accounts-heading">Accounts Frozen Amount</h2>
                                     <div className="ft-donut-no-accounts"><Empty/></div>
                                 </>
                                : 
                                    <AccountsDonutChart frozen={true}/>
                                }
                            </div>
                        </div>
                    </div>
                    
                }           
            </div>
        </>
    );
}