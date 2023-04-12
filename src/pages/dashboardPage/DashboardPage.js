import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { Layout } from "antd";
import { useDash } from "./DashboardProvider";
import { useAuth } from "../../firebase/auth";
import { getUserAccounts, getUserAccountsFullInfo } from "../../services/firebaseFirestoreAccounts";
import DashboardMenu from "../../components/dashboardMenu/DashboardMenu";

const { Content } = Layout;

export default function DashboardPage() {
    const { authUser: {uid} } = useAuth();
    const {
        isLoaded,
        accountsArr,
        updateAccountId,
        updateAccountsIds,
        updateAccountsArr,
        updateCurrentAccountName,
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
                updateAccountsArr(accountsArr);
                updateCurrentAccountName(
                                        accountsArr.find(acc => acc.accountId === currentAccount)
                                        ?.name
                                        );
                isLoadedUpdate(true);
            };

            accounts();
        }
    }, []);


    return (
        <>
        {isLoaded
        ?
            <Layout style={{ minHeight: "100vh" }}>
                {/* <Sider>
                        <DashboardMenu/>
                </Sider> */}
                <DashboardMenu accountsArr={accountsArr}></DashboardMenu>
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
        :
        <div>L O A D I N G . . .</div>}
        </>
  );
}
