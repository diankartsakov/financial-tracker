import { Outlet, Link, useLocation} from "react-router-dom";
import { getUserAccountsTransactions } from '../../services/firebaseFirestoreAccounts';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useReport } from "./DashboardReportsProvider";
import { useEffect } from "react";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";
import { getCardDeposits, getExpenses } from "../../assests/utils/dataGenerator";
import "./dashboardReports.scss";
import { useAuth } from "../../firebase/auth";
import ReportCard from "../reportCard/ReportCard";
import barIMG from "../../assests/images/bar.png"
import pieChartIMG from "../../assests/images/pie.png"
import donutChartIMG from "../../assests/images/donut.png"
import polarAreaIMG from "../../assests/images/polo-area-chart.png"
import historyIMG from "../../assests/images/history-logo.png"

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

                const allTransactions = userTransactions.reduce((acc,value) => {

                    if(value.isFrozen) {
                        acc.frozen.push(value);
                    }
                    else {
                        acc.processed.push(value); 
                    }

                    return acc;
                },{frozen: [], processed: []});

                updateReportAccount({
                    reportAccountId: accountId,
                    reportAccountName: currentAccountName,
                });

                updateTransactionsArr(allTransactions.processed);
                updateFrozenTransactionsArr(allTransactions.frozen);
                isLoadedUpdate(true);
            }

            reports().then();
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
                                <Link to="card-deposit-charts">
                                    <ReportCard img={polarAreaIMG} title="Card Deposit Polar Area"/>
                                </Link>
                        </div>
                        
                        <h2 style={{borderBottom: "5px solid black"}}>EXPENSES</h2>
                            <div className="ft-report-cards-expense">
                                <Link to="pie-chart-expense">
                                    <ReportCard img={pieChartIMG} title="Expense Pie Chart"/>
                                </Link>
                                <Link to="stacked-column-expense">
                                    <ReportCard img={barIMG} title="Expense Bar Chart"/>
                                </Link>
                            </div>

                        <h2 style={{borderBottom: "5px solid black"}}>HISTORY</h2>

                        <Link to="history">
                            <ReportCard img={historyIMG} title="Transaction History"/>

                        </Link>
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