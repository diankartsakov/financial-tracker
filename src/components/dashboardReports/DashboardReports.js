import { Outlet, Link, useLocation} from "react-router-dom";
import { getUserAccountsTransactions } from '../../services/firebaseFirestoreAccounts';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useReport } from "./DashboardReportsProvider";
import { useEffect } from "react";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";
import { getCardDeposits, getExpenses } from "../../assests/utils/dataGenerator";
import "./dashboardReports.scss";
import { useAuth } from "../../firebase/auth";

export default function DashboardReports() {
    const { currentAccountName, accountId, accountsIds, accountsArr } = useDash();
    const {
        isLoaded,
        reportAccount,
        // transactions,
        isLoadedUpdate,
        updateTransactionsArr,
        updateFrozenTransactionsArr,
        updateReportAccount,
    } = useReport();
    const { authUser: { uid } } = useAuth();

    useEffect(() => {
        if (!isLoaded) {
            const reports = async () => {
                let userTransactions = [];

                // console.log(uid);
                if (uid !== "Sf7dfJALVqh4Xa9yOTYmviMQXFl2") {
                    // FROM FIREBASE
                    // console.log("firebase");
                    // console.log(accountsIds);
                    const currentAccountIds = accountsArr.map(acc => acc.accountId) || [];
                    // console.log(currentAccountIds);
                    userTransactions = await getUserAccountsTransactions(currentAccountIds);
                } else {
                    // RANDOM
                    const userExpenses = getExpenses(75);
                    const userDeposits = getCardDeposits(75);
                    userTransactions = [...userExpenses, ...userDeposits];
                }
                
      
                // console.log(userTransactions);

                const allTransactions = userTransactions.reduce((acc,value) => {

                    if(value.isFrozen) {
                        acc.frozen.push(value);
                    }
                    else {
                        acc.processed.push(value); 
                    }

                    return acc;
                },{frozen: [], processed: []});

                // console.log(allTransactions);
                updateReportAccount({
                    reportAccountId: accountId,
                    reportAccountName: currentAccountName,
                });
                // updateTransactionsArr(userTransactions);
                updateTransactionsArr(allTransactions.processed);
                updateFrozenTransactionsArr(allTransactions.frozen);
                // console.log("effect middle");
                isLoadedUpdate(true);
            }

            reports().then();

            // console.log("effect end" );
        }
    });

    const location = useLocation().pathname
                        .split("/")
                        .slice(1);

    const currentLocation = location[2] || location[1];

    return (
        <>
            <h2 className="ft-title-reports">Reports</h2>
            { 
                currentLocation === "reports"
            ?
                <>
                    <div className="ft-report-cards">
                        <h2 style={{borderBottom: "5px solid black"}}>DEPOSIT, TRANSFER & INCOME</h2>
                        <div className="ft-report-cards-expense">
                                <Link to="card-deposit-charts"  style={{
                                    display: "inline-block",
                                    width: "200px", border: "3px solid black",
                                }}><ProfileCardInfo title="Card Deposit Charts"/></Link>
                                {/* <Link to="stacked-column-expense"  style={{
                                    display: "inline-block",
                                    width: "200px", border: "3px solid black",
                                }}><ProfileCardInfo title="Stacked Column Expense"/></Link> */}
                        </div>
                        
                        <h2 style={{borderBottom: "5px solid black"}}>EXPENSES</h2>
                            <div className="ft-report-cards-expense">
                                <Link to="pie-chart-expense"  style={{
                                    display: "inline-block",
                                    width: "200px", border: "3px solid black",
                                }}><ProfileCardInfo title="Pie Chart Expense"/></Link>
                                <Link to="stacked-column-expense"  style={{
                                    display: "inline-block",
                                    width: "200px", border: "3px solid black",
                                }}><ProfileCardInfo title="Stacked Column Expense"/></Link>
                            </div>

                        <h2 style={{borderBottom: "5px solid black"}}>HISTORY</h2>

                        <Link to="history"  style={{
                            display: "inline-block",
                            width: "200px", border: "3px solid black",
                        }}><ProfileCardInfo title="History"/></Link>
                    </div>
                
                </>
            

            :
                <>
                    <h2 className="ft-title-reports">Current Account: {reportAccount.reportAccountName}</h2>
                    {/* <ReportsDropdown/> */}
                    <Outlet/>                
                </>
            }
        </>
    )
}