import { db } from '../firebase/firebase.js';
import { doc, updateDoc, addDoc, collection, increment } from "firebase/firestore";
import { getAccount } from './firebaseFirestoreAccounts.js';

class AccountManager {

  addAccount = async (accountName, uid) => {
    try {

      const docRef = await addDoc(collection(db, "accounts"), {
        name: accountName,
        amount: 0,
        uid: uid
      });

      // console.log("Account created, ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      // console.error("Error creating account: ", e);
    }
  };

  validateAccountBalance =  async (accountId, amount) => {
    // console.log(accountId)
    let acc = await getAccount(accountId);
    return acc.amount - amount >= 0;
  };

  validateBalance = async (accountId, amount) => {
    // console.log(accountId)
    let acc = await getAccount(accountId);

    return acc.amount - amount;

  };

  updateBalance = async (accountId, balance, increase) => {

    const accRef = doc(db, "accounts", accountId);

    if(increase) {
      await updateDoc(accRef, {
        amount: increment(balance)
    });

    }
    else {
  
      await updateDoc(accRef, {
        amount: balance
      });
    }

  };

  addTransction = async (transaction) => {

    try {

      const docRef = await addDoc(collection(db, "transactions"), transaction);

      // console.log("Document written with ID: ", docRef.id);


    } catch (e) {
      // console.error("Error adding document: ", e);
    }

  };



  // Add a new transaction to the "transactions" collection
  initiateTransaction = async(accountName, accountId, amount, type, category, fromAccountId) => {

    let remainingBalance = 0;
    
    if (type !== "Deposit") {
        const idForValidateBalance = type === "Expense" ? accountId : fromAccountId;
        const isBalanceValid = await this.validateAccountBalance(idForValidateBalance, amount)
    
        if (!isBalanceValid) {
            // console.log("Insufficient Funds !");
            return{ok: false, error: true, message: "Insufficient Funds !"}
        }

        remainingBalance = await this.validateBalance(idForValidateBalance, amount); 
    }

    const transactionAcc =  {
        accountName: accountName,
        accountId: accountId,
        amount: Number(amount),
        type: type,
        category: category,
        date: new Date()
    }
    
    if (type === "Transfer") {
        if (!fromAccountId) {
            return  {ok: false, error: true, message:"From account is not selected!"}
        }

        transactionAcc.fromAccountId = fromAccountId;

        const toAccTransaction = {
            accountName: accountName,
            accountId: fromAccountId,
            amount: Number(amount),
            type: type,
            category: category,
            date: new Date(),
            toAccountId: accountId
        }

        const result = await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, amount, true),
            this.addTransction(toAccTransaction),
            this.updateBalance(fromAccountId, remainingBalance)
        ]);
        // console.log(result);    
        return  {ok: true, error: false, message: `You transfer ${amount} BGN.`}
    } else if (type === "Expense") {
        const result =  await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, remainingBalance)
          ]);
        //   console.log(result);
        return {ok: true, error: false, message: `You pay ${amount} BGN for ${category}`}
    } else {
        const result = await Promise.all([
            this.addTransction(transactionAcc), 
            this.updateBalance(accountId, amount, true)
        ]);

        // console.log(result);
        return  {ok: true, error: false, message: `You deposit ${amount} BGN.`}
    }
  }

//   initiateTransaction = async (accountName, accountId, amount, type, category, fromAccountId) => {


//     // type = 'Transfer' , Expense, Deposit
//     // category = 'Card Deposit' , 'Internal Transfer' or Expense Category

//     let remainingBalance;

//     if (type === 'Expense') {

//       remainingBalance = await this.validateBalance(accountId, amount);

//     }
//     else if (type === 'Transfer') {

//       console.log ("Enter Transfer case to Validate");

//       remainingBalance = await this.validateBalance(fromAccountId, amount);

//     }

//     if (remainingBalance < 0 && type !== 'Deposit') {

//       console.log('Insufficient Funds !!!');

//       return;

//     }

//     let transaction = {
      
//       accountName: accountName,
//       accountId: accountId,
//       amount: Number(amount),
//       type: type,
//       category: category,
//       date: new Date()

//     };

//     if (fromAccountId) { // type = 'Transfer'

//       transaction.fromAccountId = fromAccountId;

//       let toAccTransaction = {

//         accountName: accountName,
//         accountId: fromAccountId,
//         amount: Number(amount),
//         type: type,
//         category: category,
//         date: new Date(),
//         toAccountId: accountId

//       };

//     const result = await Promise.all([
//         this.addTransction(transaction), 
//         this.updateBalance(accountId, amount, true),
//         this.addTransction(toAccTransaction),
//         this.updateBalance(fromAccountId, remainingBalance)
//       ]);

//         console.log(result);    

//     }
//     else {
//       const result = type === 'Expense' ? 
//       await Promise.all([
//         this.addTransction(transaction), 
//         this.updateBalance(accountId, remainingBalance)
//       ]) :  // type = 'Deposit'
//       await Promise.all([
//         this.addTransction(transaction), 
//         this.updateBalance(accountId, amount, true)
//       ]);
      

//     }

};


let accountManager = new AccountManager();

export default accountManager;



