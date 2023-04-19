import { Outlet, Link, useLocation} from "react-router-dom";
// import AccountsDrowpdown from "../accountDropdown/AccountsDropdown";
import { getUserAccountsTransactions } from '../../services/firebaseFirestoreAccounts';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useReport } from "./DashboardReportsProvider";
import { useEffect } from "react";
import ProfileCardInfo from "../profileCardInfo/ProfileCardInfo";

export default function DashboardReports() {
    const {currentAccountName, accountId, accountsIds} = useDash();
    const {
        isLoaded,
        reportAccountName,
        reportAccountId,
        transactions,
        updateReportAccountId,
        isLoadedUpdate,
        updateTransactionsArr,
        updateCurrentReportAccountName,
    } = useReport();

    useEffect(() => {
        if (isLoaded) {
            console.log("Loaded already");
        } else {
            console.log("effect start");
            const reports = async () => {
                const userTransactions = await getUserAccountsTransactions(accountsIds);
                
                updateReportAccountId(accountId);
                updateTransactionsArr(userTransactions);
                updateCurrentReportAccountName(currentAccountName);
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
                    <Outlet/>                
                </>
            }
        </>
    )
}