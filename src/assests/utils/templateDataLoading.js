import { useEffect, useState } from "react";
import { useReport } from "../dashboardReports/DashboardReportsProvider"

function PieChartExpense() {
    const {transactions, reportAccount, isLoaded} = useReport();
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [reportTransactions, setReportTransactions] = useState([]);

    // console.log(isLoaded);

    useEffect(() => {
        if (isLoaded) {
            const currentReportExpenseTransactions = transactions.filter(transaction => transaction.type === "Expense");
            const accountReportTransactions = currentReportExpenseTransactions.filter(transaction => transaction.accountId === reportAccount.reportAccountId);
            setExpenseTransactions(currentReportExpenseTransactions);
            // console.log("on loading");
            setReportTransactions(accountReportTransactions);
            // setIsLoading(false);
        } else {
            // console.log("second use effect")
            const accountReportTransactions = expenseTransactions.filter(transaction => transaction.accountId === reportAccount.reportAccountId);
            setReportTransactions(accountReportTransactions);
        }
        

        // setIsLoading(false);
    }, [reportAccount, isLoaded]);

    
    return (<>
        { !isLoaded ? <>Loading...</>
        :    
        <div>
            {
                reportTransactions.length 
                ? 
                reportTransactions.map(transaction => <p key={transaction.id}>{transaction.category}-{transaction.amountString}</p>)
                :
                <p>No Expenses</p>
            }
        </div>
        }
    </>)
}