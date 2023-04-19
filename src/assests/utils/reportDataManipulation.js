function getExpensesTransactionForMonthYear({arr, reportAccountId, month, year,}) {
    
    return arr.filter(transaction => transaction.accountId === reportAccountId)
        .reduce((acc, expense) => {
            const { category, date } = expense
            const dateExpense = {
                month: date.getMonth(),
                year: date.getFullYear(),
            }

            const isInDateRange = dateExpense.month === month && dateExpense.year === year;
                   
            if (isInDateRange) {
                if (!acc[category]) {
                   acc[category] = [];
                }
                acc[category].push(expense);
            }
            
            return acc;
        }, {});
}



export {
    getExpensesTransactionForMonthYear,
}