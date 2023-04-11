import { Menu } from "antd";
import { logout } from "../../services/firebaseAuthenticationManager";
import {
    ProfileOutlined,
    PieChartOutlined,
    FileOutlined,
  } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function DashboardMenu() {
    const navigate = useNavigate();

    const handleOnClickLogout = () => {
		logout()
            .then(() => navigate("/home"))
			.catch((error) => {
				console.log(error);
			});
  	}

    return (
        <>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                <Menu.Item key="1" icon={<ProfileOutlined />}>
                    Profile
                </Menu.Item>
                <Menu.Item key="2" icon={<PieChartOutlined />}>
                    Accounts
                </Menu.Item>
                <Menu.Item key="3" icon={<FileOutlined />}>
                    Reports
                </Menu.Item>
                <Menu.Item key="4" onClick={handleOnClickLogout}>
                    Logout
                </Menu.Item>
            </Menu>
        </>
    )
}