import React, { useContext, useState } from 'react';

// Create a context
const DashboardContext = React.createContext({
    accountId: null,
    accountsIds: null,
    isLoaded: false,
});

export default function DashboardProvider({children}) {
    const [state, setState] = useState({
        accountId: null,
        accountsIds: null,
        isLoaded: false,
        accountsArr: null,
        currentAccountName: null,
        categories: [],
    });

    const updateAccountId = (accountId) => {
        setState(s => { 
            return {...s, accountId: accountId };
        });
    };

    const updateAccountsIds = (accountsIds) => {
        setState(s => {
            return {...s, accountsIds: accountsIds };
        });

    };

    const isLoadedUpdate = (isLoaded) => {
        setState(s => { 
            return {...s, isLoaded: isLoaded};
        });
    };
    const updateAccountsArr = (accountsArr) => {
        setState(s => { 
            return {...s, accountsArr: accountsArr};
        });
    };
    const updateCurrentAccountName = (currentAccountName) => {
        setState(s => { 
            return {...s, currentAccountName: currentAccountName};
        });
    };

    const updateCategories = (categories) => {
        setState(s => {
            return {...s, categories: [...categories]}
        })
    }

    const value = {
        ...state,
        updateAccountId,
        updateAccountsIds,
        isLoadedUpdate,
        updateAccountsArr,
        updateCurrentAccountName,
        updateCategories,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
}

export const useDash = () => useContext(DashboardContext);
