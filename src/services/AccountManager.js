import { db } from '../firebase/firebase.js';
import { doc, updateDoc, addDoc, collection, increment } from "firebase/firestore";
import { getAccount } from './firebaseFirestoreAccounts.js';
import { faL } from '@fortawesome/free-solid-svg-icons';

class AccountManager {

  addAccount = async (accountName, uid) => {
    try {

      const docRef = await addDoc(collection(db, "accounts"), {
        name: accountName,
        amount: '0.00',
        frozenAmount: '0.00',
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

    console.log(acc);

    return acc.amount - amount;

  };

  updateBalance = async (accountId, newBalance, isFrozen) => {


    if (!isFrozen) {

      const accRef = doc(db, "accounts", accountId);

      await updateDoc(accRef, {
        amount: newBalance.toFixed(2)
      });
    }
    else {
      const accRef = doc(db, "accounts", accountId);

      await updateDoc(accRef, {
        frozenAmount: newBalance.toFixed(2)
      });
    }


  };



  addTransction = async (transaction) => {

    try {

      const docRef = await addDoc(collection(db, "transactions"), transaction);

      console.log("Document written with ID: ", docRef.id);


    } catch (e) {
      // console.error("Error adding document: ", e);
    }

  };

  // Add a new transaction to the "transactions" collection
  initiateTransaction = async (accountObj, amount, type, category, fromAccountId) => {

    let remainingBalance = 0;

    if (type !== "Deposit") {
      type === "Expense" ?

        remainingBalance = Number(accountObj.amount) - amount :
        //case Transfer
        remainingBalance = Number(fromAccountId.amount) - amount;

      if (remainingBalance < 0) {
        // console.log("Insufficient Funds !");
        return { ok: false, error: true, message: "Insufficient Funds !" };
      }

    }

    const receiverNewBalance = Number(accountObj.amount) + amount;

    const transactionAcc = {
      accountName: accountObj.name,
      accountId: accountObj.accountId,
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
      transactionAcc.fromAccountId = fromAccountId.accountId;

      const toAccTransaction = {
        accountName: fromAccountId.name,
        accountId: fromAccountId.accountId,
        amount: Number(amount.toFixed(2)),
        type: type,
        category: category,
        date: new Date(),
        isFrozen: false,
        toAccountId: accountObj.accountId
      }




      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, receiverNewBalance),
        this.addTransction(toAccTransaction),
        this.updateBalance(fromAccountId.accountId, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully transferred ${amount} BGN from '${fromAccountId.name}' account.` }

    } else if (type === "Expense") {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, remainingBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully paid ${amount} BGN for ${category}.` }
    } else {
      await Promise.all([
        this.addTransction(transactionAcc),
        this.updateBalance(accountObj.accountId, receiverNewBalance)
      ]);

      return { ok: true, error: false, message: `You have successfully deposited ${amount} BGN.` }
    }
  }



  initiateFrozenTransaction = async (accountObj, amount, type, category, when) => {

    const remainingBalance = Number(accountObj.amount) - amount;

    if (remainingBalance < 0) {
      // console.log("Insufficient Funds !");
      return { ok: false, error: true, message: "Insufficient Funds !" };
    }

    const newFrozenBalance = Number(accountObj.frozenAmount) + amount;

    const today = new Date();

    let unfreezeDate = when === 'one-month' ?
      new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()) :
      new Date(today.setDate(today.getDate() + 7));

    const transaction = {
      accountName: accountObj.name,
      accountId: accountObj.accountId,
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
      this.updateBalance(accountObj.accountId, newFrozenBalance, true)
    ]);

    return {
      ok: true,
      error: false,
      message: `Your '${category}' transaction for ${amount.toFixed(2)} BGN will be 
      processed on ${unfreezeDate.getDate()}-${unfreezeDate.getMonth() + 1}-${unfreezeDate.getFullYear()}. 
      ${amount.toFixed(2)} BGN was moved to your Frozen Balance.`
    }

  };

};


let accountManager = new AccountManager();

export default accountManager;



