function getExpenses(days=30) {
    const categories = ['Shops', 'Food', 'Hobbies', 'Credit', 'Taxes', 'Car'];
    const accounts = [
      { reportAccountId: 'A2ejBSOPsVU3hxgy6ql9', reportAccountName: 'TEST NEW ACCOUNT' },
      { reportAccountId: 'A2ejBSOPsVU3hxgy6ql9', reportAccountName: 'TEST NEW ACCOUNT' },
      // { reportAccountId: 'JA72tSY61CTQXt9oBMNN', reportAccountName: 'acc' },
    ];
    const expenses = [];
    
    for (let i = 0; i < days; i++) {
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const category = categories[categoryIndex];
      
      const accountIndex = Math.floor(Math.random() * accounts.length);
      const account = accounts[accountIndex];
  
      const day = Math.floor(Math.random() * 30) + 1; // Random day between 1-30
      const month = Math.floor(Math.random() * 2) + 2;
      const date = new Date(2023, 3, day, 12, 0, 0); // April 2023 at 12pm
  
      const amount = Math.floor(Math.random() * 1000) / 100; // Random amount between 0.00-9.99
      const amountString = amount.toFixed(2) + ' BGN';
  
      const expense = {
        accountId: account.reportAccountId,
        accountName: account.reportAccountName,
        amount,
        amountString,
        category,
        date,
        id: `expense${i}`,
        type: 'Expense',
      };
  
      expenses.push(expense);
    }
  
    // console.log(expenses);
  
    return expenses;
}


export {
    getExpenses,
}