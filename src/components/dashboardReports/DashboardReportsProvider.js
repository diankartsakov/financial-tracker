import React, { useContext, useState } from 'react';

const ReportContext = React.createContext({
    isLoaded: false,
    reportAccount: {
        reportAccountId: null,
        reportAccountName: null,
    },
    transactions: [],
    frozenTransactions: [],
});

export default function ReportProvider({children}) {
    const [state, setState] = useState({
        isLoaded: false,
        reportAccount: {
            reportAccountId: null,
            reportAccountName: null,
        },
        transactions: [],
        frozenTransactions: [],
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

    
    const updateFrozenTransactionsArr = (frozenTransactions) => {
        setState(s => { 
            return {...s, frozenTransactions: frozenTransactions};
        });
    };

    const value = {
        ...state,
        updateReportAccount,
        isLoadedUpdate,
        updateTransactionsArr,
        updateFrozenTransactionsArr,
    };

    return (
        <ReportContext.Provider value={value}>
            {children}
        </ReportContext.Provider>
    );
}

export const useReport = () => useContext(ReportContext);
