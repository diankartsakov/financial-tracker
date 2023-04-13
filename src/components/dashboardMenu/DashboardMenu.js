import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/firebaseAuthenticationManager";
import {
    PieChartOutlined,
    WalletOutlined,
    UserOutlined,
    PoweroffOutlined
} from '@ant-design/icons';

import { Layout, Menu, Typography} from 'antd';
import { useDash } from "../../pages/dashboardPage/DashboardProvider";

const { Sider } = Layout;

export default function DashboardMenu() {
    const { accountsArr, updateAccountId, updateCurrentAccountName } = useDash();
    const [accounts] = useState(accountsArr);
    const [collapsed, setCollapsed] = useState(false);
    
    const navigate = useNavigate();
    
    function getItem(label, key, icon, children) {
        return {
          key,
          icon,
          children,
          label,
        };
      }

    const handleOnClickLogout = () => {
        logout()
            .then(() => navigate("/home"))
            .catch((error) => {
                console.log(error);
            });
    }
      
    const items = () => [
        getItem(<Link to="">Profile</Link>, '1', <UserOutlined />),
        getItem(<Link to="accounts"  component={Typography.Link}>Accouts</Link>, '2', <WalletOutlined />,
            accounts
            ?
                accounts.map(a => {
                return (getItem(<p onClick={() => {
                    updateAccountId(a.accountId);
                    updateCurrentAccountName(a.name);
                    navigate("accounts");
                }}>{a.name}</p>, a.accountId))})
            :
                []
        ),
        getItem(<Link to="reports">Reports</Link>, '3', <PieChartOutlined />, [
          getItem('Tom', '3.1'),
          getItem('Bill', '3.2'),
          getItem('Alex', '3.3'),
        ]),
    ];
    
    const logoutItem = [
        getItem(
        <Link to="/home" onClick={handleOnClickLogout}>Logout</Link>,
        "Logout",
        <PoweroffOutlined />,
        )]



    return (
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items()} />
            <Menu theme="dark" mode="inline" items={logoutItem} />
        </Sider>
    );
}