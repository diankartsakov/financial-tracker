import React, { useContext, useState } from 'react';

const ReportContext = React.createContext({
    isLoaded: false,
    reportAccountId: null,
    transactions: [],
});

export default function ReportProvider({children}) {
    const [state, setState] = useState({
        isLoaded: false,
        reportAccountName: null,
        reportAccountId: null,
        transactions: [],
    });

    const updateReportAccountId = (reportAccountId) => {
        setState(s => { 
            return {...s, reportAccountId: reportAccountId };
        });
    };

    const isLoadedUpdate = (isLoaded) => {
        setState(s => { 
            return {...s, isLoaded: isLoaded};
        });
    };

    const updateTransactionsArr = (transactions) => {
        setState(s => { 
            return {...s, transactions: transactions};
        });
    };

    const updateCurrentReportAccountName = (currentAccountName) => {
        setState(s => { 
            return {...s, currentAccountName: currentAccountName};
        });
    };

    const value = {
        ...state,
        updateReportAccountId,
        isLoadedUpdate,
        updateTransactionsArr,
        updateCurrentReportAccountName,
    };

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
}

export const useReport = () => useContext(ReportContext);
