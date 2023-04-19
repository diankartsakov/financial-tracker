import React, { useContext, useState } from 'react';

const ReportContext = React.createContext({
    isLoaded: false,
    reportAccount: {
        reportAccountId: null,
        reportAccountName: null,
    },
    transactions: [],
});

export default function ReportProvider({children}) {
    const [state, setState] = useState({
        isLoaded: false,
        reportAccount: {
            reportAccountId: null,
            reportAccountName: null,
        },
        transactions: [],
    });

    const updateReportAccount = (reportAccount) => {
        setState(s => { 
            return {...s, reportAccount: reportAccount };
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

    const value = {
        ...state,
        updateReportAccount,
        isLoadedUpdate,
        updateTransactionsArr,
    };

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
}

export const useReport = () => useContext(ReportContext);
