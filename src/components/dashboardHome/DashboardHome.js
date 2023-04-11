import { useEffect } from "react";
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { getUserAccounts } from "../../services/firebaseFirestoreAccounts";

export default function DashboardHome() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        accountId,
        accountsIds,
        isLoaded,
        updateAccountId,
        updateAccountsIds,
        isLoadedUpdate
    } = useDash();
    // console.log(isLoaded);
    // console.log(accountsIds);
    // console.log(accountId);

    useEffect(() => {
        if (isLoaded) {
            // console.log("no");
        } else {
            const accounts = async () => {
                const accountsIds = await getUserAccounts(uid);
                const currentAccount = accountsIds[0] || null;

                updateAccountId(currentAccount);
                updateAccountsIds(accountsIds);
                isLoadedUpdate(true);
            }

            accounts();
        }
    }, []);

    return (
        <>
            <h1>Welcome {email}! </h1>
            <p>Is Loaded DashContext: {isLoaded ? "true" : "false"}</p>
            <p>Current AccountID: {accountId ? accountId : `${accountId}`}</p>
            <p>Account IDS: {accountsIds?.length ? accountsIds.join(", ") : "[]"}</p>
        </>
    );
}