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

      console.log("Account created, ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error creating account: ", e);
    }
  };

  validateBalance = async (accountId, amount) => {

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

      console.log("Document written with ID: ", docRef.id);


    } catch (e) {
      console.error("Error adding document: ", e);
    }

  };

  // Add a new transaction to the "transactions" collection

  initiateTransaction = async (accountName, accountId, amount, type, category, fromAccountId) => {


    // type = 'Transfer' , Expense, Deposit
    // category = 'Card Deposit' , 'Internal Transfer' or Expense Category

    let remainingBalance;

    if (type === 'Expense') {

      remainingBalance = await this.validateBalance(accountId, amount);

    }
    else if (type === 'Transfer') {

      console.log ("Enter Transfer case to Validate");

      remainingBalance = await this.validateBalance(fromAccountId, amount);

    }

    if (remainingBalance < 0 && type !== 'Deposit') {

      console.log('Insufficient Funds !!!');

      return;

    }

    let transaction = {
      
      accountName: accountName,
      accountId: accountId,
      amount: Number(amount),
      type: type,
      category: category,
      date: new Date()

    };

    if (fromAccountId) { // type = 'Transfer'

      transaction.fromAccountId = fromAccountId;

      let toAccTransaction = {

        accountName: accountName,
        accountId: fromAccountId,
        amount: Number(amount),
        type: type,
        category: category,
        date: new Date(),
        toAccountId: accountId

      };

      await Promise.all([
        this.addTransction(transaction), 
        this.updateBalance(accountId, amount, true),
        this.addTransction(toAccTransaction),
        this.updateBalance(fromAccountId, remainingBalance)
      ]);

    }
    else {
      type === 'Expense' ? 
      await Promise.all([
        this.addTransction(transaction), 
        this.updateBalance(accountId, remainingBalance)
      ]) :  // type = 'Deposit'
      await Promise.all([
        this.addTransction(transaction), 
        this.updateBalance(accountId, amount, true)
      ]);

    }

  };
}

let accountManager = new AccountManager();

export default accountManager;



