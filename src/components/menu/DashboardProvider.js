import React, { useContext, useState } from 'react';

// Create a context
const DashboardContext = React.createContext({
    accountId: null,
    accountsIds: [],
});

export default function DashboardProvider({children}) {
    const [state, setState] = useState({
        accountId: null,
        accountsIds: [],
    });

    const updateAccountId = (accountId) => {
        setState({ ...state, accountId: accountId });
    };

    const updateAccountsIds = (accountsIds) => {
        setState({ ...state, accountsIds: accountsIds });
    };

    const value = {
        ...state,
        updateAccountId,
        updateAccountsIds,
    };

    return (
        <DashboardContext.Provider value={value}>
                {children}
        </DashboardContext.Provider>
    );
}

export const useDash = () => useContext(DashboardContext);
