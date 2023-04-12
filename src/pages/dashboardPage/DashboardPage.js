import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { Layout } from "antd";
import { useDash } from "./DashboardProvider";
import { useAuth } from "../../firebase/auth";
import { getUserAccounts, getUserAccountsFullInfo } from "../../services/firebaseFirestoreAccounts";
import DashboardMenu from "../../components/menu/DashboardMenu";
// import DashboardProvider from "./DashboardProvider";

const { Sider, Content } = Layout;

export default function DashboardPage() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        isLoaded,
        updateAccountId,
        updateAccountsIds,
        updateAccountsNames,
        isLoadedUpdate
    } = useDash();

    useEffect(() => {
        if (isLoaded) {
            // console.log("no");
        } else {
            const accounts = async () => {
                const accountsIds = await getUserAccounts(uid);
                const currentAccount = accountsIds[0] || null;
                const accountsArr = await getUserAccountsFullInfo(uid);

                updateAccountId(currentAccount);
                updateAccountsIds(accountsIds);
                updateAccountsNames(accountsArr);
                isLoadedUpdate(true);
            }

            accounts();
        }
    }, []);


    return (
        <>
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
        </>
  );
}
