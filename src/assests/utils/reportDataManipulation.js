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


function getExpenseTransactionsByDaysForMonth({arr, reportAccountId, month, year,}) {
    // console.log(arr, reportAccountId, month, year,);
    const monthName = getMonthName(month);
    return arr.filter(transaction => transaction.accountId === reportAccountId)
        .reduce((acc, expense) => {
            const { category, date } = expense
            const dateExpense = {
                month: date.getMonth(),
                year: date.getFullYear(),
            }

            const isInDateRange = dateExpense.month === month && dateExpense.year === year;
            
            if (isInDateRange) {
                const day = date.getDate();
                const key = `${day} ${monthName}`;

                if (!acc[category]) {
                        const data = getDaysInMonth(year, month).reduce((acc, value) => {
                            acc[value] = [];
                            return acc;
                        }, {});
                        acc[category] = data;
                        acc[category][key].push(expense);
                } else if (acc[category][key]) {
                    acc[category][key].push(expense)
                    } else {
                            acc[category][key] = [expense];
                    };

            }

            return acc;
            
        }, {});
}

function convertDataToDayColumnsSeries(arr) {
    const result = [];
    Object.entries(arr).map(([key, value]) => {
        const obj = {
            "name" : key,
            "data": [],
        }
        
        const data = Object.entries(value).map(([key, value]) => {

            const x = key;
            const y = value.reduce((acc, {amount}) => {
                return acc + amount;
            }, 0);
            return {
                "x": x,
                "y": y,
            }
        });

        obj["data"] = data;
        result.push(obj);
    });

    return result
}

function getMonthName(month) {
    const monthNumber = month;
    const date = new Date();
    date.setMonth(monthNumber);
    const monthName = date.toLocaleString('default', { month: 'long' });
    // console.log(monthName);
    return monthName;
}

function getDaysInMonth(year, month) {
    const monthName = getMonthName(month);
    const numDays = new Date(year, month + 1, 0).getDate();
    const categories = Array.from({length: numDays}, (_, i) => (i + 1).toString() + ` ${monthName}`);
    return categories;
}

export {
    getExpensesTransactionForMonthYear,
    getExpenseTransactionsByDaysForMonth,
    convertDataToDayColumnsSeries,
    getDaysInMonth,
    getMonthName,
}