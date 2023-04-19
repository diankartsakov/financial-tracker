import { Outlet, Link, useLocation} from "react-router-dom";
// import AccountsDrowpdown from "../accountDropdown/AccountsDropdown";
import { getUserAccountsTransactions } from '../../services/firebaseFirestoreAccounts';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useReport } from "./DashboardReportsProvider";
import { useEffect } from "react";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";
import { getExpenses } from "../../assests/utils/dataGenerator";
import ReportsDropdown from "../reportsDropdown/ReportsDropdown";

export default function DashboardReports() {
    const {currentAccountName, accountId, accountsIds} = useDash();
    const {
        isLoaded,
        reportAccount,
        transactions,
        isLoadedUpdate,
        updateTransactionsArr,
        updateReportAccount,
    } = useReport();

    useEffect(() => {
        if (isLoaded) {
            console.log("Loaded already");
        } else {
            console.log("effect start");
            const reports = async () => {
                // const userTransactions = await getUserAccountsTransactions(accountsIds);
                const userTransactions = getExpenses(25);
                console.log(userTransactions);
                updateReportAccount({
                    reportAccountId: accountId,
                    reportAccountName: currentAccountName,
                });
                updateTransactionsArr(userTransactions);
                console.log("effect middle");
                isLoadedUpdate(true);
            }

            reports().then();

            console.log("effect end" );
        }
    });

    const location = useLocation().pathname
                        .split("/")
                        .slice(1);

    const currentLocation = location[2] || location[1];

    return (
        <>
            <h2>Reports</h2>
            { 
                currentLocation === "reports"
            ?
                <div className="ft-report-cards">
                    <Link to="history"  style={{
                        display: "inline-block",
                        width: "200px", border: "3px solid black",
                    }}><ProfileCardInfo title="History"/></Link>
                </div>
            :
                <>
                    <h2>Hello</h2>
                    <ReportsDropdown/>
                    <Outlet/>                
                </>
            }
        </>
    )
}