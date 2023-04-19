import { Outlet, Link} from "react-router-dom";

export default function DashboardReports() {


    return (
        <>
            <h2>Reports</h2>
            <Link to="history">Transactons History</Link>
            <Outlet/>
        </>
    )
}