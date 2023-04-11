import { Outlet } from "react-router-dom";
import React from "react";
import { Layout} from "antd";

import DashboardMenu from "../../components/menu/DashboardMenu";
import DashboardProvider from "../../components/menu/DashboardProvider";
import DashboardHome from "../../components/dashboardHome/DashboardHome";

const { Sider, Content } = Layout;

export default function DashboardPage() {
  return (
        <DashboardProvider>
            <Layout style={{ minHeight: "100vh" }}>
                <Sider>
                        <DashboardMenu/>
                </Sider>
                <Layout className="site-layout">
                    <Content style={{ margin: "16px" }}>
                    <div
                        className="site-layout-background"
                        style={{ padding: 24, minHeight: 360 }}
                    >
                        <Outlet/>
                        
                    </div>
                    </Content>
                </Layout>
            </Layout>
        </DashboardProvider>
  );
}
