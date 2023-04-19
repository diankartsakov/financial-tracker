import { db } from '../firebase/firebase.js';
import { doc, updateDoc, addDoc, collection, increment } from "firebase/firestore";
import { getAccount } from './firebaseFirestoreAccounts.js';
import { faL } from '@fortawesome/free-solid-svg-icons';

class AccountManager {

  addAccount = async (accountName, uid) => {
    try {

      const docRef = await addDoc(collection(db, "accounts"), {
        name: accountName,
        amount: 0,
        frozenAmount: 0,
        uid: uid
      });

      // console.log("Account created, ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      // console.error("Error creating account: ", e);
    }
  };


  validateBalance = async (accountId, amount) => {
    // console.log(accountId)
    let acc = await getAccount(accountId);

    return acc.amount - amount;

  };

  updateBalance = async (accountId, balance, increase) => {


    const accRef = doc(db, "accounts", accountId);

    if (increase) {
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


  initiateFrozenTransaction = async (accountName, accountId, amount, type, category, when) => {

    const remainingBalance = await this.validateBalance(accountId, amount);

    if (remainingBalance < 0) {
      // console.log("Insufficient Funds !");
      return { ok: false, error: true, message: "Insufficient Funds !" };
    }

    const today = new Date();

    let unfreezeDate = when === 'one-month' ?
                      new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()) :
                      new Date(today.setDate(today.getDate() + 7));

    const transaction = {
      accountName: accountName,
      accountId: accountId,
      amount: Number(amount.toFixed(2)),
      type: type,
      category: category,
      date: today,
      isFrozen: true,
      unfreezeDate: unfreezeDate
    };

    console.log(transaction);

    await Promise.all([
      addDoc(collection(db, "transactions"), transaction),
      this.updateFrozenBalance(accountId, amount, true)
    ]);

    return { 
      ok: true, 
      error: false, 
      message: `Your '${category}' transaction for ${amount.toFixed(2)} BGN will be 
      processed on ${unfreezeDate.getDate()}-${unfreezeDate.getMonth() + 1}-${unfreezeDate.getFullYear()}. 
      ${amount.toFixed(2)} BGN was moved to your Frozen Balance.` }

  };

  updateFrozenBalance = async (accountId, balance, increase) => {

    const accRef = doc(db, "accounts", accountId);

    if (increase) {
      await updateDoc(accRef, {
        frozenAmount: increment(balance),
        amount: increment(-balance)
      });

    }
    else {

      await updateDoc(accRef, {
        frozenAmount: increment(-balance),
        amount: increment(balance)
      });
    }

  };




  // Add a new transaction to the "transactions" collection
  initiateTransaction = async (accountName, accountId, amount, type, category, fromAccountId) => {

    let remainingBalance = 0;

    if (type !== "Deposit") {
      const validateBalanceId = type === "Expense" ? accountId : fromAccountId.key;

      remainingBalance = await this.validateBalance(validateBalanceId, amount);

      if (remainingBalance < 0) {
        // console.log("Insufficient Funds !");
        return { ok: false, error: true, message: "Insufficient Funds !" };
      }


    }

    const transactionAcc = {
      accountName: accountName,
      accountId: accountId,
      amount: Number(amount.toFixed(2)),
      type: type,
      category: category,
      date: new Date(),
      isFrozen: false
    }

    if (type === "Transfer") {
      if (!fromAccountId) {
        return { ok: false, error: true, message: "From account is not selected!" }
      }

      transactionAcc.fromAccountId = fromAccountId.key;

      const toAccTransaction = {
        accountName: accountName,
        accountId: fromAccountId,
        amount: Number(amount.toFixed(2)),
        type: type,
        category: category,
        date: new Date(),
        toAccountId: accountId
      }

      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountId, amount, true),
        this.addTransction(toAccTransaction),
        this.updateBalance(fromAccountId.key, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully transferred ${amount} BGN from '${fromAccountId.label}' account.` }
    } else if (type === "Expense") {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountId, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully paid ${amount} BGN for ${category}.` }
    } else {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountId, amount, true)
      ]);

      return { ok: true, error: false, message: `You have successfully deposited ${amount} BGN.` }
    }
  }


};


let accountManager = new AccountManager();

export default accountManager;



