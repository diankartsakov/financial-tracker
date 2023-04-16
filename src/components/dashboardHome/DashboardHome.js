
import { useAuth } from "../../firebase/auth";
import { useDash } from "../../pages/dashboardPage/DashboardProvider";
import { useState } from "react";
import "./dashboardHome.scss"
import { getDateWithSuffixDay } from "../../assests/utils/utils";

export default function DashboardHome() {
    const {authUser: {email}, authUser: {uid}} = useAuth();
    const {
        accountId,
        accountsIds,
        isLoaded,
        isLoadedUpdate
    } = useDash();
    const [currentDate] = useState(getDateWithSuffixDay());

    return (
        <>
            <div className="dashboard-wrapper">
                <div className="dashboard-greeting">
                    <h1 className="dashboard-greeting-greet">Welcome back, {email}! </h1>
                    <p className="dashboard-greeting-date">{currentDate}</p>
                </div>
                <p>Is Loaded DashContext: {isLoaded ? "true" : "false"}</p>
                <p>Current AccountID: {accountId ? accountId : `${accountId}`}</p>
                <p>Account IDS: {accountsIds?.length ? accountsIds.join(", ") : "[]"}</p>                
            </div>
        </>
    );
}