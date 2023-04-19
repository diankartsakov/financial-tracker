import { Outlet, Link} from "react-router-dom";
import AccountsDrowpdown from "../accountDropdown/AccountsDropdown";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";

export default function DashboardReports() {
    const {currentAccountName} = useDash();
    // const onSelect = (acc) => console.log(acc);
    // const accountAdded = {accountAdded: null, isAccountAdd: null}

    return (
        <>
            <h2>Reports</h2>
            {/* <AccountsDrowpdown accountName={currentAccountName} onSelect={onSelect} accountAdded={accountAdded}/> */}
            <Link to="history" data={{data: "test"}}>Transactons History</Link>
            <Outlet/>
        </>
    )
}