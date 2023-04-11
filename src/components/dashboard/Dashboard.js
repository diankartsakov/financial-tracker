import React from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
} from "@ant-design/icons";

const { Sider, Content } = Layout;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<DesktopOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            Charts
          </Menu.Item>
          <Menu.Item key="3" icon={<FileOutlined />}>
            Files
          </Menu.Item>
        </Menu>
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
};

