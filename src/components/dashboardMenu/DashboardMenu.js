import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "../../services/firebaseAuthenticationManager";
import {
    PieChartOutlined,
    WalletOutlined,
    UserOutlined,
    PoweroffOutlined
} from '@ant-design/icons';
import { Layout, Menu, Typography} from 'antd';
import "./dashboardMenu.scss";
import logo from "../../assests/images/logo.png"; 
import dashboardLogo from "../../assests/images/dashboard_logo.webp";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";

const { Sider } = Layout;

const menuSelectKey = {
    "dashboard": "1",
    "accounts": "2",
    "reports": "3",
}

export default function DashboardMenu() {
    const { accountsArr, accountId, updateAccountId, updateCurrentAccountName } = useDash();
    const [accounts] = useState(accountsArr);
    const [collapsed, setCollapsed] = useState(false);
    
    const navigate = useNavigate();

    const location = useLocation().pathname
                        .split("/")
                        .slice(1);
    const currentLocation = location[1] || location[0];

    const handleOnClickLogout = () => {
        logout()
        .then(() => navigate("/home"))
        .catch((error) => {
            console.log(error);
        });
    }

    function getItem(label, key, icon, children) {
        return {
          key,
          icon,
          children,
          label,
        };
    }

    const items = () => [
        getItem(<Link to="" className="ft-accounts-link">Profile</Link>, '1', <UserOutlined />),
        getItem(<Link to="accounts" className="ft-accounts-link" component={Typography.Link}>Accouts</Link>, '2', <WalletOutlined />,
            accounts
            ?
                accounts.map(a => {
                return (getItem(<Link to="accounts" onClick={() => {
                    updateAccountId(a.accountId);
                    updateCurrentAccountName(a.name);
                    navigate("accounts");
                }} className="ft-accounts-subaccounts-p">{a.name}</Link>, a.accountId))})
            :
                []
            ,
        ),
        getItem(<Link to="reports" className="ft-accounts-link">Reports</Link>, '3', 
        <PieChartOutlined />, 
        // [
        //   getItem(<Link to="reports/history">Table</Link>, '3.1'),
        // ]
        ),
    ];
    
    const logoutItem = [
        getItem(
        <Link to="/home" onClick={handleOnClickLogout}>Logout</Link>,
        "Logout",
        <PoweroffOutlined />,
    )];

    return (
        <Sider className="ft-sider-menu" id="ft-sider-menu" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <div
                className="logo-wrapper"
            >
                <img src={dashboardLogo} alt="logo" className="logo-wrapper-logo"/>
            </div>
            <Menu theme="dark" selectedKeys={[menuSelectKey[currentLocation], accountId]} mode="inline" items={items()} />
            <Menu theme="dark" mode="inline" items={logoutItem} />
        </Sider>
    );
}