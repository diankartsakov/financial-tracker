import { Outlet } from 'react-router-dom';
import Dashboard from '../../components/dashboard/Dashboard';

export default function DashboardPage () {

return <>
    <Dashboard></Dashboard>;
    <Outlet></Outlet>
    </>;


}