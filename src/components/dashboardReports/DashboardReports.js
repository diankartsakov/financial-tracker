import { Outlet, Link} from "react-router-dom";
// import AccountsDrowpdown from "../accountDropdown/AccountsDropdown";
import { getUserAccountsTransactions } from '../../services/firebaseFirestoreAccounts';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useReport } from "./DashboardReportsProvider";
import { useEffect } from "react";

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
    })

    return (
        <>
            <h2>Reports</h2>
            {/* <AccountsDrowpdown accountName={currentAccountName} onSelect={onSelect} accountAdded={accountAdded}/> */}
            <Link to="history">Transactons History</Link>
            <Outlet/>
        </>
    )
}