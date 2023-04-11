import { Outlet } from "react-router-dom";
import React from "react";
import { Layout} from "antd";

import DashboardMenu from "../../components/menu/DashboardMenu";

const { Sider, Content } = Layout;

export default function DashboardPage() {
  return (
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
            Content goes here.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
