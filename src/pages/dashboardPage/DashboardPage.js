import { Outlet } from "react-router-dom";
import React, { useEffect } from "react";
import { Layout } from "antd";
import { useDash } from "./DashboardProvider";
import { useAuth } from "../../firebase/auth";
import { getUserAccounts, getUserAccountsFullInfo, getUserAccountsFrozenTransactionsForUpdate } from "../../services/firebaseFirestoreAccounts";
import { getUserCategories } from "../../services/firebaseFirestoreCategories";
import DashboardMenu from "../../components/dashboardMenu/DashboardMenu";
import LoadingPage from "../../components/loadingPage/LoadingPage";
import accountManager from "../../services/AccountManager";

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
        updateCategories,
        isLoadedUpdate
    } = useDash();

    useEffect(() => {
        if (isLoaded) {
        } else {
            const accounts = async () => {
                const accountsIds = await getUserAccounts(uid);

                const frozenTrns = await getUserAccountsFrozenTransactionsForUpdate(accountsIds);


                await accountManager.processFrozenTransactions(frozenTrns);

                const currentAccount = accountsIds[0] || null;
                const accountsArr = await getUserAccountsFullInfo(uid);
                const userCategories = await getUserCategories(uid);
                updateAccountId(currentAccount);
                updateAccountsIds(accountsIds);
                updateAccountsArr(accountsArr);
                updateCurrentAccountName(
                                        accountsArr.find(acc => acc.accountId === currentAccount)
                                        ?.name
                                        );
                updateCategories(userCategories);
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
                <DashboardMenu accountsArr={accountsArr}></DashboardMenu>
                <Layout className="site-layout">
                    <Content style={{ margin: "16px" }}>
                    <div
                        className="site-layout-background"
                        style={{ padding: 24, minHeight: 360}}
                    >
                        <Outlet/>   
                    </div>
                    </Content>
                </Layout>
            </Layout>

        :
            <LoadingPage/>
        }   
        </>);
}
