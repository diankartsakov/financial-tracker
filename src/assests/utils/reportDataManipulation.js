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
    return arr.filter(transaction => transaction.accountId === reportAccountId)
        .reduce((acc, expense) => {
            const { category, date } = expense
            const dateExpense = {
                month: date.getMonth(),
                year: date.getFullYear(),
            }

            const day = date.getDate();

            // console.log(dateExpense.day);

            const isInDateRange = dateExpense.month === month && dateExpense.year === year;
                  
            if (isInDateRange) {
                if (!acc[category]) {
                   acc[category] = {
                        [day]: [expense]
                   };
                } else if (acc[category][day]) {
                    acc[category][day].push(expense)
                } else {
                        acc[category][day] = [expense]
                };
            }
            
            return acc;
        }, {});
}

// {
//     "name": "Column 1",
//     "data": [
//         {
//             "x": "item1",
//             "y": 10
//         },
//         {
//             "x": "Item 2",
//             "y": "0"
//         },
//         {
//             "x": "Item 3",
//             "y": 30
//         },
//         {
//             "x": "Item 4",
//             "y": 40
//         }
//     ]
// },
function convertDataToDayColumnsSeries(arr) {
    const result = [];
    Object.entries(arr).map(([key, value]) => {
        // console.log(key, value);
        const obj = {
            "name" : key,
            "data": [],
        }
        
        const data = Object.entries(value).map(([key, value]) => {
            // console.log(key);
            const x = key;
            // console.log(value);
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
        // const data = value.map(arr => console.log(data) )
        
    });

    return result
}

function getDaysInMonth(year, month) {
    const currentDate = new Date();
    const numDays = new Date(year, month + 1, 0).getDate();
    const categories = Array.from({length: numDays}, (_, i) => (i + 1).toString());
    // console.log(categories);
    return categories;
}

export {
    getExpensesTransactionForMonthYear,
    getExpenseTransactionsByDaysForMonth,
    convertDataToDayColumnsSeries,
    getDaysInMonth,

}