import { auth, db } from '../firebase/firebase.js';
import { addDoc, collection } from "firebase/firestore";
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

    return acc.amount >= amount;

  };

  updateBalance = async (accountId) => {

    

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
  initiateTransaction = async (accountId, amount, type, category, fromAccountId) => {

    // type = 'Transfer' , Expense, Deposit
    // category = 'Card Deposit' , 'Internal Transfer' or Expense Category

    let sufficientBalance;

    if(type === 'Expense'){

      sufficientBalance = await this.validateBalance(accountId, amount);

    }
    else if(type === 'Transfer'){

      sufficientBalance = await this.validateBalance(fromAccountId, amount);

    }

    if (!sufficientBalance && type !== 'Deposit'){

      console.log('Insufficient Funds !!!');

      return;

    }

    let transaction = {

      accountId: accountId,
      amount: amount,
      type: type,
      category: category,
      date: new Date()

    };

    if (fromAccountId) {

      transaction.fromAccountId = fromAccountId;

      let toTransaction = {

        accountId: fromAccountId,
        amount: amount,
        type: type,
        category: category,
        date: new Date(),
        toAccountId: accountId

      };

      await Promise.all([this.addTransction(transaction), this.addTransction(toTransaction)]);

    }
    else {

      await this.addTransction(transaction);

    }

  };
}

let accountManager = new AccountManager();

export default accountManager;



